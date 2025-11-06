import { Grid } from "@mui/material";
import { StoreCard } from './StoreCard';
import { useApi } from "hooks/useApi/useApiHooks";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { StoreTabs } from "./TabPanel";
import { getStoresFromLocalStorage } from "../utils/localStorageUtils";

const StoreInfo = () => {
  const { id } = useParams();
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // API'dan do'konni o'qish (agar localStorage'dan bo'lmasa)
  const { data: storeInfoData, status: storeInfoStatus } = useApi(
    `store/get-by-id/${id}`,
    {},
    {
      enabled: !!id && !id?.startsWith('store_'),
      suspense: false
    }
  );

  // localStorage'dan do'konni o'qish (agar localStorage'dan bo'lsa)
  const localStore = id?.startsWith('store_')
    ? getStoresFromLocalStorage().find((s) => s._id === id)
    : null;

  const store = localStore || storeInfoData?.data;

  return (
    <>
      {id && store && (
        <Grid className="grid lg:flex gap-4 p-2">
          <StoreCard
            storeInfoData={storeInfoData}
            storeId={id}
            onStatusChange={() => setReloadTrigger(prev => prev + 1)}
          />
          <StoreTabs storeId={id} store={store} />
        </Grid>
      )}
    </>
  );
};

export default StoreInfo;

