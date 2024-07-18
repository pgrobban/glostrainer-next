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
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const { localStorageHelperInstance } = utilClassInstances;

interface Props {
  open: boolean;
  mode: "add" | "edit";
  onRequestClose: () => void;
  onSave: (newTermList: TermList) => void;
}

const AddEditTermListDialog: React.FC<Props> = (props) => {
  const { open, mode, onRequestClose, onSave } = props;

  const [name, setName] = useState(
    mode === "add"
      ? ""
      : localStorageHelperInstance.getActiveTermList()?.name || ""
  );
  const [isFormValid, setIsFormValid] = useState(mode === "edit");
  useEffect(() => {
    if (open) {
      setName(
        mode === "add"
          ? ""
          : localStorageHelperInstance.getActiveTermList()?.name || ""
      );
      setIsFormValid(mode === "edit");
    }
  }, [mode, open]);

  useEffect(() => {
    setIsFormValid(name.length > 3);
  }, [name]);

  const onClickSave = () => {
    const newTermList = localStorageHelperInstance.createNewTermList(name);
    onSave(newTermList);
  };

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle>
        {mode === "edit" ? "Edit word list" : "Create word list"}
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
          required
          label="Word list name"
          fullWidth
          value={name}
          onChange={(evt) => setName(evt.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={isFormValid} onClick={onClickSave}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditTermListDialog;
