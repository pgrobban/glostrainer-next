import { CommonDialogProps } from "@/helpers/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface Props extends CommonDialogProps {
  termListName: string;
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
      <DialogTitle>Delete term list &apos;{termListName}&apos;?</DialogTitle>
      <DialogContent>This action cannot be undone. Continue?</DialogContent>
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
