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
  onChange?: (newValue: string) => void;
}

const ResponsiveSelect = <T extends string | object>(props: Props) => {
  const {
    inputLabel,
    label,
    required,
    options,
    inputLabelId,
    sx,
    fieldName,
    onChange,
  } = props;

  const getNormalizedOptions = () => {
    if (Array.isArray(options)) {
      return options.map((option) => ({ key: option, label: option }));
    } else {
      return Object.keys(options).map((optionKey) => ({
        key: optionKey,
        label: options[optionKey],
      }));
    }
  };

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
              onChange={(evt) =>
                onChange ? onChange(evt.target.value) : input.onChange(evt)
              }
              error={showError(meta)}
            >
              <option value={""} disabled style={{ fontStyle: "italic" }}>
                {label}
              </option>
              {getNormalizedOptions().map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
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
              onChange={(evt) =>
                onChange
                  ? onChange(evt.target.value as string)
                  : input.onChange(evt)
              }
              error={showError(meta)}
            >
              <MenuItem value="" disabled sx={{ fontStyle: "italic" }}>
                {label}
              </MenuItem>
              {getNormalizedOptions().map((option) => (
                <MenuItem key={option.key} value={option.key}>
                  {option.label}
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
