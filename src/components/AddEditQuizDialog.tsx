import {
  CommonDialogProps,
  Quiz,
  QuizOrder,
  QuizSaveModel,
  Term,
  TermListObject,
  TermListsWithCards,
} from "@/helpers/types";
import { UUID } from "crypto";
import { Formik, FormikBag } from "formik";
import { useEffect, useState } from "react";
import utilClassInstances from "../helpers/utilClassInstances";
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
import { CloseIcon } from "@/helpers/icons";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import SwedishDefinitionLabel from "./SwedishDefinitionLabel";
import QuizBuilderTable from "./QuizBuilderTable";
import { getQuizCardCount, getQuizTermCount } from "@/helpers/quizUtils";
const { localStorageHelperInstance } = utilClassInstances;

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
  const mode = editingQuizId ? "edit" : "add";
  const initialValues: QuizSaveModel = {
    name: "",
    termListsWithCards: {},
    order: "random",
  };

  const onSubmit = (values, actions) => {
    const { name, termListsWithCards, order } = values;
    const listWithName = localStorageHelperInstance.getQuizByName(name);
    const validName = !listWithName || listWithName.id === editingQuizId; // allow overwriting the editing list with the same name as a UX "feature"
    if (!validName) {
      actions.setFieldError("name", "A quiz with this name already exists.");
      return;
    }

    onSave({ name, termListsWithCards, order });
    actions.setSubmitting(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({
        errors,
        touched,
        isSubmitting,
        setFieldValue,
        setSubmitting,
        setFieldTouched,
        handleChange,
        handleSubmit,
        values,
      }) => {
        const [checkedItems, setCheckedItems] = useState<TermListObject>({});
        const [termListsObject, setTermListsObject] = useState<TermListObject>(
          {}
        );
        const cachedTermLists = localStorageHelperInstance.getCachedTermLists();

        useEffect(() => {
          const defaultTermListsObject = cachedTermLists.reduce(
            (acc, termList) => ({ ...acc, [termList.id]: termList.terms }),
            {}
          ) as TermListObject;

          setTermListsObject(defaultTermListsObject);

          if (mode === "edit" && editingQuizId) {
            const foundQuiz =
              localStorageHelperInstance.getQuizById(editingQuizId);
            if (!foundQuiz) {
              return;
            }

            const fields = ["name", "termListsWithCards", "order"];
            fields.forEach((field) =>
              setFieldValue(field, foundQuiz[field as keyof Quiz], false)
            );
          } else {
            const defaultTermListsWithCards = cachedTermLists.reduce(
              (acc, termList) => ({ ...acc, [termList.id]: [] }),
              {}
            ) as TermListsWithCards;
            setFieldValue("termListsWithCards", defaultTermListsWithCards);
          }
        }, [open]);

        const getIsParentChecked = (termListId: UUID) => {
          if (!checkedItems[termListId] || !termListsObject[termListId]) {
            return false;
          }
          return (
            checkedItems[termListId].length ===
            termListsObject[termListId].length
          );
        };

        const getIsParentIndeterminate = (termListId: UUID) => {
          if (!checkedItems[termListId] || !termListsObject[termListId]) {
            return false;
          }
          return (
            !getIsParentChecked(termListId) &&
            checkedItems[termListId].length > 0
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

        const addedTermsCount = getQuizTermCount(values.termListsWithCards);
        const addedCardsCount = getQuizCardCount(values.termListsWithCards);

        return (
          <form>
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
                    disabled={isSubmitting}
                    color="inherit"
                    onClick={() => handleSubmit()}
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
                  <TextField
                    autoFocus
                    data-testid={"quiz-name"}
                    required
                    name="name"
                    label="Quiz name"
                    fullWidth
                    value={values.name}
                    onChange={(evt) => {
                      setFieldTouched("name", false);
                      setSubmitting(false);
                      handleChange(evt);
                    }}
                    helperText={
                      errors.name && touched.name && String(errors.name)
                    }
                    error={isSubmitting && touched.name}
                    sx={{ mr: 3 }}
                  />
                  <FormControl fullWidth>
                    <FormLabel id="order-group-label">Order</FormLabel>
                    <RadioGroup
                      aria-labelledby="order-group-label"
                      value={values.order}
                      name="order-group"
                      row
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
                                    label={
                                      <SwedishDefinitionLabel term={term} />
                                    }
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
                      <QuizBuilderTable
                        termLists={checkedItems}
                        onRemoveTerm={(termListId, term) =>
                          handleChildChecked(termListId, term, false)
                        }
                        termListsWithCards={values.termListsWithCards}
                        onQuizCardsChange={(newTermListsWithCards) =>
                          setFieldValue(
                            "termListsWithCards",
                            newTermListsWithCards
                          )
                        }
                      />
                    </Box>
                    <Box mt={1}>
                      {errors.termListsWithCards && (
                        <Typography color="orange">
                          At least one term with at least one card needs to be
                          selected in the quiz
                        </Typography>
                      )}
                      {!errors.termListsWithCards && (
                        <Typography>
                          {addedTermsCount} terms, {addedCardsCount} cards in
                          quiz
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </DialogContent>
            </Dialog>
          </form>
        );
      }}
    </Formik>
  );
};

export default AddEditQuizDialog;
