import React, { ReactNode } from "react";
import { FieldPath, RegisterOptions } from "react-hook-form";

export type IErrors =
  | {
      [key: string]: IFieldError;
    }
  | {};

export interface IFieldError {
  type: TFieldErrorType;
  message: string;
  ref: {
    name: string;
  };
}

export type TFieldErrorType = "required" | "pattern" | "min" | "max";
export interface IFormNames {
  [key: string]: string;
}

export interface ICustomProviderProps {
  children: ReactNode;
}
export interface IOption<T = string> extends Record<string, any> {
  _id: T;
  name: string;
  trans_key?: string;
}

export type TSetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type TRules<FormNames extends Record<string, any>> = Omit<
  RegisterOptions<FormNames, FieldPath<FormNames>>,
  "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
>;
// @ts-ignore
export type EnumValues<T extends {}> = T[keyof typeof T];
