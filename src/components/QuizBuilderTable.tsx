import { DeleteIcon } from "@/helpers/icons";
import { QuizMode, Term, TermWithQuizMode } from "@/helpers/types";
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { UUID } from "crypto";
import React, { useEffect, useState } from "react";
import { TermListObject } from "./AddEditQuizDialog";
import SwedishDefinitionLabel from "./SwedishDefinitionLabel";

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
      ?.quizModes.includes(quizMode) ?? false;

  useEffect(() => {
    const newTermsWithQuizModes: TermListsWithQuizModes = {
      ...termsWithQuizModes,
    };
    (Object.keys(termLists) as UUID[]).forEach((termListId) => {
      if (!newTermsWithQuizModes[termListId]) {
        newTermsWithQuizModes[termListId] = [];
      }
      termLists[termListId].forEach((term) => {
        // add case
        const termAddedToQuizList = newTermsWithQuizModes[termListId].some(
          (termWithQuizModes) => termWithQuizModes.term === term
        );
        if (!termAddedToQuizList) {
          newTermsWithQuizModes[termListId].push({
            term,
            quizModes: ["definition_to_swedish", "swedish_to_definition"],
          });
        }
      });
      newTermsWithQuizModes[termListId].forEach((termWithQUizMode) => {
        // remove case
        const termRemovedFromQuizList = !termLists[termListId].some(
          (termFromTermList) => termWithQUizMode.term === termFromTermList
        );
        if (termRemovedFromQuizList) {
          newTermsWithQuizModes[termListId] = newTermsWithQuizModes[
            termListId
          ].filter((t) => t !== termWithQUizMode);
        }
      });
    });

    setTermsWithQuizModes(newTermsWithQuizModes);
  }, [termLists]);

  const isSweEngChecked = (Object.keys(termsWithQuizModes) as UUID[]).every(
    (termListId) =>
      termsWithQuizModes[termListId].every((termWithQUizMode) =>
        termWithQUizMode.quizModes.includes("swedish_to_definition")
      )
  );
  const isEngSweChecked = (Object.keys(termsWithQuizModes) as UUID[]).every(
    (termListId) =>
      termsWithQuizModes[termListId].every((termWithQUizMode) =>
        termWithQUizMode.quizModes.includes("definition_to_swedish")
      )
  );
  const toggleQuizModeChecked = (
    quizModeToToggle: QuizMode,
    checked: boolean,
    termToToggle?: Term
  ) => {
    const newTermsWithQuizModes: TermListsWithQuizModes = {
      ...termsWithQuizModes,
    };
    (Object.keys(newTermsWithQuizModes) as UUID[]).forEach((termListId) => {
      newTermsWithQuizModes[termListId].forEach((termWithQuizModes) => {
        if (termToToggle && termToToggle !== termWithQuizModes.term) {
          return;
        }

        if (checked) {
          termWithQuizModes.quizModes.push(quizModeToToggle);
        } else {
          termWithQuizModes.quizModes = termWithQuizModes.quizModes.filter(
            (quizMode) => quizMode !== quizModeToToggle
          );
        }
      });
    });
    setTermsWithQuizModes(newTermsWithQuizModes);
  };

  return (
    <Table id="quiz-builder-table">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontSize: 12 }} width={"30%"}>
            Term
          </TableCell>
          <TableCell align="center" width={150} padding="none">
            <FormControlLabel
              control={<Checkbox checked={isSweEngChecked} />}
              label={<Typography fontSize={12}>SWE-ENG</Typography>}
              labelPlacement="start"
              onChange={(_, checked) =>
                toggleQuizModeChecked("swedish_to_definition", checked)
              }
            />
          </TableCell>
          <TableCell align="center" width={150} padding="none">
            <FormControlLabel
              control={<Checkbox checked={isEngSweChecked} />}
              label={<Typography fontSize={12}>ENG-SWE</Typography>}
              labelPlacement="start"
              onChange={(_, checked) =>
                toggleQuizModeChecked("definition_to_swedish", checked)
              }
            />
          </TableCell>
          <TableCell sx={{ fontSize: 12 }} width={150} align="center">
            Custom fields
          </TableCell>
          <TableCell align="center" width={50}></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(Object.keys(termLists) as UUID[]).map((termListId) => (
          <React.Fragment key={`quiz-builder-term-list-${termListId}`}>
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
                    onChange={(_, checked) =>
                      toggleQuizModeChecked(
                        "swedish_to_definition",
                        checked,
                        term
                      )
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={getHasQuizMode(
                      termListId,
                      term,
                      "definition_to_swedish"
                    )}
                    onChange={(_, checked) =>
                      toggleQuizModeChecked(
                        "definition_to_swedish",
                        checked,
                        term
                      )
                    }
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
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuizBuilderTable;
