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
import DeleteIcon from "@mui/icons-material/Delete";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useMemo, useState } from "react";

interface Props {
  terms: Term[];
  onAddTermClick: () => void;
  onEditTerm: (term: Term) => void;
  onDeleteTerm: (term: Term) => void;
  sx?: SxProps;
  searchTerm: string;
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
  cursor: "pointer",
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
  searchTerm,
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

  const isEmpty = sortedTerms.length === 0;
  return (
    <TableContainer sx={sx} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {isEmpty && (
              <TableCell colSpan={5}>
                {searchTerm.length === 0 ? (
                  <>
                    There are no terms in this list.
                    <br />
                    Start adding terms by clicking the button below.
                  </>
                ) : (
                  "No terms match the search filter."
                )}
              </TableCell>
            )}
            {!isEmpty &&
              headCells.map((headCell) => (
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
            {!isEmpty && (
              <StyledTableCell sx={{ fontWeight: 600 }}>Notes</StyledTableCell>
            )}
            {!isEmpty && (
              <StyledTableCell width={100}>{/* actions */}</StyledTableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedTerms.map((term, index) => (
            <StyledTableRow
              key={index}
              onClick={(evt) => {
                evt.bubbles = false;
                onEditTerm(term);
              }}
            >
              <StyledTableCell>{term.swedish}</StyledTableCell>
              <StyledTableCell>{term.definition}</StyledTableCell>
              <StyledTableCell>{term.type}</StyledTableCell>
              <StyledTableCell>{term.notes}</StyledTableCell>
              <StyledTableCell padding="none">
                <IconButton
                  color="secondary"
                  onClick={(evt) => {
                    evt.stopPropagation();
                    onDeleteTerm(term);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
          <TableRow>
            <TableCell>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={onAddTermClick}
              >
                Add term
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TermList;
