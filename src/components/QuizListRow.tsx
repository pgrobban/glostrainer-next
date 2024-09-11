import { getLocalDateTime } from "@/helpers/dateUtils";
import { DeleteIcon, PlayIcon } from "@/helpers/icons";
import { StyledTableCell, StyledTableRow } from "@/helpers/styleUtils";
import { Quiz } from "@/helpers/types";
import { Button } from "@mui/material";
import { memo } from "react";

interface Props {
  quiz: Quiz;
  onOpenEditClick: () => void;
}

const QuizListRow = memo(({ quiz, onOpenEditClick }: Props) => {
  const { name, termsWithQuizModes, updatedOn, createdOn } = quiz;

  const termCount = termsWithQuizModes.length;
  const questionCount = termsWithQuizModes.reduce(
    (acc, termWithQuizModes) => acc + termWithQuizModes.quizModes.length,
    0
  );
  return (
    <StyledTableRow onClick={onOpenEditClick}>
      <StyledTableCell>{name}</StyledTableCell>
      <StyledTableCell>{termCount}</StyledTableCell>
      <StyledTableCell>{questionCount}</StyledTableCell>
      <StyledTableCell>
        {updatedOn ? getLocalDateTime(updatedOn) : getLocalDateTime(createdOn)}
      </StyledTableCell>
      <StyledTableCell align="right">
        <Button sx={{ mr: 2 }} color="primary" variant="outlined">
          <PlayIcon />
        </Button>
        <Button color="secondary" variant="outlined">
          <DeleteIcon />
        </Button>
      </StyledTableCell>
    </StyledTableRow>
  );
});

QuizListRow.displayName = "QuizListRow";

export default QuizListRow;
