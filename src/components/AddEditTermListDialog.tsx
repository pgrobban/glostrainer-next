import { CommonDialogProps, TermList } from "@/helpers/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { UUID } from "crypto";
import { FormikErrors, FormikProps, withFormik } from "formik";
import utilClassInstances from "../helpers/utilClassInstances";
import { useEffect } from "react";
import { CloseIcon } from "@/helpers/icons";

const { localStorageHelperInstance } = utilClassInstances;
export const MINIMUM_TERM_LIST_NAME_LENGTH = 3;

interface Props extends CommonDialogProps {
  onSave: (newTermList: TermList) => void;
  editingTermListId?: UUID | null;
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
    editingTermListId,
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
  const mode = editingTermListId ? "edit" : "add";

  useEffect(() => {
    if (open) {
      setFieldValue(
        "name",
        mode === "add" || !editingTermListId
          ? ""
          : localStorageHelperInstance.getTermListById(editingTermListId)
              ?.name || ""
      );
    }
  }, [mode, open, editingTermListId]);

  return (
    <form onSubmit={handleSubmit}>
      <Dialog
        data-testid={"add-edit-term-list-dialog"}
        open={open}
        onClose={onClose}
      >
        <DialogTitle>
          {mode === "edit" ? "Edit term list" : "Create term list"}
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
            data-testid={"term-list-name"}
            inputRef={(input) => input && input.focus()}
            required
            name="name"
            label="Term list name"
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

const AddEditTermListDialogForm = withFormik<Props, FormValues>({
  mapPropsToValues: ({ editingTermListId }) => {
    let name = "";
    if (editingTermListId) {
      const resolvedTermList =
        localStorageHelperInstance.getTermListById(editingTermListId);
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
    if (values.name.trim().length < MINIMUM_TERM_LIST_NAME_LENGTH) {
      errors.name = `Please enter at least ${MINIMUM_TERM_LIST_NAME_LENGTH} characters.`;
    }
    return errors;
  },

  handleSubmit: (values, { props, ...actions }) => {
    const { name } = values;
    const { onSave, editingTermListId } = props;
    const listWithName = localStorageHelperInstance.getTermListByName(name);
    const mode = editingTermListId ? "edit" : "add";
    const validName = !listWithName || listWithName.id === editingTermListId; // allow overwriting the editing list with the same name as a UX "feature"
    if (!validName) {
      actions.setFieldError("name", "A list with this name already exists.");
      return;
    }
    if (mode === "add") {
      const newTermList = localStorageHelperInstance.createNewTermList(name);
      onSave(newTermList);
    } else {
      if (!editingTermListId) {
        return;
      }
      const newTermList = localStorageHelperInstance.renameTermList(
        editingTermListId,
        name
      )!;
      onSave(newTermList);
    }
    actions.setSubmitting(false);
  },
})(InnerForm);

export default AddEditTermListDialogForm;
