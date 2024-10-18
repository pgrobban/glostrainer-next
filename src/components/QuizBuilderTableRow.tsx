import { DeleteIcon, DragHandleIcon } from "@/helpers/icons";
import {
  getGeneratedCardForTerm,
  getReadableContentToGenerateLabel,
} from "@/helpers/quizUtils";
import { StyledTableRow } from "@/helpers/styleUtils";
import { QuizCard } from "@/helpers/types";
import { DraggableProvided } from "@hello-pangea/dnd";
import { Button, TableCell } from "@mui/material";
import { memo } from "react";
import utilClassInstances from "../helpers/utilClassInstances";
const { localStorageHelperInstance } = utilClassInstances;

interface Props {
  card: QuizCard;
  onRemove: () => void;
  draggableProvided: DraggableProvided;
}

const QuizBuilderTableRow: React.FC<Props> = memo(
  ({ card, onRemove, draggableProvided }) => {
    const { termListId, termId, contentToGenerate } = card;
    const termList = localStorageHelperInstance.getTermListById(termListId);
    const term = termList?.terms.find((term) => term.id === termId);
    if (!term || !contentToGenerate) {
      return null;
    }

    const { front, back } = getGeneratedCardForTerm(term, contentToGenerate);
    return (
      <StyledTableRow
        ref={draggableProvided.innerRef}
        {...draggableProvided.draggableProps}
        {...draggableProvided.dragHandleProps}
      >
        <TableCell>
          <DragHandleIcon />
        </TableCell>
        <TableCell>
          {card.contentToGenerate && (
            <small>
              {getReadableContentToGenerateLabel(card.contentToGenerate)}
            </small>
          )}
        </TableCell>
        <TableCell>{front}</TableCell>
        <TableCell>{back}</TableCell>
        <TableCell width={60}>
          <Button onClick={onRemove} color="secondary">
            <DeleteIcon />
          </Button>
        </TableCell>
      </StyledTableRow>
    );
  }
);

QuizBuilderTableRow.displayName = "QuizBuilderTableRow";

export default QuizBuilderTableRow;
