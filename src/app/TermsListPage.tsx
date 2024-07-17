import TermList from "@/components/TermList";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import dummyTermLists from "../../test/dummyTermLists.json";
import AddEditTermDialog from "../components/AddEditTermDialog";
import { Term } from "../helpers/types";
import utilClassInstances from "../helpers/utilClassInstances";
const { localStorageHelperInstance } = utilClassInstances;
const defaultData = (
  localStorageHelperInstance.loadData()[0] || dummyTermLists[0]
).terms;

const TermListPage: React.FC = () => {
  const [addEditTermDialogOpen, setAddEditTermDialogOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [terms, setTerms] = useState<Term[]>(defaultData as Term[]);

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

  const saveLocalData = (newTerms: Term[]) => {
    localStorageHelperInstance.saveData([
      {
        name: "Default list",
        createdOn: new Date(),
        terms: newTerms,
      },
    ]);
  };

  return (
    <>
      <Box
        sx={{
          width: { xs: "100%", md: "900px" },
          m: { xs: "16px", md: "0 auto" },
        }}
      >
        <Typography sx={{ mb: 1 }} variant="h3">
          Term list
        </Typography>

        <Box display={"flex"} justifyContent={"space-between"}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddTermClick}
          >
            Add term
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={() => localStorageHelperInstance.clearData()}
          >
            Clear ALL local data
            <br />
            (REVERT TO DUMMY DATA)
          </Button>
        </Box>

        <TermList
          terms={terms}
          onEditTerm={editTerm}
          onDeleteTerm={deleteTerm}
        />
      </Box>

      <AddEditTermDialog
        open={addEditTermDialogOpen}
        editingTerm={editingTerm}
        onRequestClose={() => setAddEditTermDialogOpen(false)}
        onSave={onSave}
      />
    </>
  );
};

export default TermListPage;
