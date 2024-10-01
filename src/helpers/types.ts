import { UUID } from "crypto";

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

export interface Term {
  id: UUID;
  type: WordClassType;
  swedish: string;
  definition: string;
  conjugations?: Conjugation[];
  notes?: string;
}

export interface TermList {
  id: UUID;
  terms: Term[];
  name: string;
  createdOn: Date;
  updatedOn?: Date;
}

export type QuizOrder = "random" | "in_order";

export type GeneratedContent =
  | "swedish_to_definition"
  | "definition_to_swedish";

export interface QuizCard {
  id: UUID;
  termListId: UUID;
  termId: UUID;
  generatedContent?: GeneratedContent;
}

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
