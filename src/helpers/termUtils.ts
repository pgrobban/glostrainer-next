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

export const getShortLabelFromNounType = (nounType: keyof typeof NounType) => {
  switch (nounType) {
    case "EN":
      return "en";
    case "ETT":
      return "ett";
    case "UNCOUNTABLE_DEFINITE_EN":
      return "unc. (en)";
    case "UNCOUNTABLE_DEFINITE_ETT":
      return "unc. (ett)";
    default:
      return "";
  }
};
