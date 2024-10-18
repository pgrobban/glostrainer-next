import { Typography } from "@mui/material";
import utilClassInstances from "../helpers/utilClassInstances";
import {
  ContentToGenerate,
  QuizCard,
  QuizCardContent,
  QuizCardContentTemplateData,
  Term,
} from "./types";
import { getConjugationByForm } from "./termUtils";
const { localStorageHelperInstance } = utilClassInstances;

export const getReadableContentToGenerateLabel = (
  content: ContentToGenerate
) => {
  return content
    .replace("_to_", " → ")
    .replaceAll("_", " ")
    .replaceAll(" form", "-form")
    .replaceAll("swedish", "Swedish")
    .replaceAll("den det de", "den/det/de");
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
    case "singular_indefinite_to_singular_definite":
      return {
        front: term.swedish,
        back: getConjugationByForm(term, "definiteSingular"),
      };
    case "singular_indefinite_to_plural_indefinite":
      return {
        front: term.swedish,
        back: getConjugationByForm(term, "indefinitePlural"),
      };
    case "singular_indefinite_to_plural_definite":
      return {
        front: term.swedish,
        back: getConjugationByForm(term, "definitePlural"),
      };
    case "dictionary_form_to_imperative":
      return {
        front: term.swedish,
        back: getConjugationByForm(term, "imperative"),
      };
    case "dictionary_form_to_past_tense":
      return {
        front: term.swedish,
        back: getConjugationByForm(term, "pastTense"),
      };
    case "en_form_to_den_det_de_form":
      return {
        front: term.swedish,
        back: getConjugationByForm(term, "denDetDe"),
      };
    case "en_form_to_ett_form":
      return {
        front: term.swedish,
        back: getConjugationByForm(term, "ett"),
      };
    case "present_tense_to_dictionary_form":
      return {
        front: getConjugationByForm(term, "presentTense"),
        back: term.swedish,
      };
    case "dictionary_form_to_present_tense":
      return {
        front: term.swedish,
        back: getConjugationByForm(term, "presentTense"),
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
    case "dictionary_form_to_imperative":
      return {
        front: (
          <Typography component="span">
            What is the <i>imperative</i> form of{" "}
            <Typography component="span" fontWeight={600}>
              {term.swedish}
            </Typography>
            ?
          </Typography>
        ),
        back: (
          <Typography>{getConjugationByForm(term, "imperative")}</Typography>
        ),
      };
    case "dictionary_form_to_past_tense":
      return {
        front: (
          <Typography component="span">
            What is the <i>past tense</i> of{" "}
            <Typography component="span" fontWeight={600}>
              {term.swedish}
            </Typography>
            ?
          </Typography>
        ),
        back: (
          <Typography>{getConjugationByForm(term, "pastTense")}</Typography>
        ),
      };
    case "dictionary_form_to_present_tense":
      return {
        front: (
          <Typography component="span">
            What is the <i>present tense</i> of{" "}
            <Typography component="span" fontWeight={600}>
              {term.swedish}
            </Typography>
            ?
          </Typography>
        ),
        back: (
          <Typography>{getConjugationByForm(term, "presentTense")}</Typography>
        ),
      };
    case "dictionary_form_to_supine":
      return {
        front: (
          <Typography component="span">
            What is the <i>supine</i> of{" "}
            <Typography component="span" fontWeight={600}>
              {term.swedish}
            </Typography>
            ?
          </Typography>
        ),
        back: <Typography>{getConjugationByForm(term, "supine")}</Typography>,
      };
    case "en_form_to_den_det_de_form":
      return {
        front: (
          <Typography component="span">
            What is the <i>den/det/de</i> form of{" "}
            <Typography component="span" fontWeight={600}>
              {term.swedish}
            </Typography>
            ?
          </Typography>
        ),
        back: <Typography>{getConjugationByForm(term, "denDetDe")}</Typography>,
      };
    case "en_form_to_ett_form":
      return {
        front: (
          <Typography component="span">
            What is the <i>ett</i> form of{" "}
            <Typography component="span" fontWeight={600}>
              {term.swedish}
            </Typography>
            ?
          </Typography>
        ),
        back: <Typography>{getConjugationByForm(term, "ett")}</Typography>,
      };
    case "present_tense_to_dictionary_form":
      return {
        front: getConjugationByForm(term, "presentTense") ? (
          <Typography component="span">
            What is the dictionary form of{" "}
            <Typography component="span" fontWeight={600}>
              {getConjugationByForm(term, "presentTense")}
            </Typography>
            ?
          </Typography>
        ) : (
          ""
        ),
        back: <Typography>{term.swedish}</Typography>,
      };
    case "singular_indefinite_to_plural_definite":
      return {
        front: (
          <Typography component="span">
            What is the <i>definite plural</i> of{" "}
            <Typography component="span" fontWeight={600}>
              {term.swedish}
            </Typography>
            ?
          </Typography>
        ),
        back: (
          <Typography>
            {getConjugationByForm(term, "definitePlural")}
          </Typography>
        ),
      };
    case "singular_indefinite_to_plural_indefinite":
      return {
        front: (
          <Typography component="span">
            What is the <i>indefinite plural</i> of{" "}
            <Typography component="span" fontWeight={600}>
              {term.swedish}
            </Typography>
            ?
          </Typography>
        ),
        back: (
          <Typography>
            {getConjugationByForm(term, "indefinitePlural")}
          </Typography>
        ),
      };
    case "singular_indefinite_to_singular_definite":
      return {
        front: (
          <Typography component="span">
            What is the <i>singular definite</i> form of{" "}
            <Typography component="span" fontWeight={600}>
              {term.swedish}
            </Typography>
            ?
          </Typography>
        ),
        back: (
          <Typography>
            {getConjugationByForm(term, "definiteSingular")}
          </Typography>
        ),
      };
    default:
      return emptyCard;
  }
};
