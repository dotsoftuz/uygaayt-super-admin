import { Grid } from "@mui/material";
import { TransactionStyled } from "./Transaction.styled";
import { RangeDatePicker, Table } from "components";
import { useTransactionColumns } from "./transaction.columns";
import { useApi } from "hooks/useApi/useApiHooks";
import { numberFormat } from "utils/numberFormat";
import useCommonContext from "context/useCommon";
import { get } from "lodash";

const Transaction = () => {
  const columns = useTransactionColumns();

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

  const { data } = useApi("balance/total");

  return (
    <TransactionStyled>
      <Grid container spacing={2} mb={2}>
        <Grid item sm={6}>
          <div className="total-balance">
            <span className="amount">
              {numberFormat(data?.data.amount)}{" "}
              {get(settingsData, "currency", "uzs")}
            </span>
            <span className="text">umumiy balansi</span>
          </div>
        </Grid>
        <Grid item sm={6}>
          <div className="balance">
            <div className="amount-wrapper">
              <span className="title">Umumiy to'ldirilgan miqdor:</span>
              <span className="amount">
                {numberFormat(data?.data.income)}{" "}
                {get(settingsData, "currency", "uzs")}
              </span>
            </div>
            <div className="amount-wrapper">
              <span className="title">Umumiy chiqarilgan miqdor:</span>
              <span className="amount">
                {numberFormat(data?.data.expence)}{" "}
                {get(settingsData, "currency", "uzs")}
              </span>
            </div>
          </div>
        </Grid>
      </Grid>
      <Table
        columns={columns}
        dataUrl="balance/transactions"
        headerChildren={renderHeader}
      />
    </TransactionStyled>
  );
};

export default Transaction;
