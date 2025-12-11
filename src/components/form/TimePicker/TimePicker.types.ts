import { TRules } from "types/form.types";

export interface ITimePicker {
  control: any;
  name: string;
  errors: any;
  rules?: TRules<any>;
  label?: string;
}
