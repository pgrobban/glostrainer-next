import { CommonDialogProps, ImportStrategy } from "@/helpers/types";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import {
  importData,
  tryGetTermListsFromFile,
} from "../helpers/importExportDataHelper";
import InvalidFileAlert from "./InvalidFileAlert";
import ImportSuccessDialog from "./ImportSuccessDialog";
import utilClassInstances from "../helpers/utilClassInstances";
const { localStorageHelperInstance } = utilClassInstances;

const ImportDataDialog = ({ open, onClose }: CommonDialogProps) => {
  const inputFile = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [importStrategy, setImportStrategy] = useState<ImportStrategy>(
    "merge_lists_without_overwrite"
  );
  const [invalidFileAlertOpen, setInvalidFileAlertOpen] = useState(false);
  const [importSuccessDialogOpen, setImportSuccessDialogOpen] = useState(false);

  const onChangeFileEvent = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    evt.stopPropagation();
    evt.preventDefault();
    if (!evt.target.files?.[0]) {
      return;
    }
    const file = evt.target.files[0];
    inputFile.current!.value = "";
    tryImportData(file);
  };

  const tryImportData = async (file: File) => {
    try {
      const parsedTermLists = await tryGetTermListsFromFile(file);
      importData(parsedTermLists, importStrategy);
      localStorageHelperInstance.overwriteTermLists(parsedTermLists);
      setImportSuccessDialogOpen(true);
    } catch {
      setInvalidFileAlertOpen(true);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Import data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormControl>
              <FormLabel id="import-data-radio-group" sx={{ marginBottom: 3 }}>
                Select how you want to import your data:
              </FormLabel>
              <RadioGroup
                aria-labelledby="import-data-radio-group"
                defaultValue="merge_without_overwrite"
                name="radio-buttons-group"
                value={importStrategy}
                onChange={(_, value) =>
                  setImportStrategy(value as ImportStrategy)
                }
              >
                <FormControlLabel
                  value="merge_lists_without_overwrite"
                  control={<Radio />}
                  label={
                    <Typography>
                      <Typography color="primary" fontWeight={500}>
                        Merge term lists, don&apos;t overwrite terms
                      </Typography>
                      <ul>
                        <li>New term lists will be imported.</li>
                        <li>
                          For existing term lists on this device:
                          <ul>
                            <li>New terms will be added to the list</li>
                            <li>
                              For existing terms (Swedish + definition are in
                              the list), no action will be done.
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="merge_lists_with_overwrite"
                  control={<Radio />}
                  label={
                    <Typography>
                      <Typography color="primary" fontWeight={500}>
                        Merge lists, overwrite terms
                      </Typography>
                      <ul>
                        <li>New term lists will be imported.</li>
                        <li>
                          For existing term lists on this device:
                          <ul>
                            <li>New terms will be added to the list</li>
                            <li>
                              Existing terms (Swedish + definition are in the
                              list) will be{" "}
                              <Typography fontWeight={500} component="span">
                                overwritten
                              </Typography>{" "}
                              by the imported terms.
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="only_add_new_lists"
                  control={<Radio />}
                  label={
                    <Typography>
                      <Typography color="primary" fontWeight={500}>
                        Only add new lists
                      </Typography>
                      <ul>
                        <li>New term lists will be imported.</li>
                        <li>
                          No action will be done for existing term lists on this
                          device.
                        </li>
                      </ul>
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="clear_and_import"
                  control={<Radio />}
                  label={
                    <Typography>
                      <Typography fontWeight={500} color="secondary">
                        Clear all lists and import
                      </Typography>
                      <ul>
                        <li>ALL lists on this device will be cleared.</li>
                        <li>ONLY data from the import will be used.</li>
                      </ul>
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {isLoading && (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          )}
          {!isLoading && (
            <>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                onClick={() => {
                  inputFile.current?.click();
                }}
                autoFocus
              >
                Select file
              </Button>
            </>
          )}
        </DialogActions>

        <input
          type="file"
          id="file"
          accept=".json"
          ref={inputFile}
          style={{ display: "none" }}
          onChange={onChangeFileEvent}
        />
      </Dialog>

      <InvalidFileAlert
        open={invalidFileAlertOpen}
        onClose={() => setInvalidFileAlertOpen(false)}
      />

      <ImportSuccessDialog
        open={importSuccessDialogOpen}
        onClose={() => {
          setImportSuccessDialogOpen(false);
          onClose();
        }}
      />
    </>
  );
};

export default ImportDataDialog;
