import QuizListRow from "@/components/QuizListRow";
import { QuizList as QuizListType } from "@/helpers/types";
import utilClassInstances from "@/helpers/utilClassInstances";
import WithLoading from "@/helpers/WithLoading";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddToListIcon from "@mui/icons-material/PlaylistAdd";

const { localStorageHelperInstance } = utilClassInstances;

const QuizBuilderPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cachedQuizLists, setCachedQuizLists] = useState<QuizListType[]>([]);

  useEffect(() => {
    setCachedQuizLists(localStorageHelperInstance.getCachedQuizLists());
    setIsLoading(false);
  }, []);

  const onCreateQuizListClick = () => {};

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "900px" },
        m: { xs: "16px", md: "16px auto" },
      }}
    >
      <WithLoading isLoading={isLoading}>
        <TableContainer sx={{ mb: 3 }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "" }}>
                <TableCell
                  align="center"
                  colSpan={5}
                  sx={(theme) => ({
                    fontWeight: 600,
                    backgroundColor: theme.palette.common.black,
                  })}
                >
                  <Box display={"flex"} justifyContent={"space-between"}>
                    <Box textAlign={"center"} width={"100%"}>
                      <Typography variant="h4">My quiz lists</Typography>
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
              {cachedQuizLists.length > 0 && (
                <TableRow>
                  <TableCell>{/* expand button */}</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Terms</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Last update</TableCell>
                  <TableCell>{/* play, edit, delete button */}</TableCell>
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              {cachedQuizLists.map((quizList) => (
                <QuizListRow
                  key={`quiz-list-row-${quizList.id}`}
                  quizList={quizList}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {cachedQuizLists.length === 0 && (
          <Typography>You haven&apos;t created any lists yet.</Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddToListIcon />}
          onClick={onCreateQuizListClick}
        >
          Create quiz (coming soon :))
        </Button>
      </WithLoading>
    </Box>
  );
};

export default QuizBuilderPage;
