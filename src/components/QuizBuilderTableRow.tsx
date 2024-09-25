import { StyledTableRow } from "@/helpers/styleUtils";
import { QuizMode, Term } from "@/helpers/types";
import { Checkbox, IconButton, TableCell } from "@mui/material";
import { UUID } from "crypto";
import { memo } from "react";
import SwedishDefinitionLabel from "./SwedishDefinitionLabel";
import { DeleteIcon } from "@/helpers/icons";

interface Props {
  termListId: UUID;
  term: Term;
  getHasQuizMode: (termListId: UUID, term: Term, quizMode: QuizMode) => boolean;
  toggleQuizModeChecked: (
    quizMode: QuizMode,
    checked: boolean,
    term: Term
  ) => void;
  onRemoveTerm: (termListId: UUID, term: Term) => void;
}

const QuizBuilderTableRow = memo<Props>(
  ({
    term,
    termListId,
    getHasQuizMode,
    toggleQuizModeChecked,
    onRemoveTerm,
  }) => (
    <StyledTableRow>
      <TableCell>
        <SwedishDefinitionLabel term={term} />
      </TableCell>
      <TableCell align="center" padding="checkbox">
        <Checkbox
          checked={getHasQuizMode(termListId, term, "swedish_to_definition")}
          onChange={(_, checked) =>
            toggleQuizModeChecked("swedish_to_definition", checked, term)
          }
        />
      </TableCell>
      <TableCell align="center" padding="checkbox">
        <Checkbox
          checked={getHasQuizMode(termListId, term, "definition_to_swedish")}
          onChange={(_, checked) =>
            toggleQuizModeChecked("definition_to_swedish", checked, term)
          }
        />
      </TableCell>
      <TableCell align="center" padding="checkbox">
        -
      </TableCell>
      <TableCell align="center" padding="checkbox">
        <IconButton
          color="secondary"
          onClick={() => onRemoveTerm(termListId, term)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </StyledTableRow>
  )
);

QuizBuilderTableRow.displayName = "QuizBuilderTableRow";

export default QuizBuilderTableRow;
