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
import { visuallyHidden } from "@mui/utils";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useMemo, useState } from "react";

interface Props {
  terms: Term[];
  onAddTermClick: () => void;
  onEditTerm: (term: Term) => void;
  onDeleteTerm: (term: Term) => void;
  sx?: SxProps;
}

type TermOrderable = "swedish" | "definition" | "type";

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

const headCells = [
  {
    id: "swedish",
    label: "Swedish",
  },
  {
    id: "definition",
    label: "Definition",
  },
  {
    id: "type",
    label: "Word class",
  },
];

function descendingTermComparator(a: Term, b: Term, orderBy: TermOrderable) {
  return b[orderBy].localeCompare(a[orderBy], "sv");
}

type Order = "asc" | "desc";

function getTermComparator(
  order: Order,
  orderBy: TermOrderable
): (a: Term, b: Term) => number {
  return order === "desc"
    ? (a, b) => descendingTermComparator(a, b, orderBy)
    : (a, b) => -descendingTermComparator(a, b, orderBy);
}

const TermList: React.FC<Props> = ({
  sx,
  terms,
  onAddTermClick,
  onEditTerm,
  onDeleteTerm,
}) => {
  const [orderBy, setOrderBy] = useState<TermOrderable | null>();
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const createSortHandler = (property: TermOrderable) => () => {
    handleRequestSort(property);
  };

  const handleRequestSort = (property: TermOrderable) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedTerms = useMemo(
    () =>
      orderBy ? terms.slice().sort(getTermComparator(order, orderBy)) : terms,
    [order, orderBy, terms]
  );

  return (
    <TableContainer sx={sx} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <StyledTableCell key={headCell.id} sx={{ fontWeight: 600 }}>
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id as TermOrderable)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </StyledTableCell>
            ))}
            <StyledTableCell sx={{ fontWeight: 600 }}>Notes</StyledTableCell>
            <StyledTableCell width={100}>{/* actions */}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedTerms.map((term, index) => (
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
                variant="outlined"
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
