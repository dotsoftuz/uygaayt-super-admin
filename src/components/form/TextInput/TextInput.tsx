import { IconButton, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Control, Controller, FieldPath } from "react-hook-form";
import { TRules } from "types/form.types";
import { TextInputStyled } from "./TextInput.style";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MoneyInput from "./MoneyInput/MoneyInput";
import { SearchIcon } from "assets/svgs";

const initialValidation = (
  type: React.InputHTMLAttributes<unknown>["type"],
  inputProps?: any,
) => ({
  required: { value: true, message: "Majburiy" },
  minLength:
    type === "password"
      ? {
        value: 6,
        message: "uzunligi 6 dan ko'p bo'lishi kerak!",
      }
      : undefined,
  max: inputProps?.max
    ? {
      value: inputProps?.max,
      message: `Maximum ${inputProps?.max}`,
    }
    : undefined,
  min: inputProps?.min
    ? {
      value: inputProps?.min,
      message: `Minimum ${inputProps?.min}`,
    }
    : undefined,
});

export interface ITextField<FormNames extends Record<string, any>> {
  control: Control<FormNames>;
  name: FieldPath<FormNames>;
  rules?: TRules<FormNames>;
  label?: any;
  placeholder?: any;
  type?: React.InputHTMLAttributes<unknown>["type"];
  multiline?: boolean;
  disabled?: boolean;
  onCustomChange?: (val: string) => void;
  inputProps?: any;
  searchIcon?: boolean;
}

function TextInput<FormNames extends Record<string, any>>({
  label,
  control,
  name,
  placeholder = "",
  type = "text",
  multiline = false,
  rules,
  disabled = false,
  inputProps,
  onCustomChange,
  searchIcon,
}: ITextField<FormNames>) {
  const [showPassword, setShowPassword] = useState(true);
  if (type === "number") {
    return (
      <MoneyInput
        control={control}
        name={name}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        rules={{
          ...initialValidation("number", inputProps),
          ...rules,
        }}
        onCustomChange={onCustomChange}
      />
    );
  }

  const textInputRules = {
    ...initialValidation(type),
    ...rules,
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={textInputRules}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { error },
      }) => {
        return (
          <TextInputStyled searchIcon={searchIcon}>
            {label && (
              <label htmlFor={name}>
                {label}
                <span>
                  {label && textInputRules?.required ? (
                    <span className="text-error mt-1">*</span>
                  ) : null}
                </span>
              </label>
            )}
            {searchIcon && (
              <span className="search-icon">
                <SearchIcon />
              </span>
            )}
            <TextField
              sx={{
                "& fieldset": { border: "none" },
              }}
              type={
                type === "password"
                  ? showPassword
                    ? "password"
                    : "text"
                  : type
              }
              onChange={(e) => {
                onChange(e);
                onCustomChange?.(e.target?.value);
              }}
              onBlur={onBlur}
              disabled={disabled}
              value={value}
              name={name}
              placeholder={String(placeholder)}
              ref={ref}
              id={name}
              inputProps={inputProps}
              InputProps={{
                endAdornment: type === "password" && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              multiline={multiline}
            />
            {error && (
              <>
                <h6 className="text-error mt-1">{error.message}</h6>
              </>
            )}
          </TextInputStyled>
        );
      }}
    />
  );
}

export default TextInput;
