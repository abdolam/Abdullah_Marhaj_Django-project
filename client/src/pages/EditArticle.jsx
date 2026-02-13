import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArticle, updateArticle } from "../services/articles";
import { useToast } from "../services/useToast";
import SkeletonCard from "../components/SkeletonCard";

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getArticle(id);
        setTitle(data.title);
        setContent(data.content);
      } catch {
        showToast("לא ניתן לטעון כתבה", "error");
        navigate("/articles");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, navigate, showToast]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    try {
      setSaving(true);

      await updateArticle(id, {
        title: title.trim(),
        content: content.trim(),
      });

      showToast("הכתבה עודכנה בהצלחה", "success");
      navigate(`/articles/${id}`);
    } catch {
      showToast("לא ניתן לעדכן כתבה", "error");
    } finally {
      setSaving(false);
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

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-semibold">עריכת כתבה</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm mb-1">כותרת</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border p-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">תוכן</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg border p-3 min-h-37.5"
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          שמור שינויים
        </button>
      </form>
    </div>
  );
}
