import { StyledTableRow } from "@/helpers/styleUtils";
import { QuizCard } from "@/helpers/types";
import SwedishDefinitionLabel from "./SwedishDefinitionLabel";
import utilClassInstances from "../helpers/utilClassInstances";
import { Button, TableCell } from "@mui/material";
import { getReadableGeneratedContentLabel } from "@/helpers/quizUtils";
import { DeleteIcon } from "@/helpers/icons";
const { localStorageHelperInstance } = utilClassInstances;

interface Props {
  card: QuizCard;
  onRemove: () => void;
}

const QuizBuilderTableRow: React.FC<Props> = ({ card, onRemove }) => {
  const { termListId, termId } = card;
  const termList = localStorageHelperInstance.getTermListById(termListId);
  const term = termList?.terms.find((term) => term.id === termId);
  if (!term) {
    return null;
  }

  return (
    <StyledTableRow>
      <TableCell>
        <SwedishDefinitionLabel term={term} />
      </TableCell>
      <TableCell>
        {card.generatedContent && (
          <span>
            Generated content:
            <br />
            {getReadableGeneratedContentLabel(card.generatedContent)}
          </span>
        )}
      </TableCell>
      <TableCell width={60}>
        <Button onClick={onRemove} color="secondary">
          <DeleteIcon />
        </Button>
      </TableCell>
    </StyledTableRow>
  );
};

export default QuizBuilderTableRow;
