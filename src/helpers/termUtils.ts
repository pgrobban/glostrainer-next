import { NounType, WordClassType } from "./types";

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

export const getShortLabelFromNounType = (nounType: NounType) => {
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
