import { DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { Control, Controller, FieldPath } from "react-hook-form";
import { TRules } from "types/form.types";
import { DateTimePickerStyled } from "./TimeDatePicker.style";
import { TextField } from "@mui/material";
// import { useTranslation } from "react-i18next";

interface IDatePicker<FormNames extends Record<string, any>> {
  control: Control<FormNames>;
  name: FieldPath<FormNames>;
  rules?: TRules<FormNames>;
  label?: any;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  onlyTime?: boolean;
}
// const dateRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-(\d{4})$/;
export const DATE_FORMAT = "DD-MM-YYYY | HH:mm";
export const TIME_FORMAT = "HH:mm";

function DatePickerForm<FormNames extends Record<string, any>>({
  control,
  name,
  minDate,
  maxDate,
  onlyTime,
  rules = {
    required: {
      value: true,
      message: "Majburiy qator",
    },
    validate: minDate
      ? (valDate: Dayjs) => dayjs(valDate)?.isAfter(minDate)
      : undefined,
  },
  label,
}: IDatePicker<FormNames>) {
  const format = onlyTime ? TIME_FORMAT : DATE_FORMAT;

  // const { t } = useTranslation();

  return (
    <DateTimePickerStyled>
      <Controller
        control={control}
        name={name}
        rules={rules}
        // @ts-ignore😐
        defaultValue={null}
        render={({ field, fieldState: { error } }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {onlyTime ? (
              <TimePicker
                {...field}
                // minTime={minDate}
                ampm={false}
                label={label}
                minTime={minDate ? minDate : null}
                maxTime={maxDate ? maxDate : null}
                renderInput={(props) => <TextField {...props} />}
              />
            ) : (
              <DateTimePicker
                {...field}
                inputFormat={format}
                ampm={false}
                label={label}
                minDate={minDate ? minDate : null}
                maxDate={maxDate ? maxDate : null}
                renderInput={(props) => <TextField {...props} />}
              />
            )}
            {error && (
              <div className="mt-1">
                <p className="text-error">Vaqtni to'g'ri kiriting</p>
              </div>
            )}
          </LocalizationProvider>
        )}
      />
    </DateTimePickerStyled>
  );
}
export default DatePickerForm;
