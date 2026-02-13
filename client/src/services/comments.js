import { api } from "./api";

export async function listArticleComments(articleId) {
  const res = await api.get(`/articles/${articleId}/comments/`);
  return res.data;
}

export async function createArticleComment(articleId, content) {
  const res = await api.post(`/articles/${articleId}/comments/`, {
    content,
  });
  return res.data;
}

export async function updateComment(commentId, content) {
  const res = await api.put(`/comments/${commentId}/`, { content });
  return res.data;
}

export async function deleteComment(commentId) {
  await api.delete(`/comments/${commentId}/`);
}
