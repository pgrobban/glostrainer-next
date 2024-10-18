import { NounType, Term, WordClassType } from "./types";

export const getAbbreviatedTermType = (type: WordClassType) => {
  switch (type) {
    case "Adjective":
      return "Adj";
    case "Adverb":
      return "Adv";
    case "Conjunction":
      return "Conj";
    case "Interjection":
      return "Int";
    case "Noun":
      return "N";
    case "Numeral":
      return "Num";
    case "Phrase/Other":
      return "Phr";
    case "Preposition":
      return "Prep";
    case "Pronoun":
      return "Pr";
    case "Verb":
      return "V";
  }
};

export const getShortLabelFromNounType = (nounTypeKey: string) => {
  const nounType = NounType[nounTypeKey as keyof typeof NounType];
  if (!nounType) {
    return "";
  }

  switch (nounType) {
    case NounType.EN:
      return "en";
    case NounType.ETT:
      return "ett";
    case NounType.UNCOUNTABLE_DEFINITE_EN:
      return "unc. (en)";
    case NounType.UNCOUNTABLE_DEFINITE_ETT:
      return "unc. (ett)";
    default:
      return "";
  }
};

export const getConjugationOptionsForWordClass = (
  wordClass: WordClassType
): { [key: string]: string } => {
  const other = { other: "Other/I don't know" };

  switch (wordClass) {
    case "Noun":
      return {
        indefinitePlural: "Indefinite plural",
        definiteSingular: "Definite singular",
        definitePlural: "Definite plural",
        indefiniteSingularGenitive: "Indefinite singular genitive",
        indefinitePluralGenitive: "Indefinite plural genitive",
        ...other,
      };
    case "Verb":
      return {
        presentTense: "Present tense",
        pastTense: "Past tense",
        supine: "Supine (har/hade)",
        imperative: "Imperative",
        presentTensePassive: "Present tense passive",
        pastTensePassive: "Past tense passive",
        supinePassive: "Passive",
        presentTenseParticiple: "Present participle",
        perfectParticipleEn: "Perfect participle (en~)",
        perfectParticipleEtt: "Perfect participle (ett~)",
        denDetDeParticiple: "Perfect participle (den/det/de~)",
        ...other,
      };
    case "Adjective":
      return {
        ett: "ett ~",
        denDetDe: "den/det/de + positive",
        denMasculine: "den <masculine noun>",
        comparative: "Comparative",
        superlative: "Superlative",
        denDetDeSuperlative: "den/det/de + superlative",
        superlativeMasculine: "den <masculine noun> + superlative",
        ...other,
      };
    default:
      return { ...other };
  }
};

export const getConjugationByForm = (term: Term, conjugationForm: string) =>
  term.conjugations?.find((conj) => conj.form === conjugationForm)?.term || "";
