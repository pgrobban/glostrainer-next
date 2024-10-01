import { required, showError } from "@/helpers/formUtils";
import { CloseIcon } from "@/helpers/icons";
import {
  CommonDialogProps,
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
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import utilClassInstances from "../helpers/utilClassInstances";
import QuizBuilderTable from "./QuizBuilderTable";
import SwedishDefinitionLabel from "./SwedishDefinitionLabel";
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

  const [sweEngChecked, setSweEngChecked] = useState(true);
  const [engSweChecked, setEngSweChecked] = useState(true);

  const mode = editingQuizId ? "edit" : "add";
  const cachedTermLists = localStorageHelperInstance.getCachedTermLists();
  const termListsObject = cachedTermLists.reduce(
    (acc, termList) => ({ ...acc, [termList.id]: termList.terms }),
    {}
  ) as TermListObject;

  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});

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
  }, [open, cachedTermLists, mode, editingQuizId]);

  const getCheckedItemsFromCards = (cards: QuizCard[]): CheckedItems => {
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
  };

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
    const { name } = values;
    const errors: { [key in keyof QuizSaveModel]?: string } = {};
    if ((name ?? "").trim().length < MINIMUM_QUIZ_NAME_LENGTH) {
      errors.name = `Please enter at least ${MINIMUM_QUIZ_NAME_LENGTH} characters.`;
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
            let newCardsValue: QuizCard[] = [...state.formState.values.cards];
            if (checked) {
              checkedItemsClone[toggledTermListId] = termListsObject[
                toggledTermListId
              ].map((term) => term.id);
              checkedItemsClone[toggledTermListId].forEach((termId) => {
                if (sweEngChecked) {
                  newCardsValue.push(
                    localStorageHelperInstance.createQuizCard(
                      toggledTermListId,
                      termId,
                      "swedish_to_definition"
                    )
                  );
                }
                if (engSweChecked) {
                  newCardsValue.push(
                    localStorageHelperInstance.createQuizCard(
                      toggledTermListId,
                      termId,
                      "definition_to_swedish"
                    )
                  );
                }
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
            let newCardsValue: QuizCard[] = [...state.formState.values.cards];

            if (checked) {
              checkedItemsClone[termListId].push(toggledTermId);
              if (sweEngChecked) {
                newCardsValue.push(
                  localStorageHelperInstance.createQuizCard(
                    termListId,
                    toggledTermId,
                    "swedish_to_definition"
                  )
                );
              }
              if (engSweChecked) {
                newCardsValue.push(
                  localStorageHelperInstance.createQuizCard(
                    termListId,
                    toggledTermId,
                    "definition_to_swedish"
                  )
                );
              }
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
            const newCardsValue = state.formState.values.cards.filter(
              (card: QuizCard) => card.id !== cardId
            );
            setCheckedItems(getCheckedItemsFromCards(newCardsValue));
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
                  {mode === "edit" ? "Edit quiz" : "Create quiz"}
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
                      label="Quiz name"
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

              <Box display={"flex"}>
                <Box flexBasis={"30%"} mr={1}>
                  <Typography>1. Select terms below</Typography>
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
                  <Typography>
                    2. Select cards to include in your quiz below
                  </Typography>
                  <Box
                    height={400}
                    overflow={"auto scroll"}
                    border={"1px solid gray"}
                  >
                    <Field<QuizCard[]>
                      name="cards"
                      render={({ input, meta }) => (
                        <Box>
                          <Box
                            bgcolor={"black"}
                            display="flex"
                            alignItems={"center"}
                            justifyContent={"space-around"}
                          >
                            <Box
                              bgcolor={"black"}
                              display="flex"
                              alignItems={"center"}
                            >
                              <Typography>
                                Automatically add cards for:
                              </Typography>
                              <FormControlLabel
                                sx={{ ml: 1 }}
                                checked={sweEngChecked}
                                onChange={(e, checked) =>
                                  setSweEngChecked(checked)
                                }
                                control={<Checkbox />}
                                label="SWE-ENG"
                              />
                              <FormControlLabel
                                sx={{ ml: 1 }}
                                checked={engSweChecked}
                                onChange={(e, checked) =>
                                  setEngSweChecked(checked)
                                }
                                control={<Checkbox />}
                                label="ENG-SWE"
                              />
                            </Box>
                            <Box>hello</Box>
                          </Box>

                          <QuizBuilderTable
                            onRemoveCard={(cardId) =>
                              form.mutators.handleRemoveCard(cardId)
                            }
                            cards={input.value}
                            onChange={input.onChange}
                          />
                        </Box>
                      )}
                    />
                  </Box>
                  <Box mt={1}>
                    {errors?.quizCards && (
                      <Typography color="orange">
                        At least one term with at least one card needs to be
                        selected in the quiz
                      </Typography>
                    )}
                  </Box>
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
