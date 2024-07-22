import { Term } from "@/helpers/types";
import {
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Box,
  IconButton,
  styled,
  tableCellClasses,
  TableContainer,
  Paper,
  SxProps,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  terms: Term[];
  onAddTermClick: () => void;
  onEditTerm: (term: Term) => void;
  onDeleteTerm: (term: Term) => void;
  sx?: SxProps;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TermList: React.FC<Props> = ({
  sx,
  terms,
  onAddTermClick,
  onEditTerm,
  onDeleteTerm,
}) => {
  return (
    <TableContainer sx={sx} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ fontWeight: 600 }}>Swedish</StyledTableCell>
            <StyledTableCell sx={{ fontWeight: 600 }}>
              Definition
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: 600 }}>
              Word class
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: 600 }}>Notes</StyledTableCell>
            <StyledTableCell width={100}>{/* actions */}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {terms.map((term, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{term.swedish}</StyledTableCell>
              <StyledTableCell>{term.definition}</StyledTableCell>
              <StyledTableCell>{term.type}</StyledTableCell>
              <StyledTableCell>{term.notes}</StyledTableCell>
              <StyledTableCell padding="none">
                <Box>
                  <IconButton color="primary" onClick={() => onEditTerm(term)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => onDeleteTerm(term)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </StyledTableCell>
            </StyledTableRow>
          ))}
          <TableRow>
            <TableRow>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={onAddTermClick}
              >
                Add term
              </Button>
            </TableRow>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TermList;
