import { Box, TextField } from "@mui/material";
import { Control, Controller, FieldPath } from "react-hook-form";
import { TRules } from "types/form.types";
import { ColorPickerStyled } from "./ColorPicker.style";

export interface IColorPicker<FormNames extends Record<string, any>> {
  control: Control<FormNames>;
  name: FieldPath<FormNames>;
  rules?: TRules<FormNames>;
  label?: any;
  placeholder?: string;
  disabled?: boolean;
}

function ColorPicker<FormNames extends Record<string, any>>({
  label,
  control,
  name,
  placeholder = "#ef6c1d",
  rules,
  disabled = false,
}: IColorPicker<FormNames>) {

  const validateHex = (value: string): boolean | string => {
    if (!value) return "Rang tanlash majburiy";
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    if (!hexPattern.test(value)) {
      return "Noto'g'ri hex format (masalan: #ef6c1d)";
    }
    return true;
  };

  const colorInputRules = {
    required: rules?.required ? { value: true, message: "Rang tanlash majburiy" } : false,
    validate: validateHex,
    ...rules,
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={colorInputRules}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { error },
      }) => {
        const hexValue = value || "#ef6c1d";

        const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let newValue = e.target.value;
          // Ensure it starts with #
          if (newValue && !newValue.startsWith("#")) {
            newValue = "#" + newValue;
          }
          // Limit to 7 characters (# + 6 hex digits)
          if (newValue.length > 7) {
            newValue = newValue.substring(0, 7);
          }
          onChange(newValue);
        };

        const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          // HTML5 color input already returns hex value
          onChange(e.target.value);
        };

        return (
          <ColorPickerStyled>
            {label && (
              <label htmlFor={name}>
                {label}
                <span>
                  {label && colorInputRules?.required ? (
                    <span className="text-error mt-1">*</span>
                  ) : null}
                </span>
              </label>
            )}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                sx={{
                  flex: 1,
                  "& fieldset": { border: "none" },
                }}
                type="text"
                onChange={handleHexChange}
                onBlur={onBlur}
                disabled={disabled}
                value={hexValue}
                name={name}
                placeholder={placeholder}
                ref={ref}
                id={name}
                inputProps={{
                  maxLength: 7,
                  pattern: "^#[0-9A-Fa-f]{6}$",
                }}
                variant="outlined"
              />
              <Box
                sx={{
                  position: "relative",
                  width: "48px",
                  height: "48px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  border: "1px solid #ccc",
                  flexShrink: 0,
                }}
              >
                <input
                  type="color"
                  value={hexValue}
                  onChange={handleColorChange}
                  disabled={disabled}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    border: "none",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: 0,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: hexValue,
                    pointerEvents: "none",
                  }}
                />
              </Box>
            </Box>
            {error && (
              <>
                <h6 className="text-error mt-1">{error.message}</h6>
              </>
            )}
          </ColorPickerStyled>
        );
      }}
    />
  );
}

export default ColorPicker;

