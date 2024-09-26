import { UUID } from "crypto";
import { TermListsWithCards } from "./types";

export const getQuizTermCount = (termListsWithCards: TermListsWithCards) =>
  (Object.keys(termListsWithCards) as UUID[]).reduce(
    (acc, termListId) => acc + termListsWithCards[termListId].length,
    0
  );

export const getQuizCardCount = (termListsWithCards: TermListsWithCards) =>
  (Object.keys(termListsWithCards) as UUID[]).reduce(
    (acc, termListId) =>
      acc +
      termListsWithCards[termListId].reduce(
        (subAcc, termWithCards) => subAcc + termWithCards.cards.length,
        0
      ),
    0
  );
