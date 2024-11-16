import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const useRequest = <
  TResponse extends any = any,
  TBody = any,
  TUpdateBody = any
>(
  defaultValue: any = undefined
): [
  {
    get: (url: string) => Promise<any>;
    post: (url: string, data: TBody) => Promise<any>;
    put: (url: string, data: TBody | TUpdateBody) => Promise<any>;
    deleteRequest: (url: string, data?: any) => Promise<any>;
  },
  TResponse | undefined, // ! DataType<TResponse | undefined>
  TStatuses,
  any
] => {
  const navigate = useNavigate();
  const [data, setData] = useState<TResponse | undefined>();
  const [status, setStatus] = useState<TStatuses>(REQUEST_STATUS.initial);
  const [error, setError] = useState<any>();
  const language = localStorage.getItem("i18nextLng") || "uz";

  const get = async (url: string) => await sendRequest("get", url);

  const post = async (url: string, data: TBody) =>
    await sendRequest("post", url, data);

  const put = async (url: string, data: TBody | TUpdateBody) =>
    await sendRequest("put", url, data);

  const deleteRequest = async (url: string, data: any) =>
    await sendRequest("delete", url);

  const sendRequest = async (
    method: TApiRequestMetod,
    url: string,
    data?: any
  ) => {
    setStatus(REQUEST_STATUS.loading);
    try {
      const res = await axios.get(
        "http://localhost:50000/api/Identification/DataFromService"
      );
      if (res.status === 401) {
        navigate("/login");
      }
      setData(res?.data);
      setStatus(REQUEST_STATUS.success);
      if (method !== "get") {
        if (
          res.data &&
          url !== "tariffs/price" &&
          url !== "order" &&
          url !== "message"
        ) {
          toast.success(res?.data?.message);
        }
      }

      return res.data;
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return navigate("/login");
      }
      setError(err);
      setStatus(REQUEST_STATUS.failed);
    }
  };
  const methods = {
    get,
    post,
    put,
    deleteRequest,
  };
  return [methods, data, status, error];
};
interface DataType<T> {
  code: number;
  message: string;
  data: T;
}
type TableDataType<T> = { data: T[]; total: number };

type TApiRequestMetod = "get" | "post" | "put" | "delete";
type TStatuses = "INITIAL" | "SUCCESS" | "FAILED" | "LOADING";

const REQUEST_STATUS = {
  initial: "INITIAL",
  success: "SUCCESS",
  failed: "FAILED",
  loading: "LOADING",
} as const;

const ERROR_MESSAGES: any = {
  uz: {
    10002: "Ruxsat yo'q",
    10004: "Balans yetarli emas",
    13002: "Hodimlari mavjud",
    13003: "Haydovchilari mavjud",
    13004: "Buyurtmalari mavjud",
  },
  ru: {
    10002: "Нет разрешения",
    10004: "Баланс недостаточен",
    13002: "Есть сотрудники",
    13003: "Драйверы доступны",
    13004: "Заказы доступны",
  },
};
