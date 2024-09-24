import { DeleteIcon } from "@/helpers/icons";
import { StyledTableHeadRow, StyledTableRow } from "@/helpers/styleUtils";
import {
  QuizMode,
  Term,
  TermListObject,
  TermListsWithQuizModes,
} from "@/helpers/types";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Typography,
} from "@mui/material";
import { UUID } from "crypto";
import React, { useEffect } from "react";
import SwedishDefinitionLabel from "./SwedishDefinitionLabel";

interface Props {
  termLists: TermListObject;
  onRemoveTerm: (termListId: UUID, term: Term) => void;
  termListsWithQuizModes: TermListsWithQuizModes;
  onQuizModesChange: (
    newTermListsWithQuizModes: TermListsWithQuizModes
  ) => void;
}

const QuizBuilderTable: React.FC<Props> = ({
  termLists,
  onRemoveTerm,
  termListsWithQuizModes,
  onQuizModesChange,
}) => {
  const getHasQuizMode = (termListId: UUID, term: Term, quizMode: QuizMode) =>
    termListsWithQuizModes[termListId]
      ?.find((termListsWithQuizModes) => termListsWithQuizModes.term === term)
      ?.quizModes.includes(quizMode) ?? false;

  const isSweEngChecked = (Object.keys(termListsWithQuizModes) as UUID[]).every(
    (termListId) =>
      termListsWithQuizModes[termListId].every((termWithQUizModes) =>
        termWithQUizModes.quizModes.includes("swedish_to_definition")
      )
  );
  const isEngSweChecked = (Object.keys(termListsWithQuizModes) as UUID[]).every(
    (termListId) =>
      termListsWithQuizModes[termListId].every((termWithQUizModes) =>
        termWithQUizModes.quizModes.includes("definition_to_swedish")
      )
  );

  useEffect(() => {
    const newTermsWithQuizModes: TermListsWithQuizModes = {
      ...termListsWithQuizModes,
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
            quizModes: [
              isSweEngChecked && "swedish_to_definition",
              isEngSweChecked && "definition_to_swedish",
            ].filter(Boolean) as QuizMode[],
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

    onQuizModesChange(newTermsWithQuizModes);
  }, [termLists]);

  const toggleQuizModeChecked = (
    quizModeToToggle: QuizMode,
    checked: boolean,
    termToToggle?: Term
  ) => {
    const newTermsWithQuizModes: TermListsWithQuizModes = {
      ...termListsWithQuizModes,
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
    onQuizModesChange(newTermsWithQuizModes);
  };

  const handleMultiTermQuizModeCheck = (
    quizModeToToggle: QuizMode,
    checked: boolean
  ) => {
    const newTermsWithQuizModes = { ...termListsWithQuizModes };
    (Object.keys(newTermsWithQuizModes) as UUID[]).forEach((termListId) => {
      newTermsWithQuizModes[termListId].forEach((termWithQuizModes) => {
        if (checked) {
          termWithQuizModes.quizModes.push(quizModeToToggle);
        } else {
          termWithQuizModes.quizModes = termWithQuizModes.quizModes.filter(
            (quizMode) => quizMode !== quizModeToToggle
          );
        }
      });
    });
    onQuizModesChange(newTermsWithQuizModes);
  };

  return (
    <Table id="quiz-builder-table">
      <TableHead>
        <StyledTableHeadRow>
          <TableCell padding="none" width={"30%"}>
            &nbsp;
          </TableCell>
          <TableCell
            padding="none"
            colSpan={3}
            align="center"
            sx={{ borderLeft: "1px solid gray", borderRight: "1px solid gray" }}
          >
            Cards
          </TableCell>
          <TableCell padding="none">&nbsp;</TableCell>
        </StyledTableHeadRow>
        <StyledTableHeadRow>
          <TableCell sx={{ fontSize: 12 }} width={"30%"}>
            Term
          </TableCell>
          <TableCell align="center" width={150} padding="none">
            <FormControlLabel
              control={<Checkbox checked={isSweEngChecked} />}
              label={<Typography fontSize={12}>SWE-ENG</Typography>}
              labelPlacement="start"
              onChange={(_, checked) =>
                handleMultiTermQuizModeCheck("swedish_to_definition", checked)
              }
            />
          </TableCell>
          <TableCell align="center" width={150} padding="none">
            <FormControlLabel
              control={<Checkbox checked={isEngSweChecked} />}
              label={<Typography fontSize={12}>ENG-SWE</Typography>}
              labelPlacement="start"
              onChange={(_, checked) =>
                handleMultiTermQuizModeCheck("definition_to_swedish", checked)
              }
            />
          </TableCell>
          <TableCell sx={{ fontSize: 12 }} width={150} align="center">
            Custom
          </TableCell>
          <TableCell align="center" width={50}></TableCell>
        </StyledTableHeadRow>
      </TableHead>
      <TableBody>
        {(Object.keys(termLists) as UUID[]).map((termListId) => (
          <React.Fragment key={`quiz-builder-term-list-${termListId}`}>
            {termLists[termListId].map((term) => (
              <StyledTableRow
                key={`quiz-builder-term-${term.swedish}-${term.definition}`}
              >
                <TableCell padding="checkbox">
                  <SwedishDefinitionLabel term={term} />
                </TableCell>
                <TableCell align="center" padding="checkbox">
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
                <TableCell align="center" padding="checkbox">
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
                <TableCell align="center" padding="checkbox">
                  -
                </TableCell>
                <TableCell align="center" padding="checkbox">
                  <IconButton
                    color="secondary"
                    onClick={() => onRemoveTerm(termListId, term)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuizBuilderTable;
