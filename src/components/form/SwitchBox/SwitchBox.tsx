import { Checkbox as CheckboxMui, Switch } from "@mui/material";
import { Control, Controller, FieldPath } from "react-hook-form";

interface ISwitch<FormNames extends Record<string, any>> {
  control: Control<FormNames>;
  name: FieldPath<FormNames>;
  label?: string;
  isFullWidth?: boolean;
  onChange?: (val: boolean) => void;
}

function SwitchBox<FormNames extends Record<string, any>>({
  name,
  control,
  label,
  isFullWidth = false,
  onChange,
}: ISwitch<FormNames>) {
  return (
    <Controller
      render={({ field }) => (
        <>
          <Switch
            {...field}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e.target.value === "true");
            }}
            checked={field.value}
            id={name}
          />
          <label htmlFor={name}>{label}</label>
        </>
      )}
      name={name}
      // @ts-ignore
      defaultValue={false}
      control={control}
    />
  );
}

export default SwitchBox;
