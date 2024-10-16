import { AddIcon, CloseIcon } from "@/helpers/icons";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  Divider,
  Grid2 as Grid,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { UUID } from "crypto";
import arrayMutators from "final-form-arrays";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import utilClassInstances from "../../src/helpers/utilClassInstances";
import {
  CommonDialogProps,
  NounType,
  Term,
  WordClasses,
  WordClassType,
} from "../helpers/types";
import ResponsiveSelect from "./ResponsiveSelect";
import ConjugationsFields from "./ConjugationsFields";
import ConfirmChangeWordClassDialog from "./ConfirmChangeWordClassDialog";

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
  const [confirmWordClassChangeDialog, setConfirmWordClassChangeDialogOpen] =
    useState(false);
  const [wordClassToChange, setWordClassToChange] =
    useState<WordClassType | null>(null);

  useEffect(() => {
    if (!open) {
      setInitialValues({ ...defaultTermSaveModel });
      return;
    }

    if (editingTermId) {
      const activeTermList = localStorageHelperInstance.getActiveTermList();
      const term = activeTermList?.terms.find(
        (term) => term.id === editingTermId
      );
      setInitialValues(term ? { ...term } : { ...defaultTermSaveModel });
    } else {
      setInitialValues({ ...defaultTermSaveModel });
    }
  }, [open, editingTermId]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const onSubmit = (values: TermSaveModel) => {
    if (values.type !== "Noun") {
      delete values.nounType;
    }

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
    <Form<TermSaveModel>
      destroyOnUnregister
      initialValues={initialValues}
      mutators={{
        ...arrayMutators,
        changeWordClassType: (args, state, utils) => {
          utils.changeValue(state, "type", () => wordClassToChange);
          utils.changeValue(state, "conjugations", () => []);
        },
      }}
      onSubmit={onSubmit}
      render={({
        handleSubmit,
        form: {
          mutators: { push, changeWordClassType },
        },
        values,
      }) => (
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
            <Box sx={{ m: [3, 2], "& .MuiTextField-root": { mt: 1, mb: 1 } }}>
              <Typography sx={{ mb: 1 }} variant="h6">
                Base info
              </Typography>

              <Field<string>
                name="swedish"
                validate={required}
                render={({ input, meta }) => (
                  <TextField
                    required
                    label="Swedish (dictionary form)"
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

              <Grid mt={1} container spacing={2} direction={["column", "row"]}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <ResponsiveSelect<WordClassType>
                      fieldName="type"
                      inputLabel="Word class"
                      label="Select a word class"
                      inputLabelId="word-class-select"
                      options={Array.from(WordClasses)}
                      onChange={(newValue) => {
                        // @ts-expect-error
                        setWordClassToChange(newValue);
                        setConfirmWordClassChangeDialogOpen(true);
                      }}
                      data-testid="term-word-class"
                      required
                    />
                  </Box>
                </Grid>

                {values.type === "Noun" && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <ResponsiveSelect<NounType>
                        fieldName="nounType"
                        inputLabel="Noun type"
                        label="Select a noun type"
                        inputLabelId="word-class-select"
                        options={NounType}
                        data-testid="term-word-class"
                        required
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ m: 2 }} />
              <Box>
                <Typography variant="h6">Conjugations</Typography>
                {values.type === "Adjective" && (
                  <Typography fontSize={12}>
                    Note: For adjectives, the dictionary form is the same as the{" "}
                    <i>en</i>- form, so you don&apos;t need to add it here.
                  </Typography>
                )}
              </Box>

              <Box mt={1}>
                <ConjugationsFields wordClass={values.type} />
              </Box>

              <Box mt={1}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => push("conjugations", { term: "", form: "" })}
                >
                  Add conjugation
                </Button>
              </Box>

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

          <ConfirmChangeWordClassDialog
            open={confirmWordClassChangeDialog}
            onClose={() => setConfirmWordClassChangeDialogOpen(false)}
            onConfirm={() => {
              changeWordClassType();
              setConfirmWordClassChangeDialogOpen(false);
            }}
          />
        </Dialog>
      )}
    />
  );
};

export default AddEditTermDialog;
