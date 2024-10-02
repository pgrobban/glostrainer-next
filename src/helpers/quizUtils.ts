import { CardContent, ContentToGenerate, QuizCard, Term } from "./types";

export const getReadableContentToGenerateLabel = (
  content: ContentToGenerate
) => {
  return content
    .replace("_to_", " → ")
    .replaceAll("_", " ")
    .replaceAll("swedish", "Swedish");
};

export const getGeneratedCardForTerm = (
  term: Term,
  contentToGenerate: ContentToGenerate
): CardContent => {
  switch (contentToGenerate) {
    case "swedish_to_definition":
      return {
        front: term.swedish,
        back: term.definition,
      };
    case "definition_to_swedish":
      return {
        front: term.definition,
        back: term.swedish,
      };
    default:
      return {
        front: "",
        back: "",
      };
  }
};

export const getCardCount = (cards: QuizCard[]) => cards.length;

export const getTermCount = (cards: QuizCard[]) =>
  // @ts-expect-error
  [...new Set(cards.map((card) => card.termId))].length;
