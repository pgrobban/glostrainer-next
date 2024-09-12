import { CloseIcon } from "@/helpers/icons";
import { CommonDialogProps, Quiz } from "@/helpers/types";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
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
    isValid,
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

  return (
    <form onSubmit={handleSubmit}>
      <Dialog
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
              autoFocus
              disabled={!isValid}
              color="inherit"
              onClick={onClickSave}
            >
              Save
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
          ></Box>
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
