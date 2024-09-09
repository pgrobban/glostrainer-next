"use client";
import AddEditTermListDialog from "@/components/AddEditTermListDialog";
import AddToListIcon from "@mui/icons-material/PlaylistAdd";
import {
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Paper,
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
import ConfirmDeleteTermListDialog from "@/components/ConfirmDeleteTermListDialog";
import TermListRow from "@/components/TermListRow";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { filterTerm } from "@/helpers/searchUtils";
import WithLoading from "@/helpers/WithLoading";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const activeTermListId = localStorageHelperInstance.getActiveTermListId();
    if (activeTermListId) {
      setExpandedTermLists([activeTermListId]);
    }
    setCachedTermLists(localStorageHelperInstance.getCachedTermLists());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (searchTerm.length === 0) {
      return;
    }
    const termLists = localStorageHelperInstance.getCachedTermLists();
    const filteredTermLists = termLists.filter((termList) =>
      termList.terms.some((term) => filterTerm(term, searchTerm))
    );
    const filteredTermListIds = filteredTermLists.map(
      (termList) => termList.id
    );
    setExpandedTermLists(filteredTermListIds);
  }, [searchTerm]);

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
    setSearchTerm("");
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
    setSearchTerm("");
    setEditingTerm(null);
    setAddEditTermDialogOpen(true);
  };

  const onCreateTermListClick = () => {
    setAddEditTermListDialogOpen(true);
  };

  const saveLocalData = (newTerms: Term[]) => {
    localStorageHelperInstance.updateActiveTermList(newTerms);
    setCachedTermLists([...localStorageHelperInstance.getCachedTermLists()]);
  };

  const onTermListSaved = (newTermList: TermListType) => {
    if (editingTermListId) {
    } else {
      setSearchTerm("");
      localStorageHelperInstance.setActiveTermList(newTermList.id);
      setExpandedTermLists([newTermList.id]);
    }
    setAddEditTermListDialogOpen(false);
    setTimeout(() => setEditingTermListId(null), 500);
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
      localStorageHelperInstance.setActiveTermList(id);
    } else {
      setExpandedTermLists([]);
      localStorageHelperInstance.setActiveTermList(null);
    }
  };

  const activeTermListName =
    localStorageHelperInstance.getActiveTermList()?.name;
  return (
    <>
      <Box
        sx={{
          width: { xs: "100%", md: "900px" },
          m: { xs: "16px", md: "16px auto" },
        }}
      >
        <WithLoading isLoading={isLoading}>
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
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Box textAlign={"center"} width={"100%"}>
                        <Typography variant="h4">My term lists</Typography>
                      </Box>
                      <Input
                        sx={{ width: "250px" }}
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        startAdornment={
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        }
                        endAdornment={
                          searchTerm.length > 0 && (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setSearchTerm("")}>
                                <ClearIcon />
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      />
                    </Box>
                  </TableCell>
                </TableRow>
                {cachedTermLists.length > 0 && (
                  <TableRow>
                    <TableCell>{/* expand button */}</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Last update</TableCell>
                    <TableCell>{/* delete button */}</TableCell>
                  </TableRow>
                )}
              </TableHead>
              <TableBody>
                {cachedTermLists.map((termList) => (
                  <TermListRow
                    key={`term-list-row-${termList.id}`}
                    termList={termList}
                    open={expandedTermLists.includes(termList.id)}
                    onOpenChange={(open) => handleOpenChange(termList.id, open)}
                    onOpenEdit={() => {
                      setEditingTermListId(termList.id);
                      setAddEditTermListDialogOpen(true);
                    }}
                    onOpenDelete={() => {
                      setTermListToDeleteId(termList.id);
                      setTermListToDeleteName(termList.name);
                    }}
                    onOpenAddTerm={onAddTermClick}
                    onOpenEditTerm={editTerm}
                    onOpenDeleteTerm={deleteTerm}
                    searchTerm={searchTerm}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {cachedTermLists.length === 0 && (
            <Typography>You haven&apos;t created any lists yet.</Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddToListIcon />}
            onClick={onCreateTermListClick}
          >
            Create term list
          </Button>
        </WithLoading>
      </Box>

      <AddEditTermDialog
        open={addEditTermDialogOpen}
        editingTerm={editingTerm}
        onClose={() => setAddEditTermDialogOpen(false)}
        onSave={onSaveTerm}
        addingToListName={activeTermListName}
      />

      <AddEditTermListDialog
        open={addEditTermListDialogOpen}
        mode={editingTermListId ? "edit" : "add"}
        onClose={() => {
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
