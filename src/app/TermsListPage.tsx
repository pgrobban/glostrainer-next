import { Typography, Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const TermList: React.FC = () => {
  return (
    <Box
      sx={{
        width: { xs: "100%", md: "800px" },
        m: { xs: "16px", md: "0 auto" },
      }}
    >
      <Typography variant="h3">Term list</Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <p>Remember to save regularly!</p>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Add term
        </Button>
      </Box>
    </Box>
  );
};

export default TermList;
