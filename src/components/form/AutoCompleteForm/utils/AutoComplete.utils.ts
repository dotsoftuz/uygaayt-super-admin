import { IOption } from "types/form.types";

export const getValueFromOptions = (
  options: IOption[],
  val: string | string[],
  multiple?: boolean
) => {
  if (multiple) {
    const value = options?.filter((option) => val?.includes(option._id));
    return value;
  }
  const value = options.find((option) => option._id === val);
  return value ? value : null;
};