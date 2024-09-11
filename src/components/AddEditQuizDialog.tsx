import { CloseIcon } from "@/helpers/icons";
import { CommonDialogProps, Quiz } from "@/helpers/types";
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FormikErrors, FormikProps, withFormik } from "formik";
import { useEffect } from "react";
import utilClassInstances from "../helpers/utilClassInstances";
import { UUID } from "crypto";
const { localStorageHelperInstance } = utilClassInstances;

export const MINIMUM_QUIZ_NAME_LENGTH = 3;

interface Props extends CommonDialogProps {
  editingQuizId?: UUID | null;
  onSave: (newQuiz: Quiz) => void;
}

interface FormValues {
  name: string;
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

  return (
    <form onSubmit={handleSubmit}>
      <Dialog
        data-testid={"add-edit-quiz-dialog"}
        open={open}
        onClose={onClose}
      >
        <DialogTitle>
          {mode === "edit" ? "Edit quiz" : "Create quiz"}
        </DialogTitle>
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
          <TextField
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
          />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={() => handleSubmit()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

const AddEditQuizDialogForm = withFormik<Props, FormValues>({
  mapPropsToValues: ({ editingQuizId }) => {
    let name = "";
    if (editingQuizId) {
      const resolvedTermList =
        localStorageHelperInstance.getTermListById(editingQuizId);
      if (resolvedTermList) {
        name = resolvedTermList.name;
      }
    }
    return {
      name,
    };
  },
  validate: (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (values.name.trim().length < MINIMUM_QUIZ_NAME_LENGTH) {
      errors.name = `Please enter at least ${MINIMUM_QUIZ_NAME_LENGTH} characters.`;
    }
    return errors;
  },

  handleSubmit: (values, { props, ...actions }) => {
    const { name } = values;
    const { onSave, editingQuizId } = props;
    const listWithName = localStorageHelperInstance.getTermListByName(name);
    const validName = !listWithName || listWithName.id === editingQuizId; // allow overwriting the editing list with the same name as a UX "feature"
    if (!validName) {
      actions.setFieldError("name", "A list with this name already exists.");
      return;
    }
    // onSave
    actions.setSubmitting(false);
  },
})(InnerForm);

export default AddEditQuizDialogForm;
