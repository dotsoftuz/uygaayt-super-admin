import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";
import { TextInputStyled } from "../TextInput.style";
import { Control, Controller, FieldPath } from "react-hook-form";
import { TRules } from "types/form.types";

interface IMoneyInput<FormNames extends Record<string, any>> {
  control: Control<FormNames>;
  name: FieldPath<FormNames>;
  rules?: TRules<FormNames>;
  label?: string;
  placeholder?: string | number;
  disabled?: boolean;
  onCustomChange: any
}

function MoneyInput<FormNames extends Record<string, any>>({
  control,
  name,
  disabled,
  label,
  placeholder,
  rules,
  onCustomChange
}: IMoneyInput<FormNames>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextInputStyled>
          {label && (
            <label htmlFor="">
              {label}
              <span>
                {label && rules?.required ? (
                  <span className="text-error mt-1">*</span>
                ) : null}
              </span>
            </label>
          )}
          <NumericFormat
            // {...field}
            // onChange={(e) => e.target.value}
            value={field.value || ""}
            onBlur={field.onBlur}
            placeholder={String(placeholder)}
            disabled={disabled}
            InputProps={{
              ref: field.ref,
              sx: {
                "& fieldset": { border: "none" },
              },
            }}
            name={field.name}
            allowLeadingZeros={true}
            thousandSeparator=" "
            allowNegative={true}
            customInput={TextField}
            decimalScale={3}
            onValueChange={(val) => {
              field.onChange(val.floatValue || "");
              onCustomChange?.(val);
            }}
          />
          {fieldState.error && (
            <>
              <h6 className="text-error mt-1">
                {fieldState.error.message}
              </h6>
            </>
          )}
        </TextInputStyled>
      )}
    />
  );
}

export default MoneyInput;
