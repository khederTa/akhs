import axios from "axios";
import Cookies from "js-cookie";

const access_token = Cookies.get("access_token");
const refresh_token = Cookies.get("refresh_token");

const apiInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: access_token ? `Bearer ${access_token}` : undefined,
  },
});

export default apiInstance;
