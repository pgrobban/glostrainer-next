import { DeleteIcon } from "@/helpers/icons";
import { StyledTableCell, StyledTableRow } from "@/helpers/styleUtils";
import { getShortLabelFromNounType } from "@/helpers/termUtils";
import { NounType, Term } from "@/helpers/types";
import { Box, Button, Typography } from "@mui/material";
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
      <StyledTableCell>
        {term.type}
        {term.nounType && (
          <Typography>{getShortLabelFromNounType(term.nounType)}</Typography>
        )}
      </StyledTableCell>
      <StyledTableCell>{term.notes}</StyledTableCell>
      <StyledTableCell sx={{ p: 1 }} align="right">
        <Box mr={1}>
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
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  )
);

TermRow.displayName = "TermRow";
export default TermRow;
