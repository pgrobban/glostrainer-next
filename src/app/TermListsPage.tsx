"use client";
import AddEditTermListDialog from "@/components/AddEditTermListDialog";
import AddIcon from "@mui/icons-material/Add";
import AddToListIcon from "@mui/icons-material/PlaylistAdd";
import {
  Box,
  Button,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { UUID } from "crypto";
import { useEffect, useState } from "react";
import AddEditTermDialog from "../components/AddEditTermDialog";
import type { Term, TermList as TermListType } from "../helpers/types";
import utilClassInstances from "../helpers/utilClassInstances";
import TermList from "@/components/TermList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import { DateTime } from "ts-luxon";

const { localStorageHelperInstance } = utilClassInstances;

const TermListPage: React.FC = () => {
  const [addEditTermDialogOpen, setAddEditTermDialogOpen] = useState(false);
  const [addEditTermListDialogOpen, setAddEditTermListDialogOpen] =
    useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [activeTermListId, setActiveTermListId] = useState<UUID | null>(null);
  const [cachedTermLists, setCachedTermLists] = useState<TermListType[]>([]);

  useEffect(() => {
    setActiveTermListId(localStorageHelperInstance.getActiveTermListId());
    setTerms(localStorageHelperInstance.getActiveTermList()?.terms || []);
    setCachedTermLists(localStorageHelperInstance.getCachedTermLists());
  }, []);

  const onSaveTerm = (termToSave: Term) => {
    const newTerms = [...terms];
    if (editingTerm) {
      const termIndex = terms.findIndex(
        (term) =>
          term.swedish === editingTerm.swedish &&
          term.definition === editingTerm.definition
      );
      newTerms.splice(termIndex, 1, termToSave);
      setTerms(newTerms);
    } else {
      newTerms.push(termToSave);
      setTerms(newTerms);
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
    const newTerms = [...terms];
    const termIndex = terms.findIndex(
      (term) =>
        term.swedish === termToDelete.swedish &&
        term.definition === termToDelete.definition
    );
    newTerms.splice(termIndex, 1);
    setTerms(newTerms);
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

  const onNewTermListSaved = (newTermList: TermListType) => {
    setActiveTermListId(newTermList.id);
    setAddEditTermListDialogOpen(false);
  };

  /*
  const onClearDataClick = () => {
    localStorageHelperInstance.clearData();
    setActiveTermListId(null);
  };
  */

  const onDeleteTermList = (id: UUID) => {};

  const TermListRow = (props: { termList: TermListType }) => {
    const { id, name, terms, updatedOn } = props.termList;
    const [open, setOpen] = useState(activeTermListId === id);

    const onToggleOpen = () => {
      if (open) {
        setOpen(false);
        setActiveTermListId(null);
        localStorageHelperInstance.setActiveTermList(null);
      } else {
        setOpen(true);
        setActiveTermListId(id);
        localStorageHelperInstance.setActiveTermList(id);
      }
      setTerms(localStorageHelperInstance.getActiveTermList()?.terms || []);
    };

    return (
      <>
        <TableRow
          sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
          onClick={onToggleOpen}
        >
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                const newOpen = !open;
                setOpen(!open);
                setActiveTermListId(newOpen ? id : null);
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
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
            <IconButton color="secondary" onClick={() => onDeleteTermList(id)}>
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
  };

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
              <TableRow>
                <TableCell align="center" colSpan={5}>
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
                <TermListRow key={termList.id} termList={termList} />
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
        mode="add"
        onRequestClose={() => setAddEditTermListDialogOpen(false)}
        onSave={onNewTermListSaved}
      />
    </>
  );
};

export default TermListPage;
