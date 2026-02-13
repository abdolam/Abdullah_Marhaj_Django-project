import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Token helpers
export function getAccessToken() {
  return localStorage.getItem("access_token");
}

export function setAccessToken(token) {
  localStorage.setItem("access_token", token);
  window.dispatchEvent(new Event("auth:token-changed"));
}

export function clearAccessToken() {
  localStorage.removeItem("access_token");
  window.dispatchEvent(new Event("auth:token-changed"));
}

// Attach Authorization header automatically
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.code;
    const detail = error?.response?.data?.detail;

    const isTokenError =
      code === "token_not_valid" || detail?.toLowerCase?.().includes("token");

    if ((status === 401 || status === 403) && isTokenError) {
      clearAccessToken();
    }

    return Promise.reject(error);
  },
);
