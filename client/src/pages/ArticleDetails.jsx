import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getArticle, deleteArticle } from "../services/articles";
import {
  listArticleComments,
  createArticleComment,
  deleteComment,
  updateComment,
} from "../services/comments";
import { useAuth } from "../services/useAuth";
import { useToast } from "../services/useToast";
import ConfirmModal from "../components/ConfirmModal";
import SkeletonCard from "../components/SkeletonCard";

export default function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthed, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [confirmArticleDelete, setConfirmArticleDelete] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [a, c] = await Promise.all([
        getArticle(id),
        listArticleComments(id),
      ]);

      setArticle(a);
      setComments(c);
    } catch {
      setError("לא ניתן להתחבר לשרת. נסה שוב מאוחר יותר.");
      setArticle(null);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSending(true);

      const newComment = await createArticleComment(id, commentText.trim());

      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      showToast("התגובה נוספה בהצלחה");
    } catch {
      showToast("לא ניתן להוסיף תגובה");
    } finally {
      setSending(false);
    }
  }

  async function confirmDelete() {
    try {
      await deleteComment(confirmId);
      setComments((prev) => prev.filter((c) => c.id !== confirmId));
      showToast("התגובה נמחקה");
    } catch {
      showToast("לא ניתן למחוק תגובה");
    } finally {
      setConfirmId(null);
    }
  }

  async function handleUpdate(commentId) {
    if (!editingText.trim()) return;

    try {
      const updated = await updateComment(commentId, editingText.trim());

      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updated : c)),
      );

      setEditingId(null);
      setEditingText("");
      showToast("התגובה עודכנה בהצלחה");
    } catch {
      showToast("לא ניתן לעדכן תגובה");
    }
  }

  async function confirmArticleDeletion() {
    try {
      await deleteArticle(article.id);
      showToast("הכתבה נמחקה בהצלחה");
      navigate("/articles");
    } catch {
      showToast("לא ניתן למחוק כתבה");
    } finally {
      setConfirmArticleDelete(false);
    }
  }

  if (loading)
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        {error}
      </div>
    );
  }

  if (!article) {
    return <div className="text-slate-500">כתבה לא נמצאה</div>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/articles"
        className="mb-4 inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900"
      >
        <span aria-hidden="true">→</span>
        חזרה לכתבות
      </Link>

      <h1 className="text-xl font-semibold">{article.title}</h1>

      <div className="mt-1 text-sm text-slate-500">
        {article.author_name} ·{" "}
        {new Date(article.published_at).toLocaleDateString("he-IL")}
      </div>

      <div className="mt-4 whitespace-pre-wrap leading-7 text-slate-800">
        {article.content}
      </div>

      {/* ✅ כפתורי אדמין */}
      {isAdmin && (
        <div className="mt-4 flex gap-4">
          <Link
            to={`/articles/${article.id}/edit`}
            className="text-sm text-blue-600 hover:underline"
          >
            ערוך כתבה
          </Link>

          <button
            onClick={() => setConfirmArticleDelete(true)}
            className="text-sm text-red-600 hover:underline"
          >
            מחק כתבה
          </button>
        </div>
      )}

      <h2 className="mt-8 text-lg font-semibold">תגובות</h2>

      {isAuthed ? (
        <form onSubmit={handleSubmit} className="mt-3 space-y-2">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="כתוב תגובה..."
            disabled={sending}
            required
          />
          <button
            type="submit"
            disabled={sending || !commentText.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            שלח תגובה
          </button>
        </form>
      ) : (
        <div className="mt-2 text-sm text-slate-500">
          יש להתחבר כדי להוסיף תגובה
        </div>
      )}

      {comments.length === 0 ? (
        <div className="mt-4 text-slate-500">אין תגובות</div>
      ) : (
        <ul className="mt-4 space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="rounded-lg border p-3 relative">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">{c.username}</div>

                {isAuthed && (c.is_owner || isAdmin) && (
                  <div className="flex gap-3 text-xs">
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditingText(c.content);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      עריכה
                    </button>

                    <button
                      onClick={() => setConfirmId(c.id)}
                      className="text-red-600 hover:underline"
                    >
                      מחיקה
                    </button>
                  </div>
                )}
              </div>

              {editingId === c.id ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full rounded-lg border p-2"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(c.id)}
                      className="rounded bg-blue-600 px-3 py-1 text-white text-xs"
                    >
                      שמור
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingText("");
                      }}
                      className="rounded bg-slate-200 px-3 py-1 text-xs"
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-1">{c.content}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {new Date(c.created_at).toLocaleString("he-IL")}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Confirm מחיקת תגובה */}
      <ConfirmModal
        open={confirmId !== null}
        title="מחיקת תגובה"
        message="האם אתה בטוח שברצונך למחוק את התגובה?"
        confirmText="מחיקה"
        cancelText="ביטול"
        onCancel={() => setConfirmId(null)}
        onConfirm={confirmDelete}
      />

      {/* Confirm מחיקת כתבה */}
      <ConfirmModal
        open={confirmArticleDelete}
        title="מחיקת כתבה"
        message="האם אתה בטוח שברצונך למחוק את הכתבה?"
        confirmText="מחיקה"
        cancelText="ביטול"
        onCancel={() => setConfirmArticleDelete(false)}
        onConfirm={confirmArticleDeletion}
      />
    </div>
  );
}
