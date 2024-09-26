import { StyledTableRow } from "@/helpers/styleUtils";
import { QuizCard, Term } from "@/helpers/types";
import { Checkbox, IconButton, TableCell } from "@mui/material";
import { UUID } from "crypto";
import { memo } from "react";
import SwedishDefinitionLabel from "./SwedishDefinitionLabel";
import { DeleteIcon } from "@/helpers/icons";

interface Props {
  termListId: UUID;
  term: Term;
  hasQuizCard: (termListId: UUID, term: Term, card: QuizCard) => boolean;
  toggleQuizCardChecked: (card: QuizCard, checked: boolean, term: Term) => void;
  onRemoveTerm: (termListId: UUID, term: Term) => void;
}

const QuizBuilderTableRow = memo<Props>(
  ({ term, termListId, hasQuizCard, toggleQuizCardChecked, onRemoveTerm }) => (
    <StyledTableRow>
      <TableCell>
        <SwedishDefinitionLabel term={term} />
      </TableCell>
      <TableCell align="center" padding="checkbox">
        <IconButton
          color="secondary"
          onClick={() => onRemoveTerm(termListId, term)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
      <TableCell align="center" padding="checkbox">
        <Checkbox
          checked={hasQuizCard(termListId, term, "swedish_to_definition")}
          onChange={(_, checked) =>
            toggleQuizCardChecked("swedish_to_definition", checked, term)
          }
        />
      </TableCell>
      <TableCell align="center" padding="checkbox">
        <Checkbox
          checked={hasQuizCard(termListId, term, "definition_to_swedish")}
          onChange={(_, checked) =>
            toggleQuizCardChecked("definition_to_swedish", checked, term)
          }
        />
      </TableCell>
      <TableCell align="center" padding="checkbox">
        -
      </TableCell>
    </StyledTableRow>
  )
);

QuizBuilderTableRow.displayName = "QuizBuilderTableRow";

export default QuizBuilderTableRow;
