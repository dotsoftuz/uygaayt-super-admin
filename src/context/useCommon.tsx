import { useApi } from "hooks/useApi/useApiHooks";
import React, { FC, createContext, useContext } from "react";

const useCommon = () => {
  const { data, status } = useApi(
    `settings-general`,
    {},
    {
      enabled: true, // Set this to true to fetch data initially
      staleTime: 60000, // Data will be considered stale after 60 seconds (adjust as needed)
    }
  );

  return {
    state: {
      data: data?.data,
    },
    actions: {},
  };
};

const CommonContext = createContext<any>({ state: {}, actions: {} });

export const CommonProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useCommon();
  return (
    <CommonContext.Provider value={value}>{children}</CommonContext.Provider>
  );
};
export default function useCommonContext() {
  return useContext<ReturnType<typeof useCommon>>(CommonContext);
}
