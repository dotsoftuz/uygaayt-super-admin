import { Grid } from "@mui/material";
import { StoreCard } from "./StoreCard";
import { useApi } from "hooks/useApi/useApiHooks";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { StoreTabs } from "./TabPanel";
// localStorage importini olib tashlang
// import { getStoresFromLocalStorage } from "../utils/localStorageUtils";

const StoreInfo = () => {
  const { id } = useParams();

  // API'dan do'konni o'qish
  const { data: storeInfoData, status: storeInfoStatus } = useApi(
    `store/get-by-id/${id}`,
    {},
    {
      enabled: !!id,
      suspense: false,
    }
  );

  // localStorage kodini olib tashlang
  // const localStore = id?.startsWith('store_')
  //   ? getStoresFromLocalStorage().find((s) => s._id === id)
  //   : null;

  const store = storeInfoData?.data;

  return (
    <>
      {id && store && (
        <Grid className="grid lg:flex gap-4 p-2">
          <StoreCard
            storeInfoData={storeInfoData}
            storeId={id}
            onStatusChange={() => {}}
          />
          <StoreTabs storeId={id} store={store} />
        </Grid>
      )}
    </>
  );
};

export default StoreInfo;
