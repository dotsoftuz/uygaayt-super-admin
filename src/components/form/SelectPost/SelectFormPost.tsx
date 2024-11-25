import { Box, Chip, FormControl, MenuItem } from "@mui/material";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import {
  Control,
  Controller,
  FieldPath,
  UseFormSetValue,
} from "react-hook-form";
import { IOption, TRules } from "types/form.types";
import { SelectLableStyled, SelectStyled } from "./SelectForm.style";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export interface ISelectForm<FormNames extends Record<string, any>> {
  control: Control<FormNames>;
  rules?: TRules<FormNames>;
  name: FieldPath<FormNames>;
  options?: IOption[];
  label?: any;
  optionsUrl?: string;
  onChange?: (optionId: string, selectedOption?: IOption) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  defaultValue?: any;
  setValue?: UseFormSetValue<FormNames>;
  filterOptions?: (options: IOption[]) => IOption[];
  setAdditionalItem?: (option: IOption) => string;
  value: string;
}

function Select<FormNames extends Record<string, any>>({
  control,
  options = [],
  name,
  label,
  disabled = false,
  optionsUrl,
  className,
  placeholder,
  setValue,
  defaultValue = "",
  filterOptions,
  setAdditionalItem,
  rules = {
    required: {
      value: true,
      message: "Majburiy",
    },
  },
  onChange,
}: ISelectForm<FormNames>) {
  const { t } = useTranslation();
  // const { data: optionsFromUrl } = useApi<IOption[]>(
  //   optionsUrl || "",
  //   {},
  //   {
  //     enabled: !!optionsUrl,
  //     suspense: false,
  //   }
  // );


  const { mutate, data: optionsFromUrl, reset, status } = useApiMutation(
    optionsUrl || "",
    "post",
    {
      onSuccess() {
        console.log(optionsFromUrl)
      },
    });

  useEffect(() => {
    console.log("Mutating with optionsUrl:", optionsUrl); 
    mutate({
      optionsFromUrl
    });
  }, [mutate]);

  useEffect(() => {
    if (optionsFromUrl) {
      console.log("Fetched optionsFromUrl:", optionsFromUrl);
    } else {
      console.warn("optionsFromUrl is undefined");
    }
  }, [optionsFromUrl]);



  let mappedOptions: IOption[] | undefined;
  if (optionsFromUrl) {
    mappedOptions = optionsFromUrl.data;
  }
  const SELECT_OPTIONS = (
    optionsFromUrl?.data.data && Array.isArray(optionsFromUrl.data.data)
      ? optionsFromUrl.data.data
      : options
  ).map((item:any) => ({
    ...item,
    name: item.firstName
      ? `${item.firstName} ${item.lastName}` 
      : item.carBrand
      ? `Brand: ${item.carBrand}, Model: ${item.carModel}` 
      : `Number: ${item.carNumber}`, 
  }));


  return (
    <>
      {label && (
        <SelectLableStyled className="select-label">
          <label>{label}</label>
          <span>
            {label && rules?.required ? (
              <span className="text-error mt-1">*</span>
            ) : null}
          </span>
        </SelectLableStyled>
      )}
      <FormControl fullWidth variant="outlined">
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({
            field: { onChange: onChangeForm, value, ref, onBlur },
            fieldState,
          }) => {
            const isError = !!fieldState.error;
            return (
              <>
                <SelectStyled
                  onChange={(e) => {
                    onChangeForm(e);
                    onChange?.(
                      e.target.value as string,
                      SELECT_OPTIONS?.find(
                        (item: any) => item?._id === e?.target?.value
                      )
                    );
                  }}
                  value={value}
                  labelId={name}
                  id={name}
                  ref={ref}
                  onBlur={onBlur}
                  color={!!fieldState.error ? "error" : undefined}
                  SelectDisplayProps={getIsValueUndefined(value)}
                  disabled={disabled}
                  sx={{
                    "& fieldset": { border: "none" },
                  }}
                >
                  {SELECT_OPTIONS?.length > 0 ? (
                    (filterOptions
                      ? filterOptions(SELECT_OPTIONS)
                      : SELECT_OPTIONS
                    )?.map((option:any) => (
                      <MenuItem value={option._id} key={option._id}>
                        {option.fullName}
                        {setAdditionalItem?.(option.fullName)}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value={undefined}>
                      Hech narsa topilmadi⛔
                    </MenuItem>
                  )}
                </SelectStyled>
                {isError && (
                  <h6 className="text-error mt-1">{t("general.required")}</h6>
                )}
              </>
            );
          }}
          // @ts-ignore
          defaultValue={defaultValue} // make sure to set up defaultValue
        />
      </FormControl>
    </>
  );
}

//? there is bug with mui, mui select is not being cleaned event if i reset its value
const getIsValueUndefined = (value: any) => ({
  style: {
    color: !value ? "white" : "initial",
  },
});

export default Select;
