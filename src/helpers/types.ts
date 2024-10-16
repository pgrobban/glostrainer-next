import { UUID } from "crypto";
import { ReactNode } from "react";

export const WordClasses = [
  "Noun",
  "Verb",
  "Adjective",
  "Adverb",
  "Pronoun",
  "Numeral",
  "Conjunction",
  "Preposition",
  "Interjection",
  "Phrase/Other",
] as const;
export type WordClassType = (typeof WordClasses)[number];

export interface Conjugation {
  form: string;
  term: string;
}

export enum NounType {
  EN = "En-word",
  ETT = "Ett-word",
  UNCOUNTABLE_DEFINITE_EN = "Uncountable, acts as en in definite forms",
  UNCOUNTABLE_DEFINITE_ETT = "Uncountable, acts as ett in definite forms",
  PROPER_NOUN = "Proper noun",
}

export interface Term {
  id: UUID;
  type: WordClassType;
  swedish: string;
  definition: string;
  conjugations?: Conjugation[];
  notes?: string;
  nounType?: NounType | null;
}

export interface TermList {
  id: UUID;
  terms: Term[];
  name: string;
  createdOn: Date;
  updatedOn?: Date;
}

export type QuizOrder = "random" | "in_order";

export type ContentToGenerate =
  | "swedish_to_definition"
  | "definition_to_swedish"
  | "singular_indefinite_to_singular_definite"
  | "singular_indefinite_to_plural_indefinite"
  | "singular_indefinite_to_plural_definite"
  | "singular_definite_to_plural_definite"
  | "plural_indefinite_to_plural_indefinite"
  | "dictionary_form_to_present_tense"
  | "dictionary_form_to_past_tense"
  | "dictionary_form_to_supine"
  | "present_tense_to_dictionary_form"
  | "dictionary_form_to_imperative"
  | "en_form_to_ett_form"
  | "en_form_to_den_det_de_form";

export interface QuizCard {
  id: UUID;
  termListId: UUID;
  termId: UUID;
  contentToGenerate?: ContentToGenerate;
}

export type CardSide = "front" | "back";

export type QuizCardContentTemplateData = { [key in CardSide]: string };

export type QuizCardContent = { [key in CardSide]: ReactNode };

export interface Quiz {
  id: UUID;
  cards: QuizCard[];
  name: string;
  order: QuizOrder;
  createdOn: Date;
  updatedOn?: Date;
}

export type TermListObject = {
  [termListId: UUID]: Term[];
};

export interface Profile {
  termLists: TermList[];
  quizzes: Quiz[];
  activeTermListId: UUID | null;
  lastSave?: Date | null;
}

export interface CommonDialogProps {
  open: boolean;
  onClose: () => void;
}

export type ImportStrategy =
  | "merge_lists_without_overwrite"
  | "merge_lists_with_overwrite"
  | "only_add_new_lists"
  | "clear_and_import";
