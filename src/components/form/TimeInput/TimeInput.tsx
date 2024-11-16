import React from "react";
//@ts-ignore
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeInputStyled } from "./TimeInput.style";
import moment from "moment";

interface ITimeField {
     labelText?: string;
}
const TimeInput: React.FC<ITimeField> = ({ labelText }) => {
     const [value, setValue] = React.useState(moment());
     return (
          <TimeInputStyled>
               <label>
                    {labelText}
                    <span>*</span>
               </label>
               <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopTimePicker
                         value={value}
                         onChange={(newValue: any) => {
                              setValue(newValue);
                         }}
                         renderInput={(params) => <TextField {...params} />}
                    />
               </LocalizationProvider>
          </TimeInputStyled>
     );
};

export default TimeInput;
