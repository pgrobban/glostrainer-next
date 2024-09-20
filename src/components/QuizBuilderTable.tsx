import { TermListObject } from "./AddEditQuizDialog";
import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { UUID } from "crypto";
import SwedishDefinitionLabel from "./SwedishDefinitionLabel";
import { QuizMode, Term, TermWithQuizMode } from "@/helpers/types";
import { DeleteIcon } from "@/helpers/icons";
import { useEffect, useState } from "react";

type TermListsWithQuizModes = {
  [termListId: UUID]: TermWithQuizMode[];
};

interface Props {
  termLists: TermListObject;
  onRemoveTerm: (termListId: UUID, term: Term) => void;
}

const QuizBuilderTable: React.FC<Props> = ({ termLists, onRemoveTerm }) => {
  const [termsWithQuizModes, setTermsWithQuizModes] =
    useState<TermListsWithQuizModes>({});

  const getHasQuizMode = (termListId: UUID, term: Term, quizMode: QuizMode) =>
    termsWithQuizModes[termListId]
      ?.find((termWithQuizMode) => termWithQuizMode.term === term)
      ?.quizModes.includes(quizMode);

  useEffect(() => {
    const newTermsWithQuizModes: TermListsWithQuizModes = {
      ...termsWithQuizModes,
    };
    (Object.keys(termsWithQuizModes) as UUID[]).forEach((termListId) => {
      if (!newTermsWithQuizModes[termListId]) {
        newTermsWithQuizModes[termListId] = termLists[termListId].map(
          (term) => ({ term, quizModes: [] })
        );
      }
    });

    setTermsWithQuizModes(newTermsWithQuizModes);
  }, [termLists]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell width={300}>Term</TableCell>
          <TableCell align="center">
            <Box>
              <Typography component={"span"}>
                SWE-
                <br />
                ENG
              </Typography>
            </Box>
          </TableCell>
          <TableCell align="center">
            <Box>
              <Typography component={"span"}>
                ENG-
                <br />
                SWE
              </Typography>
            </Box>
          </TableCell>
          <TableCell align="center">Custom</TableCell>
          <TableCell align="center">Remove</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(Object.keys(termLists) as UUID[]).map((termListId) => (
          <>
            {termLists[termListId].map((term) => (
              <TableRow
                key={`quiz-builder-term-${term.swedish}-${term.definition}`}
              >
                <TableCell>
                  <SwedishDefinitionLabel term={term} />
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={getHasQuizMode(
                      termListId,
                      term,
                      "swedish_to_definition"
                    )}
                    onChange={(_, checked) => {}}
                  />
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={getHasQuizMode(
                      termListId,
                      term,
                      "definition_to_swedish"
                    )}
                    onChange={(_, checked) => {}}
                  />
                </TableCell>
                <TableCell align="center">-</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="secondary"
                    onClick={() => onRemoveTerm(termListId, term)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuizBuilderTable;
