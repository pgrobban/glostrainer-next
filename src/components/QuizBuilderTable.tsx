import { QuizCard } from "@/helpers/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { UUID } from "crypto";
import React from "react";
import QuizBuilderTableRow from "./QuizBuilderTableRow";

interface Props {
  onRemoveCard: (cardId: UUID) => void;
  cards: QuizCard[];
}

const QuizBuilderTable: React.FC<Props> = ({ cards, onRemoveCard }) => {
  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>Front</TableCell>
          <TableCell>Back</TableCell>
          <TableCell width={60}></TableCell>
        </TableRow>
      </TableHead>
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
