import ConfirmDeleteLocalDataDialog from "@/components/ConfirmDeleteLocalDataDialog";
import * as importExportDataHelper from "@/helpers/importExportDataHelper";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const ManageDataPage: React.FC = () => {
  const [
    confirmDeleteLocalDataDialogOpen,
    setConfirmDeleteLocalDataDialogOpen,
  ] = useState(false);

  return (
    <>
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

        <Box sx={{ "& > *": { marginRight: 3 } }}>
          <Button
            variant="outlined"
            onClick={importExportDataHelper.exportJson}
          >
            Export JSON
          </Button>
          <Button variant="outlined" onClick={importExportDataHelper.exportCsv}>
            Export CSV
          </Button>
          <Button
            variant="outlined"
            onClick={importExportDataHelper.exportXlsx}
          >
            Export XLSX
          </Button>
        </Box>

        <Typography variant="h4" fontWeight={500}>
          Import data
        </Typography>

        <Box>
          <Button disabled variant="outlined">
            Import JSON
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
    </>
  );
};

export default ManageDataPage;
