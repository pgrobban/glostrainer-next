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
import {
  CommonDialogProps,
  Conjugation,
  Term,
  WordClasses,
  WordClassType,
} from "../helpers/types";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import { AddIcon, CloseIcon, DeleteIcon } from "@/helpers/icons";
import { UUID } from "crypto";
import { Field, Form } from "react-final-form";
import utilClassInstances from "../../src/helpers/utilClassInstances";
const { localStorageHelperInstance } = utilClassInstances;

const defaultTermSaveModel: Omit<Term, "id"> = {
  swedish: "",
  definition: "",
  // @ts-expect-error
  type: "", // select box empty for UX?
};
export type TermSaveModel = typeof defaultTermSaveModel;

interface Props extends CommonDialogProps {
  onSave: (termSaveModel: TermSaveModel) => void;
  editingTermId?: UUID | null;
}

const AddEditTermDialog: React.FC<Props> = (props) => {
  const { open, onSave, editingTermId, onClose } = props;
  const [initialValues, setInitialValues] = useState<TermSaveModel>({
    ...defaultTermSaveModel,
  });

  const [conjugations, setConjugations] = useState<Conjugation[]>([]);

  useEffect(() => {
    if (!open) {
      setInitialValues({ ...defaultTermSaveModel });
      setConjugations([]);
      return;
    }

    if (editingTermId) {
      const activeTermList = localStorageHelperInstance.getActiveTermList();
      const term = activeTermList?.terms.find(
        (term) => term.id === editingTermId
      );
      setInitialValues(term ? { ...term } : { ...defaultTermSaveModel });
      setConjugations(term?.conjugations || []);
    } else {
      setInitialValues({ ...defaultTermSaveModel });
      setConjugations([]);
    }
  }, [open]);

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

  const onSubmit = (values: TermSaveModel) => {
    onSave(values);
  };

  const activeTermListId = localStorageHelperInstance.getActiveTermListId();
  const activeTermListName = activeTermListId
    ? localStorageHelperInstance.getTermListById(activeTermListId)?.name
    : "";

  const required = (value: any) => (value ? undefined : "Required");
  const showError = (meta: any) =>
    meta.submitFailed &&
    !meta.modifiedSinceLastSubmit &&
    (meta.error || meta.submitError);

  return (
    <Form
      key={initialValues.swedish}
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, errors, values, pristine }) => (
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
                {editingTermId
                  ? "Edit term"
                  : `Add new term to list '${activeTermListName}'`}
              </Typography>
              <Button
                type="submit"
                autoFocus
                color="inherit"
                onClick={handleSubmit}
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

              <Field<string>
                name="swedish"
                validate={required}
                render={({ input, meta }) => (
                  <TextField
                    required
                    label="Swedish"
                    fullWidth
                    value={input.value}
                    onChange={input.onChange}
                    autoFocus
                    data-testid="term-swedish"
                    placeholder="Swedish"
                    error={showError(meta)}
                  />
                )}
              />

              <Field<string>
                name="definition"
                validate={required}
                render={({ input, meta }) => (
                  <TextField
                    required
                    label="Definition"
                    fullWidth
                    value={input.value}
                    onChange={input.onChange}
                    error={showError(meta)}
                  />
                )}
              />

              <FormControl
                sx={{ mt: 1, display: ["inline-flex", "none"] }}
                required
                fullWidth
              >
                <InputLabel
                  variant="standard"
                  htmlFor="word-class-select-native"
                >
                  Word class
                </InputLabel>

                <Field<WordClassType>
                  name="type"
                  validate={required}
                  render={({ input, meta }) => (
                    <NativeSelect
                      inputProps={{
                        name: "word-class",
                        id: "word-class-select-native",
                      }}
                      defaultValue={""}
                      onChange={input.onChange}
                      error={showError(meta)}
                    >
                      <option
                        value={""}
                        disabled
                        style={{ fontStyle: "italic" }}
                      >
                        Select a word class
                      </option>
                      {WordClasses.map((wordClass) => (
                        <option key={wordClass} value={wordClass}>
                          {wordClass}
                        </option>
                      ))}
                    </NativeSelect>
                  )}
                />
              </FormControl>
              <FormControl
                sx={{ mt: 1, display: ["none", "inline-flex"] }}
                required
                fullWidth
              >
                <InputLabel id="word-class-select-label">Word class</InputLabel>

                <Field<WordClassType>
                  name="type"
                  validate={required}
                  render={({ input, meta }) => (
                    <Select
                      data-testid="term-word-class"
                      label="Word class"
                      labelId="word-class-select-label"
                      value={input.value}
                      onChange={input.onChange}
                      error={showError(meta)}
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
                  )}
                />
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
                  <Field
                    name={`conjugation-${index}-form`}
                    validate={required}
                    render={({ input, meta }) => (
                      <TextField
                        required
                        label="Form"
                        fullWidth
                        value={conjugation.form}
                        onChange={(evt) =>
                          setConjugation(index, "form", evt.target.value)
                        }
                        error={showError(meta)}
                      />
                    )}
                  />
                  <Field
                    name={`conjugation-${index}-term`}
                    validate={required}
                    render={({ input, meta }) => (
                      <TextField
                        required
                        label="Term"
                        fullWidth
                        value={conjugation.term}
                        onChange={(evt) =>
                          setConjugation(index, "term", evt.target.value)
                        }
                        error={showError(meta)}
                      />
                    )}
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

              <Field<string>
                name="notes"
                render={({ input, meta }) => (
                  <TextField
                    label="Notes"
                    multiline
                    rows={4}
                    fullWidth
                    value={input.value}
                    onChange={input.onChange}
                  />
                )}
              />
            </Box>
          </Box>
        </Dialog>
      )}
    />
  );
};

export default AddEditTermDialog;
