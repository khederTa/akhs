// import axios from "axios";
// import Cookies from "js-cookie";

// const access_token = Cookies.get("access_token");
// const refresh_token = Cookies.get("refresh_token");

// const apiInstance = axios.create({
//   baseURL: "http://localhost:3000/api/v1/",
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     Authorization: access_token ? `Bearer ${access_token}` : undefined,
//   },
// });

// export default apiInstance;

import axios from "axios";
import Cookies from "js-cookie";
import { getRefreshToken } from "./auth";

// Function to safely get cookies
const getCookie = (name: string) => {
  const value = Cookies.get(name);
  return value ? value : null;
};

const access_token = getCookie("access_token");
const refresh_token = getCookie("refresh_token");

const apiInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: access_token ? `Bearer ${access_token}` : undefined,
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

// Interceptor to handle token refresh logic
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await getRefreshToken(refresh_token as string);
      Cookies.set("access_token", newAccessToken);
      apiInstance.defaults.headers[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return apiInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
