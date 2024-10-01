import { GeneratedContent } from "./types";

export const getReadableGeneratedContentLabel = (content: GeneratedContent) => {
  switch (content) {
    case "swedish_to_definition":
      return <span>Swedish &rarr; English</span>;
    case "definition_to_swedish":
      return <span>English &rarr; Swedish</span>;
  }
};
