import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: `${backend_url}/api/v1`,
  withCredentials: true,
});
