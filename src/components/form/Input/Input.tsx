import { FC } from "react";

import { IInputProps } from "./Input.types";
import { StyledInput } from "./Input.style";
import Label from "../Label/Label";
import Error from "../Error/Error";
import { isEmpty } from "lodash";

const Input: FC<IInputProps> = ({
  label = "",
  value = null,
  params,
  error,
  disabled = false,
  placeholder = "",
  className = "",
  setValue,
  onKeyDown,
  style,
  required = true,
  customErrorMessage = undefined,
}) => {
  // const currencyFormat = (e: any) => {
  //   setValue(params.name, currencyFormatter(e?.target?.value));
  // };

  return (
    <div className={className}>
      {label && (
        <Label label={label + `${!!params?.ref && required ? "*" : ""}`} />
      )}
      <StyledInput
        placeholder={placeholder}
        disabled={disabled}
        onWheel={(e) => e.currentTarget.blur()}
        value={value}
        // ref={ref}
        onKeyDown={onKeyDown}
        {...params}
        min="0"
        step="any"
        className={`${
          (!!error && !isEmpty(error)) || customErrorMessage ? "error" : ""
        }`}
        style={style}
        // onChange={setValue ? currencyFormat : params?.onChange}
      />
      {(!!error || customErrorMessage) && (
        <Error
          message={
            error?.[params.name]?.message ||
            error?.message ||
            customErrorMessage
          }
        />
      )}
    </div>
  );
};

export default Input;
