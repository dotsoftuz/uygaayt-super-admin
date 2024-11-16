import { IOption } from "types/form.types";

export const getValueFromOptions = (options: IOption[], val: string) => {
  const value = options.find((option) => option._id === val);
  return value ? value : null;
};
