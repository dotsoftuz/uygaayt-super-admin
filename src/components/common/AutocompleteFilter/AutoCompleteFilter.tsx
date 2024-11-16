import Autocomplete from "@mui/lab/Autocomplete";
import { TextField } from "@mui/material";
import { AutoCompleteStyled } from "components/form/AutoCompleteForm/AutoCompleteForm.style";
import { getValueFromOptions } from "components/form/AutoCompleteForm/utils/AutoComplete.utils";
import { useApi } from "hooks/useApi/useApiHooks";
import useDebounce from "hooks/useDebounce";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { IOption } from "types/form.types";

interface IAutocompleteFilter {
  filterName: string;
  options?: IOption[];
  optionsUrl?: string;
  returnOnlyId?: boolean;
  label?: any;
  placeholder?: any;
  disabled?: boolean;
  nameProp?: string;
  exQueryParams?: object;
  dataProp?: string;
  mapData?: (options: IOption[]) => IOption[];
  onChange?: (options: IOption | null | undefined) => void;
}

function AutoCompleteFilter({
  options = [],
  optionsUrl = "", // 😐
  returnOnlyId = true,
  label,
  disabled,
  placeholder,
  filterName,
  nameProp = "name",
  exQueryParams = {},
  dataProp = "data.data" as const, //😐
  mapData,
  onChange,
}: IAutocompleteFilter) {
  const [queryParams, setQueryParams] = useState<{ search?: string }>();
  const [search, setSearch] = useState<string>();
  const { debouncedValue: debVal, isDebouncing } = useDebounce(search, 600);
  const [value, setValue] = useState<string | undefined | null>(null);
  useEffect(() => {
    setQueryParams({
      search,
    });
  }, [debVal]);

  const { data: OptionsData, isFetching } = useApi<IOption[]>(
    optionsUrl,
    {
      ...queryParams,
      ...exQueryParams,
    },
    {
      enabled: !!optionsUrl,
      suspense: false,
    }
  );
  const getLabel = (option: IOption) =>
    option?.firstName
      ? `${option?.firstName} ${option?.lastName}`
      : (option?.[nameProp] as string);
  // @ts-ignore
  const OPTIONS = ((get(OptionsData, dataProp) as IOption[]) || options).map(
    (option) => ({
      ...option,
      name: getLabel(option),
    })
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const allParams = useAllQueryParams();

  const { t } = useTranslation();

  return (
    <AutoCompleteStyled>
      {label && <label>{label}</label>}
      <Autocomplete
        options={mapData ? mapData(OPTIONS) : OPTIONS}
        // @ts-ignore
        getOptionLabel={(option) => option?.name || ""}
        onChange={(e, data) => {
          // @ts-ignore
          onChange?.(data);
          // @ts-ignore
          setValue(returnOnlyId ? data?._id! : data);
          // @ts-ignore
          if (filterName) {
            if (data) {
              setSearchParams({
                ...allParams,
                // @ts-ignore
                [filterName]: data?._id,
              });
            } else {
              delete allParams[filterName];
              setSearchParams({
                ...allParams,
              });
            }
          }
        }}
        loading={isFetching || isDebouncing}
        disabled={disabled}
        sx={{
          "& fieldset": { border: "none" },
        }}
        loadingText="izlamoqda..."
        noOptionsText={!isDebouncing && "malumot topilmadi"}
        // @ts-ignore
        value={returnOnlyId ? getValueFromOptions(OPTIONS, value) : value}
        renderInput={(params) => (
          <>
            <TextField
              {...params}
              inputProps={{
                ...params.inputProps,
                onChange: (e) => {
                  // @ts-ignore
                  params?.inputProps?.onChange?.(e);
                  // @ts-ignore
                  setSearch(e.target.value || "");
                },
              }}
              onBlur={() => setSearch(undefined)}
              variant="outlined"
              fullWidth
              // @ts-ignore
              placeholder={placeholder || t("LABELS.ROLE_ALL.TITLE")}
            />
          </>
        )}
      />
    </AutoCompleteStyled>
  );
}

export default AutoCompleteFilter;
