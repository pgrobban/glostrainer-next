import { getReadableContentToGenerateLabel } from "@/helpers/quizUtils";
import { ContentToGenerate } from "@/helpers/types";
import { FormControl, MenuItem, Select } from "@mui/material";

const contentToGenerateTypes: Record<string, ContentToGenerate[]> = {
  General: ["swedish_to_definition", "definition_to_swedish"],
  Nouns: [
    "singular_indefinite_to_singular_definite",
    "singular_indefinite_to_plural_indefinite",
    "singular_indefinite_to_plural_definite",
    "plural_indefinite_to_plural_indefinite",
  ],
  Verbs: [
    "dictionary_form_to_present_tense",
    "dictionary_form_to_past_tense",
    "dictionary_form_to_supine",
    "dictionary_form_to_imperative",
    "present_tense_to_dictionary_form",
  ],
  Adjectives: ["en_form_to_ett_form", "en_form_to_den_det_de_form"],
};

interface Props {
  value: ContentToGenerate[];
  onChange: (newContentToGenerate: ContentToGenerate[]) => void;
}

const GenerateCardContentSelector: React.FC<Props> = ({ value, onChange }) => (
  <FormControl fullWidth error={value.length === 0}>
    <Select<ContentToGenerate[]>
      multiple
      value={value}
      onChange={(e) =>
        onChange(
          (typeof e.target.value === "string"
            ? e.target.value.split(",")
            : e.target.value) as ContentToGenerate[]
        )
      }
    >
      {Object.keys(contentToGenerateTypes).map((key) => [
        <MenuItem key={key} disabled>
          {key}
        </MenuItem>,
        contentToGenerateTypes[key].map((content) => (
          <MenuItem key={content} value={content}>
            {getReadableContentToGenerateLabel(content)}
          </MenuItem>
        )),
      ])}
    </Select>
  </FormControl>
);

export default GenerateCardContentSelector;
