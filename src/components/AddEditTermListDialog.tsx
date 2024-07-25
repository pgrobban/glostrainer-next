import { TermList } from "@/helpers/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import utilClassInstances from "../helpers/utilClassInstances";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { UUID } from "crypto";

const { localStorageHelperInstance } = utilClassInstances;
const MINIMUM_TERM_LIST_NAME_LENGTH = 3;

interface Props {
  open: boolean;
  mode: "add" | "edit";
  onRequestClose: () => void;
  onSave: (newTermList: TermList) => void;
  editingTermListId: UUID | null;
}

const AddEditTermListDialog: React.FC<Props> = (props) => {
  const { open, mode, onRequestClose, onSave, editingTermListId } = props;

  const [name, setName] = useState(
    mode === "add"
      ? ""
      : localStorageHelperInstance.getActiveTermList()?.name || ""
  );
  const [isFormValid, setIsFormValid] = useState(mode === "edit");
  useEffect(() => {
    if (open) {
      setName(
        mode === "add" || !editingTermListId
          ? ""
          : localStorageHelperInstance.getListById(editingTermListId)?.name ||
              ""
      );
      setIsFormValid(mode === "edit");
    }
  }, [mode, open, editingTermListId]);

  useEffect(() => {
    setIsFormValid(name.length >= MINIMUM_TERM_LIST_NAME_LENGTH);
  }, [name]);

  const onClickSave = () => {
    if (mode === "add") {
      const newTermList = localStorageHelperInstance.createNewTermList(name);
      onSave(newTermList);
    } else {
      if (!editingTermListId) {
        return;
      }
      const newTermList = localStorageHelperInstance.rename(
        editingTermListId,
        name
      )!;
      onSave(newTermList);
    }
  };

  return (
    <Dialog open={open} onClose={onRequestClose} disableRestoreFocus>
      <DialogTitle>
        {mode === "edit" ? "Edit term list" : "Create term list"}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onRequestClose}
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
          inputRef={(input) => input && input.focus()}
          required
          label="Word list name"
          fullWidth
          value={name}
          onChange={(evt) => setName(evt.target.value)}
          helperText={`Minimum ${MINIMUM_TERM_LIST_NAME_LENGTH} characters`}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={!isFormValid} onClick={onClickSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditTermListDialog;
