import axios, { AxiosInstance } from "axios";
import { isAccessTokenExpired, setAuthUser, getRefreshToken } from "./auth";
import { BASE_URL } from "./constants";
import Cookies from "js-cookie";

const useAxios = (): AxiosInstance => {
  const access_token = Cookies.get("access_token");
  const refresh_token = Cookies.get("refresh_token");

  const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: access_token ? { Authorization: `Bearer ${access_token}` } : {},
  });

  axiosInstance.interceptors.request.use(async (req) => {
    // Ensure the access_token exists and isn't expired
    if (access_token && !isAccessTokenExpired(access_token)) {
      return req;
    }

    // Handle token refresh if expired
    if (refresh_token) {
      const response = await getRefreshToken(refresh_token);
      setAuthUser(response.accessToken, response.refreshToken);

      // Modify the request to include the new access token
      if (req.headers) {
        req.headers.Authorization = `Bearer ${response.accessToken}`;
      }
    }

    return req;
  });

  return axiosInstance;
};

export default useAxios;
