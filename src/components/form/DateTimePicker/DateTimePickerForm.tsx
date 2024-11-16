import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { Control, Controller, FieldPath } from "react-hook-form";
import { TRules } from "types/form.types";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePickerStyled } from "./DateTimePickerForm.style";
import { useTranslation } from "react-i18next";

interface IDatePicker<FormNames extends Record<string, any>> {
  control: Control<FormNames>;
  name: FieldPath<FormNames>;
  rules?: TRules<FormNames>;
  label?: any;
  disableTime?: boolean;
  minDate?: Date;
  maxDate?: Date;
  readOnly?: boolean;
}
const dateRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-(\d{4})$/;
export const DATE_FORMAT = "DD-MM-YYYY";

function DatePickerForm<FormNames extends Record<string, any>>({
  control,
  name,
  disableTime = false,
  minDate,
  maxDate,
  rules = {
    required: {
      value: true,
      message: "Majburiy qator",
    },
  },
  label,
  readOnly = false,
}: IDatePicker<FormNames>) {
  const format = disableTime ? DATE_FORMAT : `${DATE_FORMAT}`;
  const { t } = useTranslation();

  return (
    <DateTimePickerStyled>
      <Controller
        control={control}
        name={name}
        rules={rules}
        // @ts-ignores😐
        defaultValue={null}
        render={({ field, fieldState: { error } }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              {...field}
              inputFormat={format}
              minDate={minDate ? minDate : null}
              maxDate={maxDate ? maxDate : null}
              renderInput={(pickerProps) => (
                <>
                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: "14px",
                      lineHeight: "16px",
                      color: "#32324d",
                      padding: "5px 0",
                    }}
                  >
                    {label}
                  </span>
                  <TextField
                    {...pickerProps}
                    inputProps={{
                      ...pickerProps.inputProps,
                      readOnly: readOnly,
                      placeholder: dayjs().format(format),
                    }}
                    placeholder="oy"
                    fullWidth
                    sx={{
                      "& fieldset": { border: "none" },
                    }}
                  />
                </>
              )}
            />
            {error && (
              <>
                <h6 className="text-error mt-1">{t("general.required")}</h6>
              </>
            )}
          </LocalizationProvider>
        )}
      />
    </DateTimePickerStyled>
  );
}
export default DatePickerForm;
