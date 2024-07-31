"use client";
import AddEditTermListDialog from "@/components/AddEditTermListDialog";
import TermList from "@/components/TermList";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddToListIcon from "@mui/icons-material/PlaylistAdd";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { UUID } from "crypto";
import { memo, useEffect, useRef, useState } from "react";
import { DateTime } from "ts-luxon";
import AddEditTermDialog from "../components/AddEditTermDialog";
import type { Term, TermList as TermListType } from "../helpers/types";
import utilClassInstances from "../helpers/utilClassInstances";
import ConfirmDeleteTermListDialog from "@/components/ConfirmDeleteTermListDialog";

const { localStorageHelperInstance } = utilClassInstances;

const TermListPage: React.FC = () => {
  const [addEditTermDialogOpen, setAddEditTermDialogOpen] = useState(false);
  const [addEditTermListDialogOpen, setAddEditTermListDialogOpen] =
    useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [expandedTermLists, setExpandedTermLists] = useState<UUID[]>([]);
  const [editingTermListId, setEditingTermListId] = useState<UUID | null>(null);
  const [cachedTermLists, setCachedTermLists] = useState<TermListType[]>([]);
  const [termListToDeleteId, setTermListToDeleteId] = useState<UUID | null>(
    null
  );
  const [termListToDeleteName, setTermListToDeleteName] = useState("");

  useEffect(() => {
    const activeTermListId = localStorageHelperInstance.getActiveTermListId();
    if (activeTermListId) {
      setExpandedTermLists([activeTermListId]);
    }
    setCachedTermLists(localStorageHelperInstance.getCachedTermLists());
  }, []);

  const onSaveTerm = (termToSave: Term) => {
    const terms = localStorageHelperInstance.getActiveTermList()?.terms || [];
    const newTerms = [...terms];
    if (editingTerm) {
      const termIndex = terms.findIndex(
        (term) =>
          term.swedish === editingTerm.swedish &&
          term.definition === editingTerm.definition
      );
      newTerms.splice(termIndex, 1, termToSave);
    } else {
      newTerms.push(termToSave);
    }
    saveLocalData(newTerms);
    setAddEditTermDialogOpen(false);
    setTimeout(() => setEditingTerm(null), 500); // don't show the title change too quickly
  };

  const editTerm = (term: Term) => {
    setEditingTerm(term);
    setAddEditTermDialogOpen(true);
  };

  const deleteTerm = (termToDelete: Term) => {
    const terms = localStorageHelperInstance.getActiveTermList()?.terms || [];
    const newTerms = [...terms];
    const termIndex = terms.findIndex(
      (term) =>
        term.swedish === termToDelete.swedish &&
        term.definition === termToDelete.definition
    );
    newTerms.splice(termIndex, 1);
    saveLocalData(newTerms);
  };

  const onAddTermClick = () => {
    setEditingTerm(null);
    setAddEditTermDialogOpen(true);
  };

  const onCreateTermListClick = () => {
    setAddEditTermListDialogOpen(true);
  };

  const saveLocalData = (newTerms: Term[]) => {
    localStorageHelperInstance.updateActiveTermList(newTerms);
  };

  const onTermListSaved = (newTermList: TermListType) => {
    if (editingTermListId) {
      setEditingTermListId(null);
    } else {
      setExpandedTermLists([newTermList.id]);
    }
    setAddEditTermListDialogOpen(false);
  };

  const onTermListDeleted = () => {
    if (!termListToDeleteId) {
      return;
    }
    localStorageHelperInstance.deleteTermList(termListToDeleteId);
    setCachedTermLists(localStorageHelperInstance.getCachedTermLists());
    setTermListToDeleteId(null);
  };

  const handleOpenChange = (id: UUID, open: boolean) => {
    if (open) {
      setExpandedTermLists([id]);
    } else {
      setExpandedTermLists([]);
    }
  };

  /*
  const onClearDataClick = () => {
    localStorageHelperInstance.clearData();
    setActiveTermListId(null);
  };
  */

  const TermListRow = memo(
    (props: {
      termList: TermListType;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    }) => {
      const { open, onOpenChange, termList } = props;
      const { id, name, terms, updatedOn } = termList;

      return (
        <>
          <TableRow
            sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
            onClick={() => onOpenChange(!open)}
          >
            <TableCell>
              <IconButton aria-label="expand row" size="small">
                {props.open ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              onClick={(e) => {
                e.stopPropagation();
                setEditingTermListId(id);
                setAddEditTermListDialogOpen(true);
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
                  setTermListToDeleteId(id);
                  setTermListToDeleteName(name);
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
                    terms={terms}
                    onAddTermClick={onAddTermClick}
                    onEditTerm={editTerm}
                    onDeleteTerm={deleteTerm}
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

  return (
    <>
      <Box
        sx={{
          width: { xs: "100%", md: "900px" },
          m: { xs: "16px", md: "16px auto" },
        }}
      >
        <TableContainer sx={{ mb: 3 }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "" }}>
                <TableCell
                  align="center"
                  colSpan={5}
                  sx={(theme) => ({
                    fontWeight: 600,
                    backgroundColor: theme.palette.common.black,
                  })}
                >
                  My term lists
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{/* expand button */}</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Last update</TableCell>
                <TableCell>{/* delete button */}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cachedTermLists.map((termList) => (
                <TermListRow
                  key={`term-list-row-${termList.id}`}
                  termList={termList}
                  open={expandedTermLists.includes(termList.id)}
                  onOpenChange={(open) => handleOpenChange(termList.id, open)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddToListIcon />}
          onClick={onCreateTermListClick}
        >
          Create term list
        </Button>
      </Box>

      <AddEditTermDialog
        open={addEditTermDialogOpen}
        editingTerm={editingTerm}
        onRequestClose={() => setAddEditTermDialogOpen(false)}
        onSave={onSaveTerm}
      />

      <AddEditTermListDialog
        open={addEditTermListDialogOpen}
        mode={editingTermListId ? "edit" : "add"}
        onRequestClose={() => {
          setAddEditTermListDialogOpen(false);
          setEditingTermListId(null);
        }}
        onSave={onTermListSaved}
        editingTermListId={editingTermListId}
      />

      <ConfirmDeleteTermListDialog
        open={!!termListToDeleteId}
        onClose={() => setTermListToDeleteId(null)}
        onConfirm={onTermListDeleted}
        termListName={termListToDeleteName}
      />
    </>
  );
};

export default TermListPage;
