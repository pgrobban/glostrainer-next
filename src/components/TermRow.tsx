import { DeleteIcon } from "@/helpers/icons";
import { StyledTableCell, StyledTableRow } from "@/helpers/styleUtils";
import { Term } from "@/helpers/types";
import { Button } from "@mui/material";
import { memo } from "react";

interface Props {
  term: Term;
  onClickEdit: () => void;
  onClickDelete: () => void;
}

const TermRow: React.FC<Props> = memo(
  ({ term, onClickDelete, onClickEdit }) => (
    <StyledTableRow
      onClick={(evt) => {
        evt.bubbles = false;
        onClickEdit();
      }}
    >
      <StyledTableCell>{term.swedish}</StyledTableCell>
      <StyledTableCell>{term.definition}</StyledTableCell>
      <StyledTableCell>{term.type}</StyledTableCell>
      <StyledTableCell>{term.notes}</StyledTableCell>
      <StyledTableCell padding="none">
        <Button
          color="secondary"
          variant="outlined"
          onClick={(evt) => {
            evt.stopPropagation();
            onClickDelete();
          }}
        >
          <DeleteIcon />
        </Button>
      </StyledTableCell>
    </StyledTableRow>
  )
);

TermRow.displayName = "TermRow";
export default TermRow;
