import { memo } from "react";
import TermList from "@/components/TermList";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import type { Term, TermList as TermListType } from "../helpers/types";
import { DateTime } from "ts-luxon";
import { Box, Collapse, IconButton, TableCell, TableRow } from "@mui/material";
import { filterTerm } from "@/helpers/searchUtils";

const TermListRow = memo(
  (props: {
    termList: TermListType;
    open: boolean;
    onOpenChange: (val: boolean) => void;
    onOpenEdit: () => void;
    onOpenDelete: () => void;
    onOpenAddTerm: () => void;
    onOpenEditTerm: (term: Term) => void;
    onOpenDeleteTerm: (term: Term) => void;
    searchTerm: string;
  }) => {
    const {
      termList,
      open,
      onOpenChange,
      onOpenEdit,
      onOpenDelete,
      onOpenAddTerm,
      onOpenEditTerm,
      onOpenDeleteTerm,
      searchTerm,
    } = props;
    const { name, terms, updatedOn } = termList;
    const filteredTerms = terms.filter((term) => filterTerm(term, searchTerm));
    return (
      <>
        <TableRow
          sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
          onClick={() => onOpenChange(!open)}
        >
          <TableCell>
            <IconButton aria-label="expand row" size="small">
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
              ? typeof updatedOn === "string"
                ? DateTime.fromISO(updatedOn).toLocaleString(
                    DateTime.DATETIME_SHORT
                  )
                : DateTime.fromJSDate(updatedOn).toLocaleString(
                    DateTime.DATETIME_SHORT
                  )
              : ""}
          </TableCell>
          <TableCell>
            <IconButton
              color="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDelete();
              }}
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
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
  }
);
TermListRow.displayName = "TermListRow";

export default TermListRow;
