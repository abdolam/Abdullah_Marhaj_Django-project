import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createArticle } from "../services/articles";
import { useToast } from "../services/useToast";

export default function CreateArticle() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    try {
      setSending(true);

      await createArticle({
        title: title.trim(),
        content: content.trim(),
      });

      showToast("הכתבה נוצרה בהצלחה");
      navigate("/articles");
    } catch {
      showToast("לא ניתן ליצור כתבה");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-semibold">יצירת כתבה</h1>

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
          disabled={sending || !title.trim() || !content.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          פרסם{" "}
        </button>
      </form>
    </div>
  );
}
