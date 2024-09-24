import QuizListRow from "@/components/QuizListRow";
import AddEditQuizDialog from "@/components/AddEditQuizDialog";
import type { Quiz, Term } from "@/helpers/types";
import utilClassInstances from "@/helpers/utilClassInstances";
import WithLoading from "@/helpers/WithLoading";
import {
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
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
import ResponsiveAppBar from "@/app/ResponsiveAppBar";
import { ClearIcon, SearchIcon } from "@/helpers/icons";
import { UUID } from "crypto";
import { StyledTableHeadRow } from "@/helpers/styleUtils";

const { localStorageHelperInstance } = utilClassInstances;

const QuizBuilderPage: React.FC = () => {
  const [addEditQuizListDialogOpen, setAddEditQuizListDialogOpen] =
    useState(false);
  const [editingQuizListId, setEditingQuizListId] = useState<UUID | null>(null);
  const [quizListToDeleteId, setQuizListToDeleteId] = useState<UUID | null>(
    null
  );
  const [quizListToDeleteName, setQuizListToDeleteName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [cachedQuizzes, setCachedQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    setCachedQuizzes(localStorageHelperInstance.getCachedQuizzes());
    setIsLoading(false);
  }, []);

  const onCreateQuizListClick = () => {
    setAddEditQuizListDialogOpen(true);
  };

  return (
    <>
      <ResponsiveAppBar />
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
                <StyledTableHeadRow>
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
                      <Input
                        sx={{ width: "250px" }}
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        startAdornment={
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        }
                        endAdornment={
                          searchTerm.length > 0 && (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setSearchTerm("")}>
                                <ClearIcon />
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      />
                    </Box>
                  </TableCell>
                </StyledTableHeadRow>
                {cachedQuizzes.length > 0 && (
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Terms</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Last update</TableCell>
                    <TableCell>{/* play, edit, delete button */}</TableCell>
                  </TableRow>
                )}
              </TableHead>
              <TableBody>
                {cachedQuizzes.map((quiz) => (
                  <QuizListRow
                    key={`quiz-list-row-${quiz.id}`}
                    quiz={quiz}
                    onOpenEditClick={() => {
                      setEditingQuizListId(quiz.id);
                      setAddEditQuizListDialogOpen(true);
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {cachedQuizzes.length === 0 && (
            <Typography>You haven&apos;t created any lists yet.</Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddToListIcon />}
            onClick={onCreateQuizListClick}
          >
            Create quiz
          </Button>
        </WithLoading>
      </Box>

      <AddEditQuizDialog
        open={addEditQuizListDialogOpen}
        editingQuizId={editingQuizListId}
        onSave={() => {
          localStorageHelperInstance.saveData();
          setEditingQuizListId(null);
          setAddEditQuizListDialogOpen(false);
        }}
        onClose={() => {
          setEditingQuizListId(null);
          setAddEditQuizListDialogOpen(false);
        }}
      />
    </>
  );
};

export default QuizBuilderPage;
