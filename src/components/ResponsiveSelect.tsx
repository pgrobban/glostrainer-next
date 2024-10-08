import { required as requiredValidator, showError } from "@/helpers/formUtils";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  NativeSelect,
  Select,
  SxProps,
} from "@mui/material";
import { Field } from "react-final-form";

interface Props<T extends string> {
  inputLabel: string;
  inputLabelId: string;
  label: string;
  options: T[];
  required?: boolean;
  "data-testid"?: string;
  sx?: SxProps;
}

const ResponsiveSelect = <T extends string>(props: Props<T>) => {
  const { inputLabel, label, required, options, inputLabelId, sx } = props;
  return (
    <Box sx={sx}>
      <FormControl
        sx={{ display: ["inline-flex", "none"] }}
        required={required}
        fullWidth
      >
        <InputLabel
          shrink
          variant="standard"
          htmlFor={`${inputLabelId}-native`}
        >
          {inputLabel}
        </InputLabel>

        <Field<T>
          name="type"
          validate={props.required ? requiredValidator : undefined}
          render={({ input, meta }) => (
            <NativeSelect
              inputProps={{
                id: `${inputLabelId}-native`,
              }}
              defaultValue={input.value}
              onChange={input.onChange}
              error={showError(meta)}
            >
              <option value={""} disabled style={{ fontStyle: "italic" }}>
                {label}
              </option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </NativeSelect>
          )}
        />
      </FormControl>
      <FormControl sx={{ display: ["none", "inline-flex"] }} required fullWidth>
        <InputLabel id={inputLabelId}>{inputLabel}</InputLabel>

        <Field<T>
          name="type"
          validate={props.required ? requiredValidator : undefined}
          render={({ input, meta }) => (
            <Select
              data-testid={props["data-testid"]}
              label={inputLabel}
              labelId={inputLabelId}
              value={input.value}
              onChange={input.onChange}
              error={showError(meta)}
            >
              <MenuItem value="" disabled sx={{ fontStyle: "italic" }}>
                {label}
              </MenuItem>
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
    </Box>
  );
};

export default ResponsiveSelect;
