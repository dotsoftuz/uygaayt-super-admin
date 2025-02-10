import Autocomplete from "@mui/lab/Autocomplete";
import { TextField } from "@mui/material";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useEffect, useMemo, useState } from "react";
import { Control, Controller, FieldPath } from "react-hook-form";
import { IOption, TRules } from "types/form.types";
import useDebounce from "hooks/useDebounce";
import { AutoCompleteStyled } from "./AutoCompleteForm.style";
import { getValueFromOptions } from "./utils/AutoComplete.utils";
import { get } from "lodash";

export interface IAutocompleteForm<FormNames extends Record<string, any>> {
  control: Control<FormNames>;
  name: FieldPath<FormNames>;
  options?: IOption[];
  customOptions?: IOption[];
  optionsUrl?: string;
  returnOnlyId?: boolean;
  label?: any;
  rules?: TRules<FormNames>;
  placeholder?: any;
  disabled?: boolean;
  nameProp?: string;
  exQueryParams?: object;
  dataProp?: string;
  mapData?: (options: IOption[]) => IOption[];
  multiple?: boolean;
  getDataLength?: any;

  onInputChange?: (value: string) => void;
  onChange?: (options: IOption | null | IOption[]) => void;
}

function AutoCompleteForm<FormNames extends Record<string, any>>({
  control,
  name,
  options = [],
  optionsUrl = "", // 😐
  returnOnlyId = true,
  label = "",
  rules = { required: { value: true, message: "Majburiy" } },
  disabled,
  placeholder,
  nameProp = "name",
  exQueryParams = {},
  dataProp = "data" as const, //😐
  mapData,
  onChange,
  onInputChange,
  multiple = false,
  customOptions = [],
  getDataLength,
}: IAutocompleteForm<FormNames>) {
  const [queryParams, setQueryParams] = useState<{ search?: string }>();
  const [search, setSearch] = useState<string>();
  const { debouncedValue: debVal, isDebouncing } = useDebounce(search, 600);
  const currentLang = localStorage.getItem("i18nextLng") || "uz";

  useEffect(() => {
    setQueryParams({
      search,
    });
  }, [debVal]);

  // const { data: OptionsData, isFetching } = useApi<IOption[]>(
  //   optionsUrl,
  //   {
  //     ...queryParams,
  //     ...exQueryParams,
  //   },
  //   {
  //     enabled: !!optionsUrl,
  //     suspense: false,
  //     onSuccess(data) {
  //       getDataLength?.(get(data, dataProp)?.length);
  //     },
  //   }
  // );
  const { mutate, data: OptionsData, isLoading, status } = useApiMutation(
    optionsUrl,
    "post",
    {
      onSuccess(data) {
        getDataLength?.(get(data, dataProp)?.length);
      },
      onError(error) {
        console.error("Error in POST request:", error);
      }
    }
  );

  useEffect(() => {
    mutate({
      ...queryParams,
      ...exQueryParams,
    });
  }, [mutate, search]);


  const getLabel = (option: IOption) => {
    if (option?.firstName) {
      return `${option.firstName} ${option.lastName}`;
    }

    const label = option?.[nameProp];
    return typeof label === "object" && label !== null ? label[currentLang] : label;
  };

  const OPTIONS_PREV = (
    (get(OptionsData, dataProp) as IOption[]) ||
    options ||
    []
  )?.map((option) => ({
    ...option,
    name: getLabel(option) || "",
  }));

  const OPTIONS = useMemo(() => {
    return [...customOptions, ...OPTIONS_PREV];
  }, [OPTIONS_PREV, customOptions]);

  if (!Array.isArray(options)) {
    return null;
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        return (
          <AutoCompleteStyled multiple={multiple}>
            {label && (
              <label htmlFor={name}>
                {label}
                <span>
                  {label && rules?.required ? (
                    <span className="text-error mt-1">*</span>
                  ) : null}
                </span>
              </label>
            )}
            <Autocomplete
              options={mapData ? mapData(OPTIONS) : OPTIONS}
              getOptionLabel={(option) => option?.name || ""}
              multiple={multiple}
              {...field}
              onChange={(e, data: any) => {
                field.onChange(
                  returnOnlyId
                    ? multiple
                      ? data?.map((e: any) => e._id)
                      : data?._id!
                    : data
                );
                onChange?.(data);
              }}
              loading={isLoading || isDebouncing}
              disabled={disabled}
              sx={{
                "& fieldset": { border: "none" },
              }}
              loadingText="izlamoqda..."
              noOptionsText={!isDebouncing && "ma'lumot topilmadi"}
              value={
                returnOnlyId
                  ? multiple
                    ? getValueFromOptions(OPTIONS, field.value, true)
                    : getValueFromOptions(OPTIONS, field.value)
                  : field.value
              }
              renderInput={(params) => (
                <>
                  <TextField
                    {...params}
                    onChange={(e) => {
                      console.log(e.target.value);
                      if (!multiple) {
                        !field.value && setSearch(e?.target?.value || "");
                      } else {
                        // setSearch(e?.target?.value || "");
                      }
                      onInputChange?.(e?.target?.value || "");
                    }}
                    onBlur={() => !field.value && setSearch(undefined)}
                    value={params.inputProps.value}
                    variant="outlined"
                    error={!!fieldState.error}
                    fullWidth
                    placeholder={placeholder}
                  />
                  {fieldState?.error && (
                    <>
                      <h6 className="text-error mt-1">
                        {fieldState.error.message}
                      </h6>
                    </>
                  )}
                </>
              )}
            />
          </AutoCompleteStyled>
        );
      }}
    />
  );
}

export default AutoCompleteForm;
