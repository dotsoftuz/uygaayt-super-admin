import { Grid } from "@mui/material";
import { TransactionStyled } from "./Transaction.styled";
import { RangeDatePicker, Table } from "components";
import { useTransactionColumns } from "./transaction.columns";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { numberFormat } from "utils/numberFormat";
import useCommonContext from "context/useCommon";
import { get } from "lodash";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Transaction = () => {
  const columns = useTransactionColumns();
  const { t } = useTranslation();

  const {
    state: { data: settingsData },
  } = useCommonContext();

  const renderHeader = (
    <Grid container width={235} spacing={2}>
      <Grid item sm={6}>
        <RangeDatePicker />
      </Grid>
    </Grid>
  );


  const { mutate, data, reset } = useApiMutation("balance/total", "post", {
    onSuccess() {
      // toast.success(t("general.success"));
    },
  });



  useEffect(() => {
    mutate(data);
  }, [mutate]);


  return (
    <TransactionStyled>
      <Grid container spacing={2} mb={2}>
        <Grid item sm={6}>
          <div className="total-balance">
            <span className="amount">
              {numberFormat(data?.data?.storeBalance)}{" "}
              {get(settingsData, "currency", "uzs")}
            </span>
            <span className="text">{t('transaction.total_balance')}</span>
          </div>
        </Grid>
        <Grid item sm={6}>
          <div className="balance">
            <div className="amount-wrapper">
              <span className="title">{t('transaction.total_filled_amount')}:</span>
              <span className="amount">
                {numberFormat(data?.data?.income)}{" "}
                {get(settingsData, "currency", "uzs")}
              </span>
            </div>
            {/* <div className="amount-wrapper">
              <span className="title">Umumiy chiqarilgan miqdor:</span>
              <span className="amount">
                {numberFormat(data?.data?.expense)}{" "}
                {get(settingsData, "currency", "uzs")}
              </span>
            </div> */}
          </div>
        </Grid>
      </Grid>
      <Table
        columns={columns}
        dataUrl="balance/paging"
        headerChildren={renderHeader}
        exQueryParams={{}}
      />
    </TransactionStyled>
  );
};

export default Transaction;
