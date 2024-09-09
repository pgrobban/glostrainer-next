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
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  NativeSelect,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  CommonDialogProps,
  Conjugation,
  Term,
  WordClasses,
  WordClassType,
} from "../helpers/types";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props extends CommonDialogProps {
  onSave: (term: Term) => void;
  addingToListName?: string;
  editingTerm?: Term | null;
}

const AddEditTermDialog: React.FC<Props> = ({
  editingTerm = null,
  onClose = () => {},
  onSave = () => {},
  ...props
}) => {
  const { open, addingToListName } = props;
  const [swedish, setSwedish] = useState("");
  const [definition, setDefinition] = useState("");
  const [type, setType] = useState<WordClassType | "">("");
  const [conjugations, setConjugations] = useState<Conjugation[]>([]);
  const [notes, setNotes] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

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
  const onClickSave = () => {
    if (type === "") {
      return;
    }
    onSave({
      swedish,
      definition,
      type,
      conjugations,
      notes,
    });
  };

  useEffect(() => {
    setSwedish(editingTerm?.swedish || "");
    setDefinition(editingTerm?.definition || "");
    setType(editingTerm?.type || "");
    setConjugations(editingTerm?.conjugations || []);
    setNotes(editingTerm?.notes || "");
    setIsFormValid(!!editingTerm);
  }, [editingTerm, open]);

  useEffect(() => {
    setIsFormValid(!!(swedish.trim() && definition.trim() && type));
  }, [swedish, definition, type]);

  return (
    <Dialog
      onClose={onClose}
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
      disableRestoreFocus
      data-testid={"add-edit-term-dialog"}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {editingTerm
              ? "Edit term"
              : `Add new term to list '${addingToListName}'`}
          </Typography>
          <Button
            type="submit"
            autoFocus
            disabled={!isFormValid}
            color="inherit"
            onClick={onClickSave}
          >
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
            autoFocus
            data-testid="term-swedish"
            placeholder="Swedish"
          />

          <TextField
            required
            label="Definition"
            fullWidth
            value={definition}
            onChange={(evt) => setDefinition(evt.target.value)}
          />

          <FormControl
            sx={{ mt: 1, display: ["inline-flex", "none"] }}
            required
            fullWidth
          >
            <InputLabel variant="standard" htmlFor="word-class-select-native">
              Word class
            </InputLabel>
            <NativeSelect
              inputProps={{
                name: "word-class",
                id: "word-class-select-native",
              }}
              defaultValue={""}
              onChange={(evt) => setType(evt.target.value as WordClassType)}
            >
              <option value={""} disabled style={{ fontStyle: "italic" }}>
                Select a word class
              </option>
              {WordClasses.map((wordClass) => (
                <option key={wordClass} value={wordClass}>
                  {wordClass}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
          <FormControl
            sx={{ mt: 1, display: ["none", "inline-flex"] }}
            required
            fullWidth
          >
            <InputLabel id="word-class-select-label">Word class</InputLabel>

            <Select
              data-testid="term-word-class"
              label="Word class"
              labelId="word-class-select-label"
              value={type}
              onChange={(evt) =>
                setType(evt.target.value as WordClassType | "")
              }
            >
              <MenuItem value="" disabled sx={{ fontStyle: "italic" }}>
                Select a word class
              </MenuItem>
              {WordClasses.map((wordClass) => (
                <MenuItem key={wordClass} value={wordClass}>
                  {wordClass}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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

          <TextField
            label="Notes"
            multiline
            rows={4}
            fullWidth
            value={notes}
            onChange={(evt) => setNotes(evt.target.value)}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddEditTermDialog;
