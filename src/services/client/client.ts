import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:3003/v1",
});
// Handle all configuration of request
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["Accept-Language"] = localStorage.getItem("i18nextLng");
    // config.headers["storeId"] = localStorage.getItem("storeId");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors of all responses
api.interceptors.response.use(
  (response) => response.data,
  (err) => {
    if (err?.message === "Network Error") {
      // setIsNetworkErr(true);
      return Promise.reject(null);
    }
    return Promise.reject(err.response?.data);
  }
);

// Determine the percentage of uploading
export const apiProgress = (
  progressEvent: any,
  setProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  let percentCompleted = Math.floor(
    (progressEvent.loaded * 100) / progressEvent.total
  );
  setProgress(percentCompleted);
};

export default api;
