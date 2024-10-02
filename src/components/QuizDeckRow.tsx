import { getLocalDateTime } from "@/helpers/dateUtils";
import { DeleteIcon, PlayIcon } from "@/helpers/icons";
import { getCardCount, getTermCount } from "@/helpers/quizUtils";
import { StyledTableCell, StyledTableRow } from "@/helpers/styleUtils";
import { Quiz } from "@/helpers/types";
import { Button } from "@mui/material";
import { memo } from "react";

interface Props {
  quiz: Quiz;
  onOpenEdit: () => void;
  onOpenDelete: () => void;
}

const QuizDeckRow = memo(({ quiz, onOpenEdit, onOpenDelete }: Props) => {
  const { name, updatedOn, createdOn, cards } = quiz;

  return (
    <StyledTableRow onClick={onOpenEdit}>
      <StyledTableCell>{name}</StyledTableCell>
      <StyledTableCell>{getTermCount(cards)}</StyledTableCell>
      <StyledTableCell>{getCardCount(cards)}</StyledTableCell>
      <StyledTableCell>
        {updatedOn ? getLocalDateTime(updatedOn) : getLocalDateTime(createdOn)}
      </StyledTableCell>
      <StyledTableCell align="right" onClick={(e) => e.stopPropagation()}>
        <Button sx={{ mr: 2 }} color="primary" variant="outlined" disabled>
          <PlayIcon />
        </Button>
        <Button color="secondary" variant="outlined" onClick={onOpenDelete}>
          <DeleteIcon />
        </Button>
      </StyledTableCell>
    </StyledTableRow>
  );
});

QuizDeckRow.displayName = "QuizDeckRow";

export default QuizDeckRow;
