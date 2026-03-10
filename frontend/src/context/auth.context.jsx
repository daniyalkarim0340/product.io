import { createContext, useState, useEffect, useLayoutEffect } from "react";
import { api } from "../Api/axiosinstance.js";
import authApi from "../Api/authApi.js";

export const AuthContext = createContext();

const getTokenFromResponse = (payload) =>
  payload?.accessToken ??
  payload?.token ??
  payload?.data?.accessToken ??
  payload?.data?.token ??
  null;

const getUserFromResponse = (payload) =>
  payload?.user ?? payload?.data?.user ?? null;

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("auth_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("access_token")
  );
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!accessToken; // 👈 fix: boolean

  // Request interceptor to add token
  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  // Response interceptor to refresh token
  useLayoutEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const failedRequest = error.config;
        if (error.response?.status === 401 && !failedRequest._retry) {
          failedRequest._retry = true;
          try {
            const res = await authApi.refreshToken();
            const token = getTokenFromResponse(res.data);
            if (!token) {
              throw new Error("No token found in refresh response");
            }
            setAccessToken(token);
            setUser(getUserFromResponse(res.data));
            failedRequest.headers.Authorization = `Bearer ${token}`;
            return api.request(failedRequest);
          } catch (err) {
            setAccessToken(null);
            setUser(null);
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    } else {
      localStorage.removeItem("access_token");
    }
  }, [accessToken]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  useEffect(() => {
    async function restoreSession() {
      const savedToken = localStorage.getItem("access_token");
      try {
        const res = await authApi.refreshToken();
        const token = getTokenFromResponse(res.data);
        if (!token) {
          throw new Error("No token found in refresh response");
        }
        setUser(getUserFromResponse(res.data));
        setAccessToken(token);
      } catch (error) {
        if (!savedToken) {
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
