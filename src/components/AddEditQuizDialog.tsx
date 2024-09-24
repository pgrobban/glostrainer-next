import { CloseIcon } from "@/helpers/icons";
import {
  CommonDialogProps,
  QuizOrder,
  Term,
  TermList,
  TermListObject,
  TermListsWithQuizModes,
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
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { UUID } from "crypto";
import { FormikErrors, FormikProps, withFormik } from "formik";
import { useEffect, useState } from "react";

import { TreeItem } from "@mui/x-tree-view";
import utilClassInstances from "../helpers/utilClassInstances";
import QuizBuilderTable from "./QuizBuilderTable";
import SwedishDefinitionLabel from "./SwedishDefinitionLabel";
const { localStorageHelperInstance } = utilClassInstances;

export const MINIMUM_QUIZ_NAME_LENGTH = 3;

interface Props extends CommonDialogProps {
  editingQuizId?: UUID | null;
  onSave: () => void;
}

interface FormValues {
  name: string;
  termListsObject: TermListObject;
  termListsWithQuizModes: TermListsWithQuizModes;
  defaultCheckedItems: TermListObject;
  defaultTermListsWithQuizModes: TermListsWithQuizModes;
  cachedTermLists: TermList[];
  order: QuizOrder;
}

const InnerForm = ({
  onClose = () => {},
  ...props
}: Props & FormikProps<FormValues>) => {
  const {
    open,
    editingQuizId,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldTouched,
    setFieldValue,
    setSubmitting,
    values,
  } = props;
  const mode = editingQuizId ? "edit" : "add";
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (open) {
      setFieldValue(
        "name",
        mode === "add" || !editingQuizId
          ? ""
          : localStorageHelperInstance.getQuizById(editingQuizId)?.name || ""
      );
    }
  }, [mode, open, editingQuizId]);

  const onClickSave = () => {};

  const [checkedItems, setCheckedItems] = useState<TermListObject>(
    values.defaultCheckedItems
  );

  const getIsParentChecked = (termListId: UUID) =>
    checkedItems[termListId].length ===
    values.termListsObject[termListId].length;
  const getIsParentIndeterminate = (termListId: UUID) =>
    !getIsParentChecked(termListId) && checkedItems[termListId].length > 0;
  const getIsChildChecked = (termListId: UUID, term: Term) =>
    checkedItems[termListId].includes(term);
  const handleParentChecked = (termListId: UUID, checked: boolean) => {
    const checkedItemsClone = { ...checkedItems };
    if (checked) {
      checkedItemsClone[termListId] = values.termListsObject[termListId];
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

  const addedTermsLength = (
    Object.keys(values.termListsWithQuizModes) as UUID[]
  ).reduce(
    (acc, termListId) => acc + values.termListsWithQuizModes[termListId].length,
    0
  );
  const addedTermsQuizModesLength = (
    Object.keys(values.termListsWithQuizModes) as UUID[]
  ).reduce(
    (acc, termListId) =>
      acc +
      values.termListsWithQuizModes[termListId].reduce(
        (subAcc, termWithQuizMode) =>
          subAcc + termWithQuizMode.quizModes.length,
        0
      ),
    0
  );

  console.log("***", errors, touched);

  return (
    <form onSubmit={handleSubmit}>
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
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {mode === "edit" ? "Edit quiz" : "Create quiz"}
            </Typography>
            <Button
              type="submit"
              disabled={isSubmitting}
              color="inherit"
              onClick={onClickSave}
            >
              Save and close
            </Button>
            <Button disabled={true} color="inherit" onClick={onClickSave}>
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
              inputRef={(input) => input && input.focus()}
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
              helperText={errors.name && touched.name && String(errors.name)}
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
              <Typography>Select terms from your lists below</Typography>
              <Box
                height={400}
                border={"1px solid gray"}
                overflow={"auto scroll"}
              >
                <SimpleTreeView>
                  {values.cachedTermLists.map((termList) => (
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
                                  checked={getIsChildChecked(termList.id, term)}
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
              <Typography>Current terms in list</Typography>
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
                  termListsWithQuizModes={values.termListsWithQuizModes}
                  onQuizModesChange={(newTermListsWithQuizModes) =>
                    setFieldValue(
                      "termListsWithQuizModes",
                      newTermListsWithQuizModes
                    )
                  }
                />
              </Box>
              {errors.termListsWithQuizModes && (
                <Typography color="orange" mt={1}>
                  At least one term with at least one card needs to be selected
                  in the quiz
                </Typography>
              )}
              {!errors.termListsWithQuizModes && (
                <Typography mt={1}>
                  {addedTermsLength} terms, {addedTermsQuizModesLength} cards in
                  quiz
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </form>
  );
};

const AddEditQuizDialogForm = withFormik<Props, FormValues>({
  mapPropsToValues: ({ editingQuizId }) => {
    let name = "";
    const cachedTermLists = localStorageHelperInstance.getCachedTermLists();
    const termListsObject = cachedTermLists.reduce(
      (acc, termList) => ({ ...acc, [termList.id]: termList.terms }),
      {}
    ) as TermListObject;
    const defaultCheckedItems = cachedTermLists.reduce(
      (acc, termList) => ({ ...acc, [termList.id]: [] }),
      {}
    ) as TermListObject;
    const defaultTermListsWithQuizModes = cachedTermLists.reduce(
      (acc, termList) => ({ ...acc, [termList.id]: [] }),
      {}
    ) as TermListsWithQuizModes;

    const termListsWithQuizModes = { ...defaultTermListsWithQuizModes };
    if (editingQuizId) {
      const resolvedTermList =
        localStorageHelperInstance.getTermListById(editingQuizId);
      if (resolvedTermList) {
        name = resolvedTermList.name;
      }
    }

    const defaultQuizOrder: QuizOrder = "random";

    return {
      name,
      termListsObject,
      defaultCheckedItems,
      defaultTermListsWithQuizModes,
      cachedTermLists: localStorageHelperInstance.getCachedTermLists(),
      termListsWithQuizModes,
      order: defaultQuizOrder,
    };
  },
  validate: (values: FormValues) => {
    const { name, termListsWithQuizModes } = values;
    const errors: FormikErrors<Record<keyof FormValues, string>> = {};
    if (name.trim().length < MINIMUM_QUIZ_NAME_LENGTH) {
      errors.name = `Please enter at least ${MINIMUM_QUIZ_NAME_LENGTH} characters.`;
    }

    const hasAtLeastOneTermWithOneQuizModeEntered = (
      Object.keys(termListsWithQuizModes) as UUID[]
    ).some(
      (termListId) =>
        termListsWithQuizModes[termListId].length > 0 &&
        termListsWithQuizModes[termListId].some(
          (termWithQuizModes) => termWithQuizModes.quizModes.length > 0
        )
    );
    if (!hasAtLeastOneTermWithOneQuizModeEntered) {
      errors.termListsWithQuizModes =
        "At least one quiz mode needs to be selected for at least one item";
    }
    return errors;
  },

  handleSubmit: (values, { props, ...actions }) => {
    const { name, termListsWithQuizModes, order } = values;
    const { onSave, editingQuizId } = props;
    const listWithName = localStorageHelperInstance.getTermListByName(name);
    const validName = !listWithName || listWithName.id === editingQuizId; // allow overwriting the editing list with the same name as a UX "feature"
    if (!validName) {
      actions.setFieldError("name", "A list with this name already exists.");
      return;
    }

    localStorageHelperInstance.createNewQuizList(
      name,
      termListsWithQuizModes,
      order
    );

    onSave();
    actions.setSubmitting(false);
  },
})(InnerForm);

export default AddEditQuizDialogForm;
