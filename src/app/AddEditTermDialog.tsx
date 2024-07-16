import {
  AppBar,
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Conjugation, Term } from "./types";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  open: boolean;
  editingTerm?: Term;
  onRequestClose: () => void;
  onSave: (term: Term) => void;
}

const AddEditTermDialog: React.FC<Props> = (props) => {
  const { open, editingTerm, onRequestClose, onSave } = props;
  const [swedish, setSwedish] = useState("");
  const [definition, setDefinition] = useState("");
  const [conjugations, setConjugations] = useState<Conjugation[]>([]);
  const [notes, setNotes] = useState("");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const addConjugation = () =>
    setConjugations([...conjugations, { form: "", term: "" }]);
  const removeConjugation = (index: number) =>
    setConjugations(conjugations.filter((_, i) => i !== index));
  const setConjugation = (
    index: number,
    key: keyof Conjugation,
    value: string
  ) => {
    const newConjugations = [...conjugations];
    conjugations[index][key] = value;
    setConjugations(newConjugations);
  };

  return (
    <Dialog
      open={open}
      fullScreen={fullScreen}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: theme.breakpoints.values.md,
          },
        },
      }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton onClick={onRequestClose}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {editingTerm ? "Edit term" : "Add new term"}
          </Typography>
          <Button autoFocus color="inherit" onClick={onRequestClose}>
            Save
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="form" noValidate autoComplete="off">
        <Box sx={{ m: 3, "& .MuiTextField-root": { mt: 1, mb: 1 } }}>
          <Typography sx={{ mb: 1 }} variant="h6">
            Base info
          </Typography>

          <TextField
            required
            label="Swedish"
            fullWidth
            value={swedish}
            onChange={(evt) => setSwedish(evt.target.value)}
          />

          <TextField
            required
            label="Definition"
            fullWidth
            value={definition}
            onChange={(evt) => setDefinition(evt.target.value)}
          />
          <Divider sx={{ m: 2 }} />
          <Box sx={{ display: "flex" }} justifyContent={"space-between"}>
            <Typography variant="h6">Conjugations</Typography>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={addConjugation}
            >
              Add conjugation
            </Button>
          </Box>

          {conjugations.map((conjugation, index) => (
            <Box key={index} sx={{ display: "flex" }}>
              <TextField
                required
                label="Form"
                fullWidth
                value={conjugation.form}
                onChange={(evt) =>
                  setConjugation(index, "form", evt.target.value)
                }
              />
              <TextField
                required
                label="Term"
                fullWidth
                value={conjugation.term}
                onChange={(evt) =>
                  setConjugation(index, "term", evt.target.value)
                }
              />
              <IconButton
                color="secondary"
                onClick={() => removeConjugation(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Divider sx={{ m: 2 }} />

          <Typography sx={{ mb: 1 }} variant="h6">
            Notes
          </Typography>

          <TextField label="Notes" multiline rows={4} fullWidth />
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddEditTermDialog;
