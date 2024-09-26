/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from "../store/auth";
import axios from "./axios";
import { jwtDecode } from "jwt-decode"; // Ensure you're using correct import for jwtDecode
import Cookies from "js-cookie";

// Type for login response
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// Type for user data during signup
interface UserData {
  email: string;
  password: string;
  [key: string]: any; // additional fields (if needed)
}

// Login function
export const login = async (
  email: string,
  password: string
): Promise<{ data: LoginResponse | null; error: string | null }> => {
  try {
    const { data, status } = await axios.post<LoginResponse>("auth/login", {
      email,
      password,
    });

    if (status === 200) {
      setAuthUser(data.accessToken, data.refreshToken);
    }

    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: error.response?.data?.detail || "Something went wrong",
    };
  }
};

// Signup function
export const signup = async (
  userData: UserData
): Promise<{ data: LoginResponse | null; error: string | null }> => {
  try {
    // Make sure to send all necessary data to the signup endpoint
    await axios.post("auth/register/", {
      ...userData,
    });

    // Extract email and password from the provided userData
    const { email, password } = userData;

    // Perform the login after a successful signup
    const loginResponse = await login(email, password);

    return { data: loginResponse.data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: error.response?.data?.detail || "Something went wrong",
    };
  }
};

// Logout function
export const logout = (): void => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  useAuthStore.getState().setUser(null);
};

// Set user function
export const setUser = async (): Promise<void> => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return;
  }

  if (isAccessTokenExpired(accessToken)) {
    const response = await getRefreshToken(refreshToken);
    setAuthUser(response.access, response.refresh);
  } else {
    setAuthUser(accessToken, refreshToken);
  }
};

// Set auth user
export const setAuthUser = (
  access_token: string,
  refresh_token: string
): void => {
  Cookies.set("access_token", access_token, {
    expires: 1,
    secure: true,
  });
  Cookies.set("refresh_token", refresh_token, {
    expires: 7,
    secure: true,
  });

  const user: { userId: string; username: string } = jwtDecode(access_token);

  if (user) {
    useAuthStore.getState().setUser(user);
  }
  useAuthStore.getState().setLoading(false);
};

// Get refresh token function
export const getRefreshToken = async (refresh_token: string) => {
  const response = await axios.post("auth/refresh-token", {
    refresh: refresh_token,
  });

  return response.data;
};

// Check if access token is expired
export const isAccessTokenExpired = (accessToken: string): boolean => {
  try {
    const decodedToken: { exp?: number } = jwtDecode(accessToken); // Safely define exp as optional

    if (decodedToken.exp === undefined) {
      return true; // If there's no expiration field, consider it expired
    }

    return decodedToken.exp < Date.now() / 1000;
  } catch (error) {
    console.error(error);
    return true; // In case of an error (invalid token), treat it as expired
  }
};