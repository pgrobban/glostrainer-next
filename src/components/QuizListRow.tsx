import { getLocalDateTime } from "@/helpers/dateUtils";
import { DeleteIcon, PlayIcon } from "@/helpers/icons";
import { StyledTableCell, StyledTableRow } from "@/helpers/styleUtils";
import { QuizList } from "@/helpers/types";
import { Button } from "@mui/material";
import { memo } from "react";

interface Props {
  quizList: QuizList;
}

const QuizListRow = memo(({ quizList }: Props) => {
  const { name, termsWithQuizModes, updatedOn } = quizList;

  const termCount = termsWithQuizModes.length;
  const questionCount = termsWithQuizModes.reduce(
    (acc, termWithQuizModes) => acc + termWithQuizModes.quizModes.length,
    0
  );
  return (
    <StyledTableRow>
      <StyledTableCell>{name}</StyledTableCell>
      <StyledTableCell>{termCount}</StyledTableCell>
      <StyledTableCell>{questionCount}</StyledTableCell>
      <StyledTableCell>
        {updatedOn && getLocalDateTime(updatedOn)}
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
