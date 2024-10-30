import axios from "axios";
import Cookies from "js-cookie";
import { getRefreshToken } from "./auth";
import { useAuthStore } from "../store/auth";

const getCookie = (name: string) => {
  const value = Cookies.get(name);
  return value ? value : null;
};

const apiInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${getCookie("access_token") || ""}`,
  },
  withCredentials: true,
});

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getCookie("refresh_token");
        if (!refreshToken) {
          return Promise.reject(error);
        }
        const response = await getRefreshToken(refreshToken);
        const { accessToken, refreshToken: newRefreshToken } = response;

        // Update cookies and headers
        Cookies.set("access_token", accessToken);
        Cookies.set("refresh_token", newRefreshToken);

        apiInstance.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return apiInstance(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        useAuthStore.getState().setUser(null);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
