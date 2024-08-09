import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import utilClassInstances from "../helpers/utilClassInstances";
const { localStorageHelperInstance } = utilClassInstances;

interface Props {
  open: boolean;
  onClose: () => void;
}

const ConfirmDeleteLocalDataDialog = ({ open, onClose }: Props) => {
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
