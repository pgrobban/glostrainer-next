import { Term } from "./types";

export const filterTerm = (term: Term, searchTerm: string) => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return (
    term.swedish.toLowerCase().includes(lowerCaseSearchTerm) ||
    term.definition.toLowerCase().includes(lowerCaseSearchTerm) ||
    term.notes?.toLowerCase().includes(lowerCaseSearchTerm)
  );
};
