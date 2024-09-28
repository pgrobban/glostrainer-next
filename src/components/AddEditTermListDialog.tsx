import { CommonDialogProps } from "@/helpers/types";
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
import utilClassInstances from "../helpers/utilClassInstances";
import { useEffect, useState } from "react";
import { CloseIcon } from "@/helpers/icons";
import { Field, Form, FormSpy } from "react-final-form";
import { showError } from "@/helpers/formUtils";

const { localStorageHelperInstance } = utilClassInstances;
export const MINIMUM_TERM_LIST_NAME_LENGTH = 3;

const formInitialValues = {
  name: "",
};
type FormSaveModel = typeof formInitialValues;

interface Props extends CommonDialogProps {
  onSave: (formSaveModel: FormSaveModel) => void;
  editingTermListId?: UUID | null;
}

const AddEditTermListDialog: React.FC<Props> = ({
  open,
  onSave,
  editingTermListId,
  onClose,
}) => {
  const mode = editingTermListId ? "edit" : "add";
  const [initialValues, setInitialValues] = useState({ ...formInitialValues });

  useEffect(() => {
    if (mode === "edit" && editingTermListId) {
      const foundTermList =
        localStorageHelperInstance.getTermListById(editingTermListId);
      if (!foundTermList) {
        return;
      }
      setInitialValues({ name: foundTermList.name });
    } else {
      setInitialValues({ ...formInitialValues });
    }
  }, [open, mode, editingTermListId]);

  const onSubmit = (values: typeof formInitialValues) => {
    const errors: { [key in keyof FormSaveModel]?: string } = {};
    const listWithName = localStorageHelperInstance.getTermListByName(
      values.name
    );
    const validName = !listWithName || listWithName.id === editingTermListId; // allow overwriting the editing list with the same name as a UX "feature"
    if (!validName) {
      errors.name = "A list with this name already exists.";
      return errors;
    }
    onSave(values);
  };

  const validate = (values: FormSaveModel) => {
    const errors: { [key in keyof FormSaveModel]?: string } = {};
    if ((values.name ?? "").trim().length < MINIMUM_TERM_LIST_NAME_LENGTH) {
      errors.name = `Please enter at least ${MINIMUM_TERM_LIST_NAME_LENGTH} characters.`;
    }
    return errors;
  };

  return (
    <Form
      key={initialValues.name}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, form }) => (
        <form onSubmit={handleSubmit} autoComplete="off">
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
              <Field<string>
                name="name"
                render={({ input, meta }) => (
                  <TextField
                    data-testid={"term-list-name"}
                    inputRef={(input) => input && input.focus()}
                    required
                    label="Term list name"
                    fullWidth
                    value={input.value}
                    onChange={input.onChange}
                    error={showError(meta)}
                    helperText={
                      showError(meta) && (meta.error || meta.submitError)
                    }
                  />
                )}
              />
            </DialogContent>
            <DialogActions>
              <Button type="submit" onClick={handleSubmit}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      )}
    />
  );
};

export default AddEditTermListDialog;
