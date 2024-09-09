import { Box, CircularProgress } from "@mui/material";
import React from "react";

interface WithLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const WithLoading: React.FC<WithLoadingProps> = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <Box textAlign={"center"}>
        <CircularProgress />
      </Box>
    );
  }
  return <>{children}</>;
};

export default WithLoading;
