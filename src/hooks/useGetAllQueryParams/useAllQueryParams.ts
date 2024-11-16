import { useSearchParams } from "react-router-dom";

const useAllQueryParams = (): Record<string, string> => {
  const [searchParams] = useSearchParams();

  let params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};
export default useAllQueryParams;
