import { CloseIcon } from "@/helpers/icons";
import { getQuizCardCount, getQuizTermCount } from "@/helpers/quizUtils";
import {
  CommonDialogProps,
  QuizOrder,
  Term,
  TermListObject,
  TermListsWithCards,
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
import { Form, Field } from "react-final-form";
import { useEffect, useState } from "react";
import utilClassInstances from "../helpers/utilClassInstances";
import QuizBuilderTable from "./QuizBuilderTable";
import SwedishDefinitionLabel from "./SwedishDefinitionLabel";
import { required, showError } from "@/helpers/formUtils";
const { localStorageHelperInstance } = utilClassInstances;

export const MINIMUM_QUIZ_NAME_LENGTH = 3;

const defaultQuizSaveModel = {
  name: "",
  termListsWithCards: {} as TermListsWithCards,
  order: "random" as QuizOrder,
};
export type QuizSaveModel = typeof defaultQuizSaveModel;

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

  const mode = editingQuizId ? "edit" : "add";
  const cachedTermLists = localStorageHelperInstance.getCachedTermLists();
  const termListsObject = cachedTermLists.reduce(
    (acc, termList) => ({ ...acc, [termList.id]: termList.terms }),
    {}
  ) as TermListObject;

  console.log("** re");

  const [checkedItems, setCheckedItems] = useState<TermListObject>({});

  useEffect(() => {
    if (mode === "edit" && editingQuizId) {
      const foundQuiz = localStorageHelperInstance.getQuizById(editingQuizId);
      if (!foundQuiz) {
        return;
      }

      setInitialValues({
        name: foundQuiz.name,
        termListsWithCards: foundQuiz.termListsWithCards,
        order: foundQuiz.order,
      });

      setCheckedItems(
        cachedTermLists.reduce(
          (acc, termList) => ({
            ...acc,
            [termList.id]: foundQuiz.termListsWithCards[termList.id]
              ? foundQuiz.termListsWithCards[termList.id].map(
                  (termWithCards) => termWithCards.term
                )
              : [],
          }),
          {}
        )
      );
    } else {
      setInitialValues({ ...defaultQuizSaveModel });

      setCheckedItems(
        cachedTermLists.reduce(
          (acc, termList) => ({
            ...acc,
            [termList.id]: [],
          }),
          {}
        )
      );
    }
  }, [open, cachedTermLists, mode, editingQuizId]);

  const onSubmit = (values: QuizSaveModel) => {
    const { name, termListsWithCards, order } = values;
    const listWithName = localStorageHelperInstance.getQuizByName(name);
    const validName = !listWithName || listWithName.id === editingQuizId; // allow overwriting the editing list with the same name as a UX "feature"
    if (!validName) {
      return { name: "A quiz with this name already exists." };
    }

    onSave({ name, termListsWithCards, order });
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const validate = (values: QuizSaveModel) => {
    const { name, termListsWithCards } = values;
    const errors: { [key in keyof QuizSaveModel]?: string } = {};
    if ((name ?? "").trim().length < MINIMUM_QUIZ_NAME_LENGTH) {
      errors.name = `Please enter at least ${MINIMUM_QUIZ_NAME_LENGTH} characters.`;
    }

    const hasAtLeastOneTermWithOneCardEntered = (
      Object.keys(termListsWithCards) as UUID[]
    ).some(
      (termListId) =>
        termListsWithCards[termListId].length > 0 &&
        termListsWithCards[termListId].some(
          (termWithCard) => termWithCard.cards.length > 0
        )
    );
    if (!hasAtLeastOneTermWithOneCardEntered) {
      errors.termListsWithCards =
        "At least one quiz mode needs to be selected for at least one item";
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
    return checkedItems[termListId].includes(term);
  };
  const handleParentChecked = (termListId: UUID, checked: boolean) => {
    const checkedItemsClone = { ...checkedItems };
    if (checked) {
      checkedItemsClone[termListId] = termListsObject[termListId];
    } else {
      checkedItemsClone[termListId] = [];
    }
    setCheckedItems(checkedItemsClone);
  };
  const handleChildChecked = (
    termListId: UUID,
    checkedTerm: Term,
    checked: boolean
  ) => {
    const checkedItemsClone = { ...checkedItems };
    if (checked) {
      checkedItemsClone[termListId].push(checkedTerm);
    } else {
      checkedItemsClone[termListId] = checkedItems[termListId].filter(
        (term) => term !== checkedTerm
      );
    }
    setCheckedItems(checkedItemsClone);
  };

  return (
    <Form
      key={initialValues.name}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, submitting, errors, values, pristine }) => (
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
                                  onChange={(_, checked) =>
                                    handleParentChecked(termList.id, checked)
                                  }
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
                                        handleChildChecked(
                                          termList.id,
                                          term,
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
                    <Field<TermListsWithCards>
                      name="termListsWithCards"
                      render={({ input, meta }) => (
                        <QuizBuilderTable
                          termLists={checkedItems}
                          onRemoveTerm={(termListId, term) =>
                            handleChildChecked(termListId, term, false)
                          }
                          value={input.value}
                          onChange={input.onChange}
                        />
                      )}
                    />
                  </Box>
                  <Box mt={1}>
                    {errors?.termListsWithCards && (
                      <Typography color="orange">
                        At least one term with at least one card needs to be
                        selected in the quiz
                      </Typography>
                    )}
                    {!errors?.termListsWithCards && (
                      <Typography>
                        {getQuizTermCount(values.termListsWithCards)} terms,{" "}
                        {getQuizCardCount(values.termListsWithCards)} cards in
                        quiz
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
