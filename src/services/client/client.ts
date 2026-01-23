import axios from "axios";
import React from "react";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://165.227.153.9/v1",
});
// Handle all configuration of request
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["Accept-Language"] = localStorage.getItem("i18nextLng");
    // #region agent log
    if (config.url?.includes("balance/paging")) {
      fetch(
        "http://127.0.0.1:7242/ingest/ce1c437f-4b53-45a3-b9ea-6cfa04072735",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "client.ts:8",
            message: "API request interceptor",
            data: {
              url: config.url,
              method: config.method,
              data: config.data,
              hasToken: !!token,
              baseURL: config.baseURL,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "B,D",
          }),
        },
      ).catch(() => {});
    }
    // #endregion
    // config.headers["storeId"] = localStorage.getItem("storeId");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle errors of all responses
api.interceptors.response.use(
  (response) => response.data,
  (err) => {
    // #region agent log
    if (err.config?.url?.includes("balance/paging")) {
      fetch(
        "http://127.0.0.1:7242/ingest/ce1c437f-4b53-45a3-b9ea-6cfa04072735",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "client.ts:27",
            message: "API response error",
            data: {
              url: err.config?.url,
              status: err.response?.status,
              statusText: err.response?.statusText,
              data: err.response?.data,
              message: err.message,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "A,B,C,D",
          }),
        },
      ).catch(() => {});
    }
    // #endregion
    if (err?.message === "Network Error") {
      // setIsNetworkErr(true);
      return Promise.reject({
        message:
          "Network Error: Unable to connect to server. Please check your internet connection.",
        statusCode: 0,
        data: null,
      });
    }
    return Promise.reject(
      err.response?.data || {
        message: err?.message || "An error occurred",
        statusCode: err?.response?.status || 500,
        data: null,
      },
    );
  },
);

// Determine the percentage of uploading
export const apiProgress = (
  progressEvent: any,
  setProgress: React.Dispatch<React.SetStateAction<number>>,
) => {
  let percentCompleted = Math.floor(
    (progressEvent.loaded * 100) / progressEvent.total,
  );
  setProgress(percentCompleted);
};

export default api;
