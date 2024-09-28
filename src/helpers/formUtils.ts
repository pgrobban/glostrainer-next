import { FieldMetaState } from "react-final-form";

export const showError = <FieldValue>(meta: FieldMetaState<FieldValue>) =>
  meta.submitFailed &&
  !meta.modifiedSinceLastSubmit &&
  (meta.error || meta.submitError);

export const required = (value: any) => (value ? undefined : "Required");
