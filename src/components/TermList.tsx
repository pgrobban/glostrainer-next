import { AddIcon, DeleteIcon } from "@/helpers/icons";
import { StyledTableCell, StyledTableRow } from "@/helpers/styleUtils";
import { Term } from "@/helpers/types";
import {
  Box,
  Button,
  Paper,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
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
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={(evt) => {
                    evt.stopPropagation();
                    onDeleteTerm(term);
                  }}
                >
                  <DeleteIcon />
                </Button>
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
