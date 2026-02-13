import { api } from "./api";

export async function createArticle(data) {
  const res = await api.post("/articles/", data);
  return res.data;
}

export async function getArticle(id) {
  const res = await api.get(`/articles/${id}/`);
  return res.data;
}

export async function updateArticle(id, data) {
  const res = await api.put(`/articles/${id}/`, data);
  return res.data;
}

export async function deleteArticle(id) {
  await api.delete(`/articles/${id}/`);
}

export async function listArticles(page = 1, search = "") {
  const res = await api.get("/articles/", {
    params: { page, search },
  });
  return res.data;
}

export async function listLatestArticles(limit = 3) {
  const res = await api.get("/articles/");
  return res.data.slice(0, limit);
}
