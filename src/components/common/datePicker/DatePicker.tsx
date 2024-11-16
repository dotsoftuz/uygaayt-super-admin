import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as DatePickerMUI } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
type TDateVal = string | null;
const DatePicker = (props: {
  filterName?: string;
  onChange?: (val: TDateVal) => void;
  value?: TDateVal;
}) => {
  const [date, setDate] = useState<TDateVal>(props.value || null);
  const [_, setSearchParams] = useSearchParams();
  const allParams = useAllQueryParams();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePickerMUI
        {...props}
        value={date}
        inputFormat="DD-MM-YYYY"
        // views={["year", "month", "day"]}
        onChange={(val) => {
          props.onChange?.(val);
          setDate(val);

          if (props.filterName && val && dayjs(val).isValid()) {
            setSearchParams({
              ...allParams,
              [props.filterName]: String(dayjs(val).unix()),
            });
          }
          if (props.filterName && val === null) {
            delete allParams[props.filterName];
            setSearchParams({
              ...allParams,
            });
          }
        }}
        renderInput={(pickerProps) => (
          <TextField
            {...pickerProps}
            inputProps={{
              ...pickerProps.inputProps,
              placeholder: dayjs().format("DD-MM-YYYY"),
            }}
            placeholder="oy"
            sx={{
              "& fieldset": { border: "none" },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};
export default DatePicker;
