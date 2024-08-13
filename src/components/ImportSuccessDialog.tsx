import { CommonDialogProps } from "@/helpers/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

const ImportSuccessDialog = ({ open, onClose }: CommonDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogContent>
      <DialogContentText>Imported data successfully.</DialogContentText>
      <DialogActions>
        <Button onClick={onClose}>OK</Button>
      </DialogActions>
    </DialogContent>
  </Dialog>
);
export default ImportSuccessDialog;
