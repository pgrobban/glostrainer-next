import { CommonDialogProps } from "@/helpers/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const InvalidFileAlert = ({ open, onClose }: CommonDialogProps) => (
  <Dialog open={open}>
    <DialogTitle>Invalid file</DialogTitle>
    <DialogContent>
      <DialogContentText>
        This file does not seem to have been created with GlosTrainer. Please
        try with another file.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>OK</Button>
    </DialogActions>
  </Dialog>
);

export default InvalidFileAlert;
