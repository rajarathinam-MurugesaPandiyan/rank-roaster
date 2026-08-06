import axios from "axios";
import { getCookie, eraseCookie } from "../helpers/cookies";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getCookie("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      eraseCookie("token");
      eraseCookie("currentUser");
      eraseCookie("studentUser");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentSchool");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
