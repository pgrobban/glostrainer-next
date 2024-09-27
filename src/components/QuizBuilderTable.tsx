import { StyledTableHeadRow } from "@/helpers/styleUtils";
import {
  QuizCard,
  Term,
  TermListObject,
  TermListsWithCards,
} from "@/helpers/types";
import {
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Typography,
} from "@mui/material";
import { UUID } from "crypto";
import React, { useEffect } from "react";
import QuizBuilderTableRow from "./QuizBuilderTableRow";

interface Props {
  termLists: TermListObject;
  onRemoveTerm: (termListId: UUID, term: Term) => void;
  value: TermListsWithCards;
  onChange: (newTermListsWithCards: TermListsWithCards) => void;
}

const QuizBuilderTable: React.FC<Props> = ({
  termLists,
  onRemoveTerm,
  value,
  onChange,
}) => {
  const hasQuizCard = (termListId: UUID, term: Term, card: QuizCard) =>
    value[termListId]
      ?.find((termWithCards) => termWithCards.term === term)
      ?.cards.includes(card) ?? false;

  const isSweEngChecked = (Object.keys(value) as UUID[]).every((termListId) =>
    value[termListId].every((termWithCards) =>
      termWithCards.cards.includes("swedish_to_definition")
    )
  );
  const isEngSweChecked = (Object.keys(value) as UUID[]).every((termListId) =>
    value[termListId].every((termWithCards) =>
      termWithCards.cards.includes("definition_to_swedish")
    )
  );

  useEffect(() => {
    const newTermListsWithCards: TermListsWithCards = {
      ...value,
    };
    (Object.keys(termLists) as UUID[]).forEach((termListId) => {
      if (!newTermListsWithCards[termListId]) {
        newTermListsWithCards[termListId] = [];
      }
      termLists[termListId].forEach((term) => {
        // add case
        const termAddedToQuizList = newTermListsWithCards[termListId].some(
          (termWithCards) => termWithCards.term === term
        );
        if (!termAddedToQuizList) {
          newTermListsWithCards[termListId].push({
            term,
            cards: [
              isSweEngChecked && "swedish_to_definition",
              isEngSweChecked && "definition_to_swedish",
            ].filter(Boolean) as QuizCard[],
          });
        }
      });
      newTermListsWithCards[termListId].forEach((termWithCards) => {
        // remove case
        const termRemovedFromQuizList = !termLists[termListId].some(
          (termFromTermList) => termWithCards.term === termFromTermList
        );
        if (termRemovedFromQuizList) {
          newTermListsWithCards[termListId] = newTermListsWithCards[
            termListId
          ].filter((t) => t !== termWithCards);
        }
      });
    });

    onChange(newTermListsWithCards);
  }, [termLists, isSweEngChecked, isEngSweChecked, onChange, value]);

  const toggleQuizCardChecked = (
    cardToToggle: QuizCard,
    checked: boolean,
    termToToggle?: Term
  ) => {
    const newTermListsWithCards: TermListsWithCards = {
      ...value,
    };
    (Object.keys(newTermListsWithCards) as UUID[]).forEach((termListId) => {
      newTermListsWithCards[termListId].forEach((termWithCards) => {
        if (termToToggle && termToToggle !== termWithCards.term) {
          return;
        }

        if (checked) {
          termWithCards.cards.push(cardToToggle);
        } else {
          termWithCards.cards = termWithCards.cards.filter(
            (card) => card !== cardToToggle
          );
        }
      });
    });
    onChange(newTermListsWithCards);
  };

  const handleMultiTermQuizCardCheck = (
    cardToToggle: QuizCard,
    checked: boolean
  ) => {
    const newTermListsWithCards = { ...value };
    (Object.keys(newTermListsWithCards) as UUID[]).forEach((termListId) => {
      newTermListsWithCards[termListId].forEach((termWithCards) => {
        if (checked) {
          termWithCards.cards.push(cardToToggle);
        } else {
          termWithCards.cards = termWithCards.cards.filter(
            (card) => card !== cardToToggle
          );
        }
      });
    });
    onChange(newTermListsWithCards);
  };

  return (
    <Table id="quiz-builder-table" size="small" stickyHeader>
      <TableHead>
        <StyledTableHeadRow>
          <TableCell padding="none" width={"30%"} sx={{ border: 0 }}>
            &nbsp;
          </TableCell>
          <TableCell sx={{ border: 0 }} />
          <TableCell
            padding="none"
            colSpan={3}
            align="center"
            sx={{
              borderLeft: "1px solid gray",
              borderBottom: 0,
            }}
          >
            Cards
          </TableCell>
          <TableCell padding="none" sx={{ border: 0 }}>
            &nbsp;
          </TableCell>
        </StyledTableHeadRow>
        <StyledTableHeadRow>
          <TableCell sx={{ fontSize: 12 }} width={"30%"}>
            Term
          </TableCell>
          <TableCell align="center" width={50}></TableCell>
          <TableCell
            align="center"
            width={150}
            padding="none"
            sx={{ borderLeft: "1px solid gray" }}
          >
            <FormControlLabel
              control={<Checkbox checked={isSweEngChecked} />}
              label={<Typography fontSize={12}>SWE-ENG</Typography>}
              labelPlacement="start"
              onChange={(_, checked) =>
                handleMultiTermQuizCardCheck("swedish_to_definition", checked)
              }
            />
          </TableCell>
          <TableCell align="center" width={150} padding="none">
            <FormControlLabel
              control={<Checkbox checked={isEngSweChecked} />}
              label={<Typography fontSize={12}>ENG-SWE</Typography>}
              labelPlacement="start"
              onChange={(_, checked) =>
                handleMultiTermQuizCardCheck("definition_to_swedish", checked)
              }
            />
          </TableCell>
          <TableCell
            sx={{ fontSize: 12, borderRight: "1px solid gray" }}
            width={150}
            align="center"
          >
            Custom
          </TableCell>
        </StyledTableHeadRow>
      </TableHead>
      <TableBody>
        {(Object.keys(termLists) as UUID[]).map((termListId) => (
          <React.Fragment key={`quiz-builder-term-list-${termListId}`}>
            {termLists[termListId].map((term) => (
              <QuizBuilderTableRow
                key={`quiz-builder-term-${term.swedish}-${term.definition}`}
                termListId={termListId}
                term={term}
                onRemoveTerm={onRemoveTerm}
                hasQuizCard={hasQuizCard}
                toggleQuizCardChecked={toggleQuizCardChecked}
              />
            ))}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuizBuilderTable;
