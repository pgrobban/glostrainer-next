import { required, showError } from "@/helpers/formUtils";
import { DeleteIcon } from "@/helpers/icons";
import { Conjugation, WordClassType } from "@/helpers/types";
import { Box, Grid2 as Grid, IconButton, TextField } from "@mui/material";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import ResponsiveSelect from "./ResponsiveSelect";
import { getConjugationOptionsForWordClass } from "@/helpers/termUtils";

interface Props {
  wordClass: WordClassType;
}

const ConjugationsFields: React.FC<Props> = ({ wordClass }) => {
  const boxMargins = { mt: [1, 0], mr: [1, 0], mb: [0, 0], ml: [1, 0] };

  return (
    <FieldArray<Conjugation> name="conjugations">
      {({ fields }) =>
        fields.map((name, index) => {
          const options = getConjugationOptionsForWordClass(wordClass);

          return (
            <Grid
              border={["1px solid #777", "none"]}
              borderRadius={3}
              p={[1, 0]}
              key={name}
              container
              alignItems={"center"}
              columns={[13]}
              mb={1}
            >
              <Grid
                size={[12]}
                container
                spacing={[0, 2]}
                direction={["column", "row"]}
                columns={[12]}
              >
                <Grid size={[12, 6]}>
                  <Box mt={1}>
                    <Box {...boxMargins}>
                      <ResponsiveSelect
                        required
                        fieldName={`${name}.form`}
                        inputLabel={"Form"}
                        inputLabelId={`${name}-input-label`}
                        label={"Select a form"}
                        options={options}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid size={[12, 6]}>
                  <Box {...boxMargins}>
                    <Field
                      name={`${name}.term`}
                      validate={required}
                      render={({ input, meta }) => (
                        <TextField
                          required
                          label="Term"
                          fullWidth
                          value={input.value}
                          onChange={input.onChange}
                          error={showError(meta)}
                        />
                      )}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid size={[1]} container justifyContent={"center"}>
                <IconButton
                  color="secondary"
                  onClick={() => fields.remove(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          );
        })
      }
    </FieldArray>
  );
};

export default ConjugationsFields;
