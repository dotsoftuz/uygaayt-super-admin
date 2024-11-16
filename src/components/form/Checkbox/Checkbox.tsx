import { Checkbox as CheckboxMui } from "@mui/material";
import { Control, Controller, FieldPath } from "react-hook-form";
import { CheckboxStyled } from "./Checkbox.style";

interface ISwitch<FormNames extends Record<string, any>> {
  control: Control<FormNames>;
  name: FieldPath<FormNames>;
  label?: any;
  isFullWidth?: boolean;
  onChange?: (val: boolean, event?: any) => void;
  disabled?: boolean;
  className?: string;
}

function Checkbox<FormNames extends Record<string, any>>({
  name,
  control,
  label,
  isFullWidth = false,
  onChange,
  disabled,
  className,
}: ISwitch<FormNames>) {
  return (
    <Controller
      render={({ field }) => (
        <CheckboxStyled fullWidth={isFullWidth} className={className}>
          <CheckboxMui
            {...field}
            disabled={disabled}
            onChange={(event, checked) => {
              field.onChange(checked, event);
              onChange?.(checked, event);
            }}
            checked={field.value}
            id={name}
          />
          <label htmlFor={name}>{label || ""}</label>
        </CheckboxStyled>
      )}
      name={name}
      // @ts-ignore
      defaultValue={false}
      control={control}
    />
  );
}

export default Checkbox;
