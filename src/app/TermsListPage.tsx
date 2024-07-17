import { Typography, Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddEditTermDialog from "../components/AddEditTermDialog";
import { useState } from "react";
import { Term } from "../helpers/types";
import TermList from "@/components/TermList";
import dummyTermLists from "../../test/dummyTermLists.json";

const TermListPage: React.FC = () => {
  const [addEditTermDialogOpen, setAddEditTermDialogOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [terms, setTerms] = useState<Term[]>(dummyTermLists[0].terms as Term[]);

  const onSave = (term: Term) => {
    if (editingTerm) {
    } else {
      setTerms([...terms, term]);
    }
    setEditingTerm(null);
    setAddEditTermDialogOpen(false);
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

        <Box justifyContent={"space-between"}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setAddEditTermDialogOpen(true)}
          >
            Add term
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
