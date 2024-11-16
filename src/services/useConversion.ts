import { useApi } from "hooks/useApi/useApiHooks";
import { toast } from "react-toastify";

const useConversion = () => {
  const { data, status } = useApi<{
    data: any;
  }>("currency?limit=100&page=1");
  const convertite = ({
    currencyId,
    toCurrencyId,
    sum,
    config = {
      toFixed: 2,
    },
  }: {
    sum: number;
    currencyId: string;
    toCurrencyId: string;
    config?: {
      toFixed?: number;
    };
  }) => {
    if (currencyId === toCurrencyId) {
      // because currencies are the same
      return sum;
    }
    if (!currencyId || !toCurrencyId) {
      // toast.error("Ошыбка при конвертатции");
      return -1;
    }
    const currentCurrency = data?.data?.data?.find(
      (currency: any) => currency?._id === currencyId
    );
    const toCurrency = data?.data?.data?.find(
      (currency: any) => currency?._id === toCurrencyId
    );
    const rateToCurrency = toCurrency?.rates.find(
      (rate: any) => currencyId === rate.toCurrencyId
    )?.rate;
    // debugger;
    if (!rateToCurrency) {
      toast.error("Валюта не конвентировано!");
      return -1;
    } else {
      return (rateToCurrency * sum)?.toFixed(config.toFixed);
    }
  };

  return { convertite };
};

export default useConversion;
