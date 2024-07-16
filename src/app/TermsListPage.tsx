import { Typography, Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddEditTermDialog from "./AddEditTermDialog";
import { useState } from "react";
import { Term } from "./types";

const TermList: React.FC = () => {
  const [addEditTermDialogOpen, setAddEditTermDialogOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);

  return (
    <>
      <Box
        sx={{
          width: { xs: "100%", md: "800px" },
          m: { xs: "16px", md: "0 auto" },
        }}
      >
        <Typography variant="h3">Term list</Typography>

        <Box justifyContent={"space-between"}>
          <p>Remember to save regularly!</p>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setAddEditTermDialogOpen(true)}
          >
            Add term
          </Button>
        </Box>
      </Box>

      <AddEditTermDialog
        open={addEditTermDialogOpen}
        onRequestClose={() => setAddEditTermDialogOpen(false)}
        onSave={(term) => {}}
      />
    </>
  );
};

export default TermList;
