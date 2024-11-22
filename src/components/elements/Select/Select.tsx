import {
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Box,
  SelectChangeEvent,
} from "@mui/material";
import { IOption } from "types/form.types";
import { useApi } from "hooks/useApi/useApiHooks";
import { useSearchParams } from "react-router-dom";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
import { SelectMenuStyled, SelectStyled } from "./Select.style";
import { useTranslation } from "react-i18next";

export interface ISelection {
  label?: string;
  options?: readonly IOption[];
  optionsUrl?: string;
  iconValue?: React.ReactNode;
  filterName?: string;
  onChange?: (
    val?: string | undefined | string[],
    selectedOptions?: IOption[],
    child?: React.ReactNode,
    selectedOneOption?: IOption //😐
  ) => void;
  getOptionsFromUrl?: (options: IOption[]) => void;
  defaultFirst?: boolean;
  multiple?: boolean;
  customValue?: string | string[];
  disabled?: boolean;
  customPlaceholder?: string;
}

const Select = ({
  label,
  options = [],
  customPlaceholder,
  onChange,
  getOptionsFromUrl,
  optionsUrl = "",
  filterName,
  defaultFirst = true,
  multiple,
  customValue,
  disabled = false,
  iconValue,
}: ISelection) => {
  const { t } = useTranslation();
  const {
    data: optionsUrlData,
    status,
    isError,
  } = useApi<IOption[]>(
    optionsUrl || "",
    {},
    {
      enabled: !!optionsUrl,
      suspense: false,
    }
  );

  useEffect(() => {
    if (status === "success") {
      getOptionsFromUrl?.(optionsUrlData?.data);
      if (defaultFirst) {
        setValue(optionsUrlData?.data?.[0]?._id);
      }
    }
  }, [status]);

  useEffect(() => {
    if (options && defaultFirst) {
      setValue(options?.[0]?._id);
    }
  }, [options]);

  const [searchParams, setSearchParams] = useSearchParams();
  const allParams = useAllQueryParams();
  const [value, setValue] = useState<string | IOption[]>(!multiple ? "" : []);
  const SELECT_OPTIONS =
  optionsUrlData?.data?.map((item) => {
    const currentLang = localStorage.getItem("i18nextLng") || "uz"; 
    return {
      ...item,
      name: item?.firstName
        ? `${item?.firstName} ${item?.lastName}` 
        : item?.name?.[currentLang] || "uz", 
    };
  }) || options;


   

  return (
    <div>
      <FormControl fullWidth>
        <label
          style={{
            color: "#232323",
            fontSize: "14px",
            fontWeight: "500",
            padding: "3px 0",
          }}
        >
          {label}
        </label>
        {/* @ts-ignore */}
        <SelectStyled
          // defaultValue={isFiltering ? defaultSearchValue : defaultValue}
          labelId={label}
          label={label}
          value={customValue || value || customPlaceholder || "Barchasi"}
          disabled={disabled}
          multiple={multiple}
          onChange={(e: SelectChangeEvent<string>, child) => {
            // @ts-ignore
            onChange?.(
              e.target.value,
              multiple
                ? SELECT_OPTIONS.filter((option) =>
                  e.target.value.includes(option._id)
                )
                : undefined,
              child,
              SELECT_OPTIONS.find((option) => option._id === e.target.value)
            );
            // @ts-ignore
            setValue(e.target.value);
            if (filterName) {
              // @ts-ignore
              setSearchParams({
                ...allParams,
                [filterName]: e.target.value,
              });
            }
          }}
          startAdornment={iconValue}
          // @ts-ignore
          renderValue={
            multiple
              ? (selected: any[]) => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                    }}
                  >
                    {selected.length > 0 &&
                      selected?.map((value) => (
                        <Chip
                          key={value}
                          label={
                            SELECT_OPTIONS.find((item) => item?._id === value)
                              ?.name
                          }
                        />
                      ))}
                  </Box>
                );
              }
              : undefined
          }
          endAdornment={
            filterName &&
            value && (
              <IconButton
                onClick={() => {
                  onChange?.(
                    undefined
                    // SELECT_OPTIONS.find((item) => item?._id === value)?.name
                  );
                  setValue("");
                  delete allParams[filterName];
                  setSearchParams({
                    ...allParams,
                  });
                }}
                className="clear-btn"
              >
                <ClearIcon />
              </IconButton>
            )
          }
          fullWidth
          sx={{
            minWidth: 140,
            "& fieldset": { border: "none" },
            padding: "6px 12px",
          }}
        >
          <MenuItem
            value={customPlaceholder || "Barchasi"}
            disabled
            style={{ display: "none" }}
          >
            <span style={{ color: "#aaaaaa" }}>
              {customPlaceholder || t("LABELS.ROLE_ALL.TITLE")}
            </span>
          </MenuItem>
          {SELECT_OPTIONS?.map((item) => {
            return (
              <SelectMenuStyled key={item._id} value={item._id}>
                {item.trans_key
                  ? t(`SELECT_OPTIONS.${item.trans_key}`)
                  : item.name}
              </SelectMenuStyled>
            );
          })}
        </SelectStyled>
      </FormControl>
    </div>
  );
};

export default Select;
