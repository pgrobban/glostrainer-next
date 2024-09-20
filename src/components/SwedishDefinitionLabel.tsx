import { Term } from "@/helpers/types";
import { Box, Typography } from "@mui/material";

interface Props {
  term: Term;
}

const SwedishDefinitionLabel: React.FC<Props> = ({ term }) => (
  <Box>
    <Typography component="span" sx={{ lineHeight: 1 }}>
      {term.swedish}
    </Typography>
    <br />
    <Typography component="span" sx={{ fontSize: "0.8em" }}>
      {term.definition}
    </Typography>
  </Box>
);

export default SwedishDefinitionLabel;
