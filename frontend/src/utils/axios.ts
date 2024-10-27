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
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: access_token ? `Bearer ${access_token}` : undefined,
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

// Interceptor to handle token refresh logic
apiInstance.interceptors.response.use(
  (response) => response, // Successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 (Unauthorized) and this is not a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Flag to prevent infinite retry loops

      try {
        // Try refreshing the token
        const newAccessToken = await getRefreshToken(refresh_token as string);
        if (newAccessToken) {
          // Update access token in cookies and request headers
          Cookies.set("access_token", newAccessToken);
          apiInstance.defaults.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new token
          return apiInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        // Handle token refresh failure (e.g., logout user, redirect to login, etc.)
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default apiInstance;
