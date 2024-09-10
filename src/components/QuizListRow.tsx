import { getLocalDateTime } from "@/helpers/dateUtils";
import { QuizList } from "@/helpers/types";
import { TableCell, TableRow } from "@mui/material";
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
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>{termCount} terms</TableCell>
      <TableCell>{questionCount} questions</TableCell>
      <TableCell>{updatedOn && getLocalDateTime(updatedOn)}</TableCell>
    </TableRow>
  );
});

QuizListRow.displayName = "QuizListRow";

export default QuizListRow;
