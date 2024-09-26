import utilClassInstances from "../helpers/utilClassInstances";
import { CommonDialogProps } from "@/helpers/types";
const { localStorageHelperInstance } = utilClassInstances;
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { UUID } from "crypto";

interface Props extends CommonDialogProps {
  quizToDeleteId: UUID | null;
  onDelete: () => void;
}

const ConfirmDeleteQuizDialog = ({
  open,
  onClose,
  quizToDeleteId,
  onDelete,
}: Props) => {
  if (!quizToDeleteId) {
    return null;
  }

  const foundQuiz = localStorageHelperInstance.getQuizById(quizToDeleteId);
  if (!foundQuiz) {
    return null;
  }

  const onConfirmDelete = () => {
    localStorageHelperInstance.deleteQuiz(quizToDeleteId);
    onDelete();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Delete quiz '{foundQuiz.name}'?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This action cannot be undone. Continue?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={onConfirmDelete} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteQuizDialog;
