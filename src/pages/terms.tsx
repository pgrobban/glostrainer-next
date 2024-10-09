"use client";
import AddEditTermListDialog from "@/components/AddEditTermListDialog";
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
import AddEditTermDialog, {
  TermSaveModel,
} from "@/components/AddEditTermDialog";
import type { Term, TermList as TermListType } from "../helpers/types";
import utilClassInstances from "@/helpers/utilClassInstances";
import ConfirmDeleteTermListDialog from "@/components/ConfirmDeleteTermListDialog";
import TermListRow from "@/components/TermListRow";
import { filterTerm } from "@/helpers/searchUtils";
import WithLoading from "@/helpers/WithLoading";
import ResponsiveAppBar from "@/app/ResponsiveAppBar";
import { AddToListIcon, ClearIcon, SearchIcon } from "@/helpers/icons";
import { StyledTableHeadRow } from "@/helpers/styleUtils";

const { localStorageHelperInstance } = utilClassInstances;

const TermListPage: React.FC = () => {
  const [addEditTermDialogOpen, setAddEditTermDialogOpen] = useState(false);
  const [addEditTermListDialogOpen, setAddEditTermListDialogOpen] =
    useState(false);
  const [editingTermId, setEditingTermId] = useState<UUID | null>(null);
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

  const onSaveTerm = (termSaveModel: TermSaveModel) => {
    if (editingTermId) {
      localStorageHelperInstance.updateTerm(editingTermId, termSaveModel);
    } else {
      localStorageHelperInstance.addTerm(termSaveModel);
    }
    setAddEditTermDialogOpen(false);
    setTimeout(() => setEditingTermId(null), 500); // don't show the title change too quickly
  };

  const editTerm = (term: Term) => {
    setSearchTerm("");
    setEditingTermId(term.id);
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
    setEditingTermId(null);
    setAddEditTermDialogOpen(true);
  };

  const onCreateTermListClick = () => {
    setAddEditTermListDialogOpen(true);
  };

  const saveLocalData = (newTerms: Term[]) => {
    localStorageHelperInstance.updateActiveTermList(newTerms);
    setCachedTermLists([...localStorageHelperInstance.getCachedTermLists()]);
  };

  const onTermListDeleted = () => {
    if (!termListToDeleteId) {
      return;
    }
    localStorageHelperInstance.deleteTermList(termListToDeleteId);
    setCachedTermLists(localStorageHelperInstance.getCachedTermLists());
    setTermListToDeleteId(null);
  };

  const handleExpandedChange = (id: UUID, open: boolean) => {
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
      <ResponsiveAppBar />
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
                <StyledTableHeadRow>
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
                </StyledTableHeadRow>
                {cachedTermLists.length > 0 && (
                  <TableRow>
                    <TableCell>{/* expand button */}</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Terms</TableCell>
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
                    expanded={expandedTermLists.includes(termList.id)}
                    onExpandedChange={(open) =>
                      handleExpandedChange(termList.id, open)
                    }
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
        editingTermId={editingTermId}
        onClose={() => setAddEditTermDialogOpen(false)}
        onSave={onSaveTerm}
      />

      <AddEditTermListDialog
        open={addEditTermListDialogOpen}
        onClose={() => {
          setAddEditTermListDialogOpen(false);
          setEditingTermListId(null);
        }}
        onSave={({ name }) => {
          if (editingTermListId) {
            localStorageHelperInstance.renameTermList(editingTermListId, name);
          } else {
            localStorageHelperInstance.createNewTermList(name);
          }
          localStorageHelperInstance.saveData();
          setSearchTerm("");
          setAddEditTermListDialogOpen(false);
          setTimeout(() => setEditingTermListId(null), 500);
        }}
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
