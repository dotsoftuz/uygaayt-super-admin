import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";

const useClearQueryParams = () => {
  const [searchParams, setParams] = useSearchParams();
  const allParams = useAllQueryParams();
  useEffect(() => {
    Object.keys(allParams).forEach((key) => {
      searchParams.delete(key);
    });
    setParams(searchParams);
  }, []);
  return searchParams;
};
export default useClearQueryParams;
