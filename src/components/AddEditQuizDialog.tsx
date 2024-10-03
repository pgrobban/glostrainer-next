import { required, showError } from "@/helpers/formUtils";
import { CloseIcon } from "@/helpers/icons";
import {
  CommonDialogProps,
  ContentToGenerate,
  QuizCard,
  QuizOrder,
  Term,
  TermListObject,
} from "@/helpers/types";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { UUID } from "crypto";
import { useCallback, useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import utilClassInstances from "../helpers/utilClassInstances";
import QuizBuilderTable from "./QuizBuilderTable";
import SwedishDefinitionLabel from "./SwedishDefinitionLabel";
import GenerateCardContentSelector from "./GeneratedCardContentSelector";
import { getCardCount, getTermCount } from "@/helpers/quizUtils";
const { localStorageHelperInstance } = utilClassInstances;

export const MINIMUM_QUIZ_NAME_LENGTH = 3;

const defaultQuizSaveModel = {
  name: "",
  cards: [] as QuizCard[],
  order: "random" as QuizOrder,
};
export type QuizSaveModel = typeof defaultQuizSaveModel;

export type CheckedItems = Record<UUID, UUID[]>; // { [termListId]: termId[] }

interface Props extends CommonDialogProps {
  editingQuizId?: UUID | null;
  onSave: (quizSaveModel: QuizSaveModel) => void;
}

const AddEditQuizDialog: React.FC<Props> = ({
  open,
  editingQuizId,
  onClose,
  onSave,
}) => {
  const [initialValues, setInitialValues] = useState<QuizSaveModel>({
    ...defaultQuizSaveModel,
  });

  const [selectedContentToGenerate, setSelectedContentToGenerate] = useState<
    ContentToGenerate[]
  >(["swedish_to_definition", "definition_to_swedish"]);

  const mode = editingQuizId ? "edit" : "add";
  const cachedTermLists = localStorageHelperInstance.getCachedTermLists();
  const termListsObject = cachedTermLists.reduce(
    (acc, termList) => ({ ...acc, [termList.id]: termList.terms }),
    {}
  ) as TermListObject;

  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});

  const getCheckedItemsFromCards = useCallback(
    (cards: QuizCard[]) => {
      const result: CheckedItems = cachedTermLists.reduce(
        (acc, termList) => ({
          ...acc,
          [termList.id]: [],
        }),
        {}
      );
      cards.forEach((card) => {
        const hasTermList = cachedTermLists.some(
          (cachedTermList) => cachedTermList.id === card.termListId
        );
        if (hasTermList) {
          (result[card.termListId] ??= []).push(card.termId);
        } else {
          console.error("*** cannot find term list with id", card.termListId);
        }
      });
      return result;
    },
    [cachedTermLists]
  );

  useEffect(() => {
    if (mode === "edit" && editingQuizId) {
      const foundQuiz = localStorageHelperInstance.getQuizById(editingQuizId);
      if (!foundQuiz) {
        return;
      }

      setInitialValues({
        name: foundQuiz.name,
        cards: foundQuiz.cards,
        order: foundQuiz.order,
      });

      setCheckedItems(getCheckedItemsFromCards(foundQuiz.cards));
    } else {
      setInitialValues({ ...defaultQuizSaveModel });
      setCheckedItems(getCheckedItemsFromCards([]));
    }
  }, [open, cachedTermLists, mode, editingQuizId, getCheckedItemsFromCards]);

  const onSubmit = (values: QuizSaveModel) => {
    const { name, cards, order } = values;
    const listWithName = localStorageHelperInstance.getQuizByName(name);
    const validName = !listWithName || listWithName.id === editingQuizId; // allow overwriting the editing list with the same name as a UX "feature"
    if (!validName) {
      return { name: "A quiz with this name already exists." };
    }

    onSave({ name, cards, order });
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const validate = (values: QuizSaveModel) => {
    const { name, cards } = values;
    const errors: { [key in keyof QuizSaveModel]?: string } = {};
    if ((name ?? "").trim().length < MINIMUM_QUIZ_NAME_LENGTH) {
      errors.name = `Please enter at least ${MINIMUM_QUIZ_NAME_LENGTH} characters.`;
    }
    if (cards.length === 0) {
      errors.cards = "Please add at least one card to the list.";
    }

    return errors;
  };

  const getIsParentChecked = (termListId: UUID) => {
    if (!checkedItems[termListId] || !termListsObject[termListId]) {
      return false;
    }
    return (
      checkedItems[termListId].length === termListsObject[termListId].length
    );
  };

  const getIsParentIndeterminate = (termListId: UUID) => {
    if (!checkedItems[termListId] || !termListsObject[termListId]) {
      return false;
    }
    return (
      !getIsParentChecked(termListId) && checkedItems[termListId].length > 0
    );
  };

  const getIsChildChecked = (termListId: UUID, term: Term) => {
    if (!checkedItems[termListId]) {
      return false;
    }
    return checkedItems[termListId].includes(term.id);
  };

  return (
    <Form
      key={initialValues.name}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      mutators={{
        handleParentToggled: (args, state, utils) => {
          const [toggledTermListId, checked] = args;
          utils.changeValue(state, "cards", () => {
            const checkedItemsClone = { ...checkedItems };
            // @ts-expect-error
            let newCardsValue: QuizCard[] = [...state.formState.values.cards];
            if (checked) {
              checkedItemsClone[toggledTermListId] = termListsObject[
                toggledTermListId
              ].map((term) => term.id);
              checkedItemsClone[toggledTermListId].forEach((termId) => {
                selectedContentToGenerate.forEach((contentToGenerate) => {
                  // @ts-expect-error
                  const hasCard = state.formState.values.cards.some(
                    (card: QuizCard) =>
                      card.termId === termId &&
                      card.contentToGenerate === contentToGenerate
                  );
                  if (!hasCard) {
                    newCardsValue.push(
                      localStorageHelperInstance.createQuizCard(
                        toggledTermListId,
                        termId,
                        contentToGenerate
                      )
                    );
                  }
                });
              });
            } else {
              checkedItemsClone[toggledTermListId].forEach((termId) => {
                newCardsValue = newCardsValue.filter(
                  (card) => card.termId !== termId
                );
              });
              checkedItemsClone[toggledTermListId] = [];
            }
            setCheckedItems(checkedItemsClone);
            return newCardsValue;
          });
        },
        handleChildToggled: (args, state, utils) => {
          const [termListId, toggledTermId, checked] = args;
          utils.changeValue(state, "cards", () => {
            const checkedItemsClone = { ...checkedItems };
            // @ts-expect-error
            let newCardsValue: QuizCard[] = [...state.formState.values.cards];

            if (checked) {
              checkedItemsClone[termListId].push(toggledTermId);
              selectedContentToGenerate.forEach((contentToGenerate) => {
                newCardsValue.push(
                  localStorageHelperInstance.createQuizCard(
                    termListId,
                    toggledTermId,
                    contentToGenerate
                  )
                );
              });
            } else {
              checkedItemsClone[termListId] = checkedItems[termListId].filter(
                (termId) => termId !== toggledTermId
              );
              newCardsValue = newCardsValue.filter(
                (card) => card.termId !== toggledTermId
              );
            }
            setCheckedItems(checkedItemsClone);
            return newCardsValue;
          });
        },
        handleRemoveCard: (args, state, utils) => {
          const [cardId] = args;
          utils.changeValue(state, "cards", () => {
            // @ts-expect-error
            const newCardsValue = state.formState.values.cards.filter(
              (card: QuizCard) => card.id !== cardId
            );
            setCheckedItems(getCheckedItemsFromCards(newCardsValue));
            return newCardsValue;
          });
        },
        moveCard: (args, state, utils) => {
          const [cardId, newIndex] = args;
          utils.changeValue(state, "cards", () => {
            // @ts-expect-error
            const newCardsValue = [...state.formState.values.cards];
            const oldIndex = newCardsValue.findIndex(
              (card) => card.id === cardId
            );
            const [removed] = newCardsValue.splice(oldIndex, 1);
            newCardsValue.splice(newIndex, 0, removed);
            return newCardsValue;
          });
        },
      }}
      render={({
        handleSubmit,
        submitting,
        errors,
        values,
        pristine,
        form,
      }) => (
        <form onSubmit={handleSubmit} autoComplete="off">
          <Dialog
            fullScreen={fullScreen}
            data-testid={"add-edit-quiz-dialog"}
            open={open}
            onClose={onClose}
            sx={{
              "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                  width: "100%",
                  maxWidth: theme.breakpoints.values.md,
                },
              },
            }}
            disableRestoreFocus
          >
            <AppBar sx={{ position: "relative" }}>
              <Toolbar>
                <IconButton onClick={onClose}>
                  <CloseIcon />
                </IconButton>
                <Typography
                  sx={{ ml: 2, flex: 1 }}
                  variant="h6"
                  component="div"
                >
                  {mode === "edit" ? "Edit quiz deck" : "Create quiz deck"}
                </Typography>
                <Button
                  type="submit"
                  disabled={submitting}
                  color="inherit"
                  onClick={handleSubmit}
                >
                  Save and close
                </Button>
                <Button disabled={true} color="inherit" onClick={() => {}}>
                  Save and play
                </Button>
              </Toolbar>
            </AppBar>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                mb={2}
              >
                <Field<string>
                  name="name"
                  render={({ input, meta }) => (
                    <TextField
                      autoFocus
                      data-testid={"quiz-name"}
                      required
                      label="Deck name"
                      fullWidth
                      value={input.value}
                      onChange={input.onChange}
                      error={showError(meta)}
                      helperText={
                        showError(meta) && (meta.error || meta.submitError)
                      }
                      sx={{ mr: 3 }}
                    />
                  )}
                />

                <Field<QuizOrder>
                  name="order"
                  validate={required}
                  render={({ input, meta }) => (
                    <FormControl fullWidth>
                      <FormLabel id="order-group-label">Order</FormLabel>
                      <RadioGroup
                        aria-labelledby="order-group-label"
                        value={input.value}
                        name="order-group"
                        row
                        onChange={input.onChange}
                      >
                        <FormControlLabel
                          value="random"
                          control={<Radio />}
                          label="Random"
                        />
                        <FormControlLabel
                          value="in_order"
                          control={<Radio />}
                          label="Use list order"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </Box>
              <Box mb={2}>
                <Typography>
                  1. Select card content to automatically generate
                </Typography>

                <GenerateCardContentSelector
                  value={selectedContentToGenerate}
                  onChange={setSelectedContentToGenerate}
                />
              </Box>

              <Box display={"flex"}>
                <Box flexBasis={"30%"} mr={1}>
                  <Typography>2. Select terms below</Typography>
                  <Box
                    height={400}
                    border={"1px solid gray"}
                    overflow={"auto scroll"}
                  >
                    <SimpleTreeView>
                      {cachedTermLists.map((termList) => (
                        <TreeItem
                          key={`-term-list-tree-item-${termList.name}`}
                          itemId={termList.name}
                          label={
                            <FormControlLabel
                              disabled={selectedContentToGenerate.length === 0}
                              label={termList.name}
                              control={
                                <Checkbox
                                  onClick={(e) => e.stopPropagation()}
                                  checked={getIsParentChecked(termList.id)}
                                  indeterminate={getIsParentIndeterminate(
                                    termList.id
                                  )}
                                  onChange={(_, checked) => {
                                    form.mutators.handleParentToggled(
                                      termList.id,
                                      checked
                                    );
                                  }}
                                />
                              }
                            />
                          }
                        >
                          {termList.terms.map((term) => (
                            <TreeItem
                              key={`-term-list-tree-item-${term.swedish}-${term.definition}`}
                              itemId={`${term.swedish}-${term.definition}`}
                              label={
                                <FormControlLabel
                                  disabled={
                                    selectedContentToGenerate.length === 0
                                  }
                                  sx={{ lineHeight: 1 }}
                                  label={<SwedishDefinitionLabel term={term} />}
                                  control={
                                    <Checkbox
                                      checked={getIsChildChecked(
                                        termList.id,
                                        term
                                      )}
                                      onChange={(_, checked) =>
                                        form.mutators.handleChildToggled(
                                          termList.id,
                                          term.id,
                                          checked
                                        )
                                      }
                                    />
                                  }
                                />
                              }
                            />
                          ))}
                        </TreeItem>
                      ))}
                    </SimpleTreeView>
                  </Box>
                </Box>

                <Box flexBasis={"70%"}>
                  <Typography>3. Review your list</Typography>
                  <Field<QuizCard[]>
                    name="cards"
                    render={({ input, meta }) => (
                      <>
                        <Box
                          height={400}
                          overflow={"auto scroll"}
                          border={"1px solid gray"}
                        >
                          <QuizBuilderTable
                            cards={input.value}
                            onRemoveCard={form.mutators.handleRemoveCard}
                            moveCard={form.mutators.moveCard}
                          />
                        </Box>
                        <Box mt={1}>
                          {showError(meta) && (
                            <Typography color="red">{meta.error}</Typography>
                          )}
                          {!showError(meta) && (
                            <Typography>
                              {getCardCount(form.getState().values.cards)}{" "}
                              card(s) in deck, generated from{" "}
                              {getTermCount(form.getState().values.cards)}{" "}
                              term(s)
                            </Typography>
                          )}
                        </Box>
                      </>
                    )}
                  />
                </Box>
              </Box>
            </DialogContent>
          </Dialog>
        </form>
      )}
    />
  );
};

export default AddEditQuizDialog;
