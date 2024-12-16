import { Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Table, TextInput } from "components";
import { useProductColumns } from "./abc_analytics.columns";
import { useRoleManager } from "services/useRoleManager";
import { useAppDispatch } from "store/storeHooks";
import { RangeDatePicker } from "components"; // Assuming you have this component
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useState } from "react";

const Client = () => {
  const allParams = useAllQueryParams();
  const columns = useProductColumns();
  const hasAccess = useRoleManager();
  const dis = useAppDispatch();
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState()
  console.log(sortBy)
  const sortByOption = [
    {
      _id: "total_price",
      name: "Umumiy narx",
      trans_key: "total_price",
    },
    {
      _id: "total_amoun",
      name: "Umumiy narx",
      trans_key: "total_amount",
    }
  ]

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
  const { control, handleSubmit, reset, setValue, register, watch } = formStore;



  const renderHeader = (
    <Grid container display={"flex"} alignItems={'center'} spacing={2}>
      <Grid lg={3} md={6} xs={12} paddingBlockStart={5} paddingInlineStart={2}>
        <RangeDatePicker />
      </Grid>
      <Grid lg={2} md={6} xs={12} paddingBlockStart={5} paddingInlineStart={2}>
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
                  setSortBy(e.target.value)
                }}
                style={{width: '150px', paddingBlock: 3, marginTop: 2, borderRadius: 10}}
                defaultValue={'total_price'}
              >
                <MenuItem value="total_price" selected>Umumiy narx</MenuItem>
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
          rules={{ required: false }}
        />
      </Grid>
      <Grid item lg={2} md={4} xs={12}>
        <TextInput
          name="b"
          control={control}
          type="number"
          label={t("B")}
          rules={{ required: false }}
        />
      </Grid>
      <Grid item lg={2} md={4} xs={12}>
        <TextInput
          name="c"
          control={control}
          type="number"
          label={t("C")}
          rules={{ required: false }}
        />
      </Grid>
    </Grid>
  );

  return (
    <>
      <Table
        columns={columns}
        dataUrl="report/abc"
        headerChildren={renderHeader}
        isGetAll
        exQueryParams={{
          a: watch('a'),
          b: watch('b'),
          c: watch('c'),
          sortBy: sortBy || "total_price",
          dateFrom: allParams.dateFrom,
          dateTo: allParams.dateTo,
        }}
      />
    </>
  );
};

export default Client;
