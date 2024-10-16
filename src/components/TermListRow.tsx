import { memo } from "react";
import TermList from "@/components/TermList";
import type { Term, TermList as TermListType } from "../helpers/types";
import {
  Box,
  Collapse,
  Button,
  TableCell,
  TableRow,
  IconButton,
} from "@mui/material";
import { filterTerm } from "@/helpers/searchUtils";
import { getLocalDateTime } from "@/helpers/dateUtils";
import { ArrowDownIcon, ArrowUpIcon, DeleteIcon } from "@/helpers/icons";

interface Props {
  termList: TermListType;
  expanded: boolean;
  onExpandedChange: (val: boolean) => void;
  onOpenEdit: () => void;
  onOpenDelete: () => void;
  onOpenAddTerm: () => void;
  onOpenEditTerm: (term: Term) => void;
  onOpenDeleteTerm: (term: Term) => void;
  searchTerm: string;
}

const TermListRow = memo((props: Props) => {
  const {
    termList,
    expanded,
    onExpandedChange,
    onOpenEdit,
    onOpenDelete,
    onOpenAddTerm,
    onOpenEditTerm,
    onOpenDeleteTerm,
    searchTerm,
  } = props;
  const { name, terms, createdOn, updatedOn } = termList;
  const filteredTerms = terms.filter((term) => filterTerm(term, searchTerm));
  return (
    <>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
        onClick={() => onExpandedChange(!expanded)}
      >
        <TableCell>
          <IconButton aria-label="expand row" size="small">
            {expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          onClick={(e) => {
            e.stopPropagation();
            onOpenEdit();
          }}
        >
          {name}
        </TableCell>
        <TableCell>{terms.length}</TableCell>
        <TableCell>
          {updatedOn
            ? getLocalDateTime(updatedOn)
            : getLocalDateTime(createdOn)}
        </TableCell>
        <TableCell align="right">
          <Button
            color="secondary"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDelete();
            }}
          >
            <DeleteIcon />
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ pt: 0, pb: 0, pl: [1, 2], pr: [1, 2] }} colSpan={6}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <TermList
                terms={filteredTerms}
                searchTerm={searchTerm}
                onAddTermClick={onOpenAddTerm}
                onEditTerm={onOpenEditTerm}
                onDeleteTerm={onOpenDeleteTerm}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
});
TermListRow.displayName = "TermListRow";

export default TermListRow;
