import { required as requiredValidator, showError } from "@/helpers/formUtils";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  NativeSelect,
  Select,
  SelectChangeEvent,
  SxProps,
} from "@mui/material";
import { ChangeEvent, useCallback } from "react";
import { Field, FieldInputProps } from "react-final-form";

type Options = string[] | { [key: string]: string };

interface Props {
  fieldName: string;
  inputLabel: string;
  inputLabelId: string;
  label: string;
  options: Options;
  required?: boolean;
  "data-testid"?: string;
  sx?: SxProps;
}

const ResponsiveSelect = <T extends string | object>(props: Props) => {
  const { inputLabel, label, required, options, inputLabelId, sx, fieldName } =
    props;

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
          name={fieldName}
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
              {Array.isArray(options) &&
                options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              {!Array.isArray(options) &&
                Object.keys(options).map((key) => (
                  <option key={key} value={key}>
                    {options[key]}
                  </option>
                ))}
            </NativeSelect>
          )}
        />
      </FormControl>
      <FormControl sx={{ display: ["none", "inline-flex"] }} required fullWidth>
        <InputLabel id={inputLabelId}>{inputLabel}</InputLabel>

        <Field<T>
          name={fieldName}
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
              {Array.isArray(options) &&
                options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              {!Array.isArray(options) &&
                Object.keys(options).map((key) => (
                  <MenuItem key={key} value={key}>
                    {options[key]}
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
