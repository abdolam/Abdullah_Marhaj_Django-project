import { api, setAccessToken, clearAccessToken } from "./api";

export async function login({ email, password }) {
  const res = await api.post("/token/", { email, password });
  const access = res.data?.access;
  if (access) setAccessToken(access);
  return res.data;
}

export async function getMe() {
  const res = await api.get("/me/");
  return res.data;
}

export async function register({ username, email, password }) {
  const res = await api.post("/register/", { username, email, password });
  return res.data;
}

export function logout() {
  clearAccessToken();
}
