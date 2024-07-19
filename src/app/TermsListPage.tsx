import AddEditTermListDialog from "@/components/AddEditTermListDialog";
import AddIcon from "@mui/icons-material/Add";
import AddToListIcon from "@mui/icons-material/PlaylistAdd";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { UUID } from "crypto";
import { useEffect, useState } from "react";
import AddEditTermDialog from "../components/AddEditTermDialog";
import type { Term, TermList as TermListType } from "../helpers/types";
import utilClassInstances from "../helpers/utilClassInstances";
import TermList from "@/components/TermList";

const { localStorageHelperInstance } = utilClassInstances;

const TermListPage: React.FC = () => {
  const [addEditTermDialogOpen, setAddEditTermDialogOpen] = useState(false);
  const [addEditTermListDialogOpen, setAddEditTermListDialogOpen] =
    useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [activeTermListId, setActiveTermListId] = useState<UUID | null>(null);

  useEffect(() => {
    setActiveTermListId(localStorageHelperInstance.getActiveTermListId());
    setTerms(localStorageHelperInstance.getActiveTermList()?.terms || []);
  }, []);

  const onSave = (termToSave: Term) => {
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

  const onActiveListIdChanged = (newActiveTermListId: UUID) => {
    setActiveTermListId(newActiveTermListId);
    localStorageHelperInstance.setActiveTermList(newActiveTermListId);
    setTerms(localStorageHelperInstance.getActiveTermList()!.terms);
  };

  const lastSavedDate = localStorageHelperInstance.getLastSaveDate();
  const cachedTermLists = localStorageHelperInstance.getCachedTermLists();
  return (
    <>
      <Box
        sx={{
          width: { xs: "100%", md: "900px" },
          m: { xs: "16px", md: "16px auto" },
        }}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          {activeTermListId && (
            <Box>
              {terms.length === 0 && (
                <Typography sx={{ mr: 1 }}>Term list is empty.</Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={onAddTermClick}
              >
                Add term
              </Button>
            </Box>
          )}
          {cachedTermLists.length > 0 && activeTermListId && (
            <FormControl>
              <InputLabel id="term-list-select">Active list</InputLabel>
              <Select
                style={{ minWidth: 200 }}
                value={activeTermListId}
                onChange={(evt) =>
                  onActiveListIdChanged(evt.target.value as UUID)
                }
                labelId="term-list-select"
                label="Active list"
              >
                {cachedTermLists.map((termList) => (
                  <MenuItem key={termList.id} value={termList.id}>
                    {termList.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Box>
            {!activeTermListId && (
              <Typography sx={{ mr: 1 }}>
                Start by creating a term list.
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddToListIcon />}
              onClick={onCreateTermListClick}
            >
              Create term list
            </Button>
          </Box>

          {/*
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={onClearDataClick}
          >
            Clear ALL local data
          </Button>
          */}
        </Box>
        <TermList
          sx={{ mb: 1 }}
          terms={terms}
          onEditTerm={editTerm}
          onDeleteTerm={deleteTerm}
        />

        {lastSavedDate && (
          <Typography fontSize={"small"}>
            {" "}
            Last saved on {new Date(lastSavedDate).toLocaleString()}
          </Typography>
        )}
      </Box>

      <AddEditTermDialog
        open={addEditTermDialogOpen}
        editingTerm={editingTerm}
        onRequestClose={() => setAddEditTermDialogOpen(false)}
        onSave={onSave}
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
