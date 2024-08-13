import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import utilClassInstances from "../helpers/utilClassInstances";
import { CommonDialogProps } from "@/helpers/types";
const { localStorageHelperInstance } = utilClassInstances;

const ConfirmDeleteLocalDataDialog = ({ open, onClose }: CommonDialogProps) => {
  const onConfirmDeleteLocalData = () => {
    localStorageHelperInstance.clearData();
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Delete local data?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will clear ALL the GlosTrainer data from this browser. Continue?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={onConfirmDeleteLocalData} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteLocalDataDialog;
