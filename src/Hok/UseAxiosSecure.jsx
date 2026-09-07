import axios from "axios";
import React, { useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router";

const axiosecure = axios.create({
  baseURL: "http://localhost:3000",
});

const UseAxiosSecure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = axiosecure.interceptors.request.use(
      async (config) => {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    const responseInterceptor = axiosecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          await auth.signOut();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosecure.interceptors.request.eject(requestInterceptor);
      axiosecure.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return axiosecure;
};

export default UseAxiosSecure;
