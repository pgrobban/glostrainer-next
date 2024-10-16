import { CommonDialogProps } from "@/helpers/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface Props extends CommonDialogProps {
  onConfirm: () => void;
}

const ConfirmChangeWordClassDialog = ({ open, onClose, onConfirm }: Props) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Change word type?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This term already has conjugations associated with it. If you change
          the word type, the conjugations data for this term will be removed.
          This will also affect quizzes using this term to generate its cards.
          Continue?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={onConfirm} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmChangeWordClassDialog;
