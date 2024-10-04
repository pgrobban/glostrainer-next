import {
  QuizCardContentTemplateData,
  ContentToGenerate,
  QuizCard,
  Term,
  QuizCardContent,
} from "./types";
import { Typography } from "@mui/material";
import utilClassInstances from "../helpers/utilClassInstances";
import { ReactNode } from "react";
const { localStorageHelperInstance } = utilClassInstances;

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
): QuizCardContentTemplateData => {
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

const emptyCard: QuizCardContent = {
  front: <Typography />,
  back: <Typography />,
};

export const generateQuizCardContent = (card: QuizCard): QuizCardContent => {
  if (!card.contentToGenerate) {
    return emptyCard;
  }

  const termList = localStorageHelperInstance.getTermListById(card.termListId);
  const term = termList?.terms.find((t) => t.id === card.termId);
  if (!term) {
    return emptyCard;
  }

  switch (card.contentToGenerate) {
    case "swedish_to_definition":
      return {
        front: (
          <Typography component="span">
            What is the definition of{" "}
            <Typography component="span" fontWeight={600}>
              {term.swedish}
            </Typography>
            ?
          </Typography>
        ),
        back: <Typography>{term.definition}</Typography>,
      };
    case "definition_to_swedish":
      return {
        front: (
          <Typography component="span">
            How do you say{" "}
            <Typography component="span" fontWeight={600}>
              {term.definition}
            </Typography>{" "}
            in Swedish?
          </Typography>
        ),
        back: <Typography>{term.swedish}</Typography>,
      };
    default:
      return emptyCard;
  }
};
