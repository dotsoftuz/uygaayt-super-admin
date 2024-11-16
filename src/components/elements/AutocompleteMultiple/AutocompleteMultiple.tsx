import Autocomplete from "@mui/lab/Autocomplete";
import { TextField } from "@mui/material";
import { IOption } from "types/form.types";
import { AutoCompleteStyledMultiple } from "./AutocompleteMultipleStyled";

//!! @for selecting products only
const AutocompleteMultiple = ({
  options,
  onChange,
}: {
  options: IOption[];
  onChange: (options: IOption<string>[]) => void;
}) => {
  return (
    <>
      <AutoCompleteStyledMultiple>
        <Autocomplete
          options={options}
          multiple={true}
          onChange={(e, val) => onChange(val)}
          getOptionLabel={(option) => option.name}
          value={[]}
          renderInput={(params) => (
            <>
              <TextField {...params} />
            </>
          )}
        />
      </AutoCompleteStyledMultiple>
    </>
  );
};

export default AutocompleteMultiple;
