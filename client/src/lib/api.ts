import axios from "axios";
import { auth } from "@/lib/firebase";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log(
      "[API]",
      err.response?.status,
      err.response?.data ?? err.message,
    );
    return Promise.reject(err);
  },
);
