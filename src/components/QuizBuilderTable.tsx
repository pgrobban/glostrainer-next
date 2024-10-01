import { QuizCard, Term, TermListObject } from "@/helpers/types";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  Typography,
} from "@mui/material";
import { UUID } from "crypto";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import QuizBuilderTableRow from "./QuizBuilderTableRow";

type CardsGroupedByTerm = Record<UUID, QuizCard[]>;

interface Props {
  onRemoveCard: (cardId: UUID) => void;
  cards: QuizCard[];
  onChange: (newQuizCards: QuizCard[]) => void;
}

const QuizBuilderTable: React.FC<Props> = ({
  cards,
  onRemoveCard,
  onChange,
}) => {
  const [cardsGroupedByTerm, setCardsGroupedByTerm] =
    useState<CardsGroupedByTerm>({});

  return (
    <Table>
      <TableBody>
        {cards.map((card) => (
          <QuizBuilderTableRow
            key={card.id}
            card={card}
            onRemove={() => onRemoveCard(card.id)}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default QuizBuilderTable;
