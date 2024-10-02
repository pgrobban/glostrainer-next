import { StyledTableRow } from "@/helpers/styleUtils";
import { QuizCard } from "@/helpers/types";
import utilClassInstances from "../helpers/utilClassInstances";
import { Button, TableCell } from "@mui/material";
import { getGeneratedCardForTerm } from "@/helpers/quizUtils";
import { DeleteIcon } from "@/helpers/icons";
const { localStorageHelperInstance } = utilClassInstances;
import { memo } from "react";

interface Props {
  card: QuizCard;
  onRemove: () => void;
}

const QuizBuilderTableRow: React.FC<Props> = memo(({ card, onRemove }) => {
  const { termListId, termId, contentToGenerate } = card;
  const termList = localStorageHelperInstance.getTermListById(termListId);
  const term = termList?.terms.find((term) => term.id === termId);
  if (!term || !contentToGenerate) {
    return null;
  }

  const { front, back } = getGeneratedCardForTerm(term, contentToGenerate);
  return (
    <StyledTableRow>
      <TableCell>{front}</TableCell>
      <TableCell>{back}</TableCell>
      <TableCell width={60}>
        <Button onClick={onRemove} color="secondary">
          <DeleteIcon />
        </Button>
      </TableCell>
    </StyledTableRow>
  );
});

QuizBuilderTableRow.displayName = "QuizBuilderTableRow";

export default QuizBuilderTableRow;
