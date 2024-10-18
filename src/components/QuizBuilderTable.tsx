import { QuizCard } from "@/helpers/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { UUID } from "crypto";
import React, { useEffect } from "react";
import QuizBuilderTableRow from "./QuizBuilderTableRow";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import utilClassInstances from "../helpers/utilClassInstances";
import { getGeneratedCardForTerm } from "@/helpers/quizUtils";
const { localStorageHelperInstance } = utilClassInstances;

interface Props {
  onRemoveCard: (cardId: UUID) => void;
  cards: QuizCard[];
  moveCard: (cardId: UUID, newIndex: number) => void;
}

const QuizBuilderTable: React.FC<Props> = ({
  cards,
  onRemoveCard,
  moveCard,
}) => {
  const handleDragEnd: OnDragEndResponder = (e) => {
    if (!e.destination) return;

    const cardId = e.draggableId as UUID;
    moveCard(cardId, e.destination.index);
  };

  useEffect(() => {
    // remove cards whose contents cannot be generated
    for (let card of cards) {
      const termList = localStorageHelperInstance.getTermListById(
        card.termListId
      );
      const term = termList?.terms.find((term) => term.id === card.termId);
      if (!term || !card.contentToGenerate) {
        continue;
      }
      const generatedContent = getGeneratedCardForTerm(
        term,
        card.contentToGenerate
      );
      if (!generatedContent.back || !generatedContent.front) {
        onRemoveCard(card.id);
      }
    }
  }, [cards]);

  return (
    <Table stickyHeader size="small">
      <TableHead>
        <TableRow>
          <TableCell>{/* drag to reorder */}</TableCell>
          <TableCell>Front</TableCell>
          <TableCell>Back</TableCell>
          <TableCell width={60}></TableCell>
        </TableRow>
      </TableHead>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable-quiz-table">
          {(droppableProvided) => (
            <TableBody
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(draggableProvided) => (
                    <QuizBuilderTableRow
                      key={card.id}
                      card={card}
                      onRemove={() => onRemoveCard(card.id)}
                      draggableProvided={draggableProvided}
                    />
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </DragDropContext>
    </Table>
  );
};

export default QuizBuilderTable;
