import React, { useEffect } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, Alert } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Table, TextInput } from "components";
import { useProductColumns } from "./abc_analytics.columns";
import { useRoleManager } from "services/useRoleManager";
import { useAppDispatch } from "store/storeHooks";
import { RangeDatePicker } from "components";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useState } from "react";

const Client = () => {
  const allParams = useAllQueryParams();
  const columns = useProductColumns();
  const hasAccess = useRoleManager();
  const dis = useAppDispatch();
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState("total_price");
  const [error, setError] = useState("");

  const formStore = useForm({
    defaultValues: {
      a: 20,
      b: 40,
      c: 40,
      sortBy: {
        _id: "total_price",
        name: "Umumiy narx",
        trans_key: "total_price",
      },
    },
  });
  
  const { control, handleSubmit, reset, setValue, watch } = formStore;
  const watchedValues = {
    a: Number(watch('a')) || 0,
    b: Number(watch('b')) || 0,
    c: Number(watch('c')) || 0
  };

  // Validate total equals 100
  useEffect(() => {
    const total = watchedValues.a + watchedValues.b + watchedValues.c;
    if (total !== 100) {
      setError(`A, B, va C qiymatlarining yig'indisi 100 bo'lishi kerak. Hozirgi yig'indi: ${total}`);
    } else {
      setError("");
    }
  }, [watchedValues.a, watchedValues.b, watchedValues.c]);

  const renderHeader = (
    <>
      <Grid className='pb-2' container display={"flex"} alignItems={'center'} spacing={2} >
        <Grid lg={3} md={6} xs={12} paddingBlockStart={5} paddingInlineStart={2}>
          <RangeDatePicker />
        </Grid>
        <Grid lg={3} md={6} xs={12} paddingBlockStart={5} paddingInlineStart={2}>
          <Controller
            name="sortBy"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="sort-by-label">{t("Filter")}</InputLabel>
                <Select
                  labelId="sort-by-label"
                  label={t("Filter")}
                  size="small"
                  onChange={(e: any) => {
                    setSortBy(e.target.value);
                  }}
                  style={{ width: '150px', paddingBlock: 3, marginTop: 2, borderRadius: 10 }}
                  defaultValue={'total_price'}
                >
                  <MenuItem value="total_price">Umumiy narx</MenuItem>
                  <MenuItem value="total_amount">Sotilgan</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item lg={2} md={4} xs={12}>
          <TextInput
            name="a"
            control={control}
            type="number"
            label={t("A")}
            rules={{ 
              required: true,
              min: 0,
              max: 100
            }}
          />
        </Grid>
        <Grid item lg={2} md={4} xs={12}>
          <TextInput
            name="b"
            control={control}
            type="number"
            label={t("B")}
            rules={{ 
              required: true,
              min: 0,
              max: 100
            }}
          />
        </Grid>
        <Grid item lg={2} md={4} xs={12}>
          <TextInput
            name="c"
            control={control}
            type="number"
            label={t("C")}
            rules={{ 
              required: true,
              min: 0,
              max: 100
            }}
          />
        </Grid>
      </Grid>
    </>
  );

  return (
    <>
      <Table
        columns={columns}
        dataUrl="report/abc"
        headerChildren={renderHeader}
        isGetAll
        // @ts-ignore
        exQueryParams={!error ? {
          a: watchedValues.a,
          b: watchedValues.b,
          c: watchedValues.c,
          sortBy: sortBy,
          dateFrom: allParams.dateFrom,
          dateTo: allParams.dateTo,
        } : null}
      />
    </>
  );
};

export default Client;