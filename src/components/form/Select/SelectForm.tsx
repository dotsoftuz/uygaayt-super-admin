import { Box, Chip, FormControl, MenuItem } from "@mui/material";
import { useApi } from "hooks/useApi/useApiHooks";
import {
  Control,
  Controller,
  FieldPath,
  UseFormSetValue,
} from "react-hook-form";
import { IOption, TRules } from "types/form.types";
import { SelectLableStyled, SelectStyled } from "./SelectForm.style";
import { useTranslation } from "react-i18next";

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
  defaultValue?: string;
  setValue?: UseFormSetValue<FormNames>;
  filterOptions?: (options: IOption[]) => IOption[];
  setAdditionalItem?: (option: IOption) => string;
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
  const { data: optionsFromUrl } = useApi<IOption[]>(
    optionsUrl || "",
    {},
    {
      enabled: !!optionsUrl,
      suspense: false,
    }
  );
  let mappedOptions: IOption[] | undefined;
  if (optionsFromUrl) {
    mappedOptions = optionsFromUrl.data;
  }
  const SELECT_OPTIONS = (mappedOptions || options)?.map((item) => ({
    ...item,
    name: item?.firstName
      ? `${item?.firstName} ${item?.lastName}`
      : item.trans_key
      ? t(`enum.${item.trans_key}`)
      : item.name,
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
                        (item: IOption) => item?._id === e?.target?.value
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
                    )?.map((option) => (
                      <MenuItem value={option._id} key={option._id}>
                        {option.name}
                        {setAdditionalItem?.(option)}
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
