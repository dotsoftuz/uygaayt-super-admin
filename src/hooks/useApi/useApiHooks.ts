import { AxiosResponse, Method } from "axios";
import {
  setButtonDisable,
  setOpenDrawer,
} from "components/elements/FormDrawer/formdrawer.slice";
import { reRenderTable } from "components/elements/Table/reducer/table.slice";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "react-query";
import { toast } from "react-toastify";
import api from "services/client/client";
import { useAppDispatch } from "./../../store/storeHooks";
import { pickBy } from "lodash";
import { useTranslation } from "react-i18next";

const useApi = <Data = any, Error = any>(
  url: string,
  params: object = {},
  options: UseQueryOptions<AxiosResponse<Data>, Error> & { toast?: boolean } = {
    toast: true,
  }
) => {
  return useQuery(
    [url, params],
    async () => {
      try {
        const response = await api.get<Data>(url, { params });
        return response;
        // @ts-ignore
      } catch (error: AxiosResponse<Data>) {
        if (error?.statusCode === 401) {
          localStorage.clear();
          if (window.location.pathname !== "/login")
            window.location.replace("/login");
          return error;
        }
        if (options.toast) {
          toast.error(error?.message || "server error");
        }
        return {
          data: [],
        };
      }
    },
    // @ts-ignore
    {
      ...options,
    }
  );
};

const useApiMutation = <
  Variables = any,
  Response = any,
  Error extends { message?: string } = {}
>(
  url: string,
  method: Method,
  options: UseMutationOptions<AxiosResponse<Response>, Error, Variables> = {},
  withoutNotification?: boolean
): ReturnType<
  typeof useMutation<AxiosResponse<Response>, Error, Variables>
> => {
  const dis = useAppDispatch();
  const { t } = useTranslation();

  return useMutation<AxiosResponse<Response>, Error, Variables>(
    (data) => {
      const response = api({ url, method, data });
      return response;
    },
    {
      onError(error) {
        toast.error(error?.message || method + "ed, no response");
      },
      onMutate() {
        dis(setButtonDisable(true));
      },
      onSuccess(data) {
        if (!withoutNotification) {
          toast.success(t("general.success"));
        }
        dis(setOpenDrawer(false));
        dis(reRenderTable(true));
      },
      onSettled(data, error, variables, context) {
        dis(setButtonDisable(false));
      },
      ...options,
    }
  );
};

const useApiWithId = <
  Variables = {
    id: string;
    body?: any;
  },
  Response = any,
  Error = any
>(
  url: string,
  method: Method,
  options: UseMutationOptions<AxiosResponse<Response>, Error, Variables> = {}
) =>
  useMutation<AxiosResponse<Response>, Error, Variables>(
    ({ id, body }: any) => {
      url = id ? `${url}/${id}` : url;
      const response = api({ url, method, data: pickBy(body, Boolean) });
      return response;
    },
    // @ts-ignore
    { ...options }
  );

export { useApi, useApiMutation, useApiWithId };
