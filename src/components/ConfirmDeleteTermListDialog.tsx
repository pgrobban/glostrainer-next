import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface Props {
  open: boolean;
  termListName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteTermListDialog = ({
  open,
  termListName,
  onClose,
  onConfirm,
}: Props) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Delete term list?</DialogTitle>
      <DialogContent>Really delete &apos;{termListName}&apos;?</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteTermListDialog;
