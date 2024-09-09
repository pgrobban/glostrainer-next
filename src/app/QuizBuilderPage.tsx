import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import WithLoading from "@/helpers/WithLoading";

const QuizBuilderPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "900px" },
        m: { xs: "16px", md: "16px auto" },
      }}
    >
      <WithLoading isLoading={isLoading}>hello</WithLoading>
    </Box>
  );
};

export default QuizBuilderPage;
