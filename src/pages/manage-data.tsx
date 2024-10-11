import ResponsiveAppBar from "@/app/ResponsiveAppBar";
import ConfirmDeleteLocalDataDialog from "@/components/ConfirmDeleteLocalDataDialog";
import ImportDataDialog from "@/components/ImportDataDialog";
import * as importExportDataHelper from "@/helpers/importExportDataHelper";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const ManageDataPage: React.FC = () => {
  const [
    confirmDeleteLocalDataDialogOpen,
    setConfirmDeleteLocalDataDialogOpen,
  ] = useState(false);
  const [importDataDialogOpen, setImportDataDialogOpen] = useState(false);

  return (
    <>
      <ResponsiveAppBar />
      <Box
        sx={{
          width: { xs: "100%", md: "900px" },
          m: { xs: "16px", md: "16px auto" },
          "& *": { marginBottom: 3 },
        }}
      >
        <Typography variant="h3" fontWeight={400} textAlign={"center"}>
          Manage data
        </Typography>

        <Typography variant="h4" fontWeight={500}>
          Export data
        </Typography>

        <Box sx={{ "& > *": { display: "block" } }}>
          <Button
            variant="outlined"
            onClick={importExportDataHelper.exportJson}
          >
            Export as JSON (term lists + quizzes)
          </Button>
          <Button
            variant="outlined"
            onClick={importExportDataHelper.exportXlsx}
          >
            Export as XLSX (term lists only)
          </Button>
          <Button variant="outlined" onClick={importExportDataHelper.exportPdf}>
            Export as PDF (term lists only)
          </Button>
          <Button variant="outlined" onClick={importExportDataHelper.exportCsv}>
            Export as CSV (term lists only)
          </Button>
        </Box>

        <Typography variant="h4" fontWeight={500}>
          Import data
        </Typography>

        <Box>
          <Button
            variant="outlined"
            onClick={() => setImportDataDialogOpen(true)}
          >
            Import from JSON (term lists + quizzes)
          </Button>
        </Box>

        <Typography variant="h4" fontWeight={500} marginTop={10}>
          Danger zone
        </Typography>

        <Box>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setConfirmDeleteLocalDataDialogOpen(true)}
          >
            Delete local data
          </Button>
        </Box>
      </Box>

      <ConfirmDeleteLocalDataDialog
        open={confirmDeleteLocalDataDialogOpen}
        onClose={() => setConfirmDeleteLocalDataDialogOpen(false)}
      />

      <ImportDataDialog
        open={importDataDialogOpen}
        onClose={() => setImportDataDialogOpen(false)}
      />
    </>
  );
};

export default ManageDataPage;
