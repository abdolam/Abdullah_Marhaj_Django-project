import { useCallback, useEffect, useState } from "react";
import { listArticles } from "../services/articles";
import { Link } from "react-router-dom";
import SkeletonCard from "../components/SkeletonCard";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listArticles(page, search);
      setArticles(data.results);
      setTotalPages(Math.ceil(data.count / 5));
    } catch {
      setError("לא ניתן להתחבר לשרת. נסה שוב מאוחר יותר.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  function handleSubmit(e) {
    e.preventDefault();
    loadArticles();
  }
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-xl font-semibold">כל כתבות</h1>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש כתבות"
          className="flex-1 rounded-lg border px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          חפש
        </button>
      </form>

      {loading && (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="mt-10 text-center text-slate-500 space-y-2">
          <div className="text-lg">לא נמצאו כתבות</div>
          <div className="text-sm">נסה לשנות חיפוש או חזור מאוחר יותר</div>
        </div>
      )}

      <ul className="space-y-3">
        {articles.map((a) => (
          <li
            key={a.id}
            className="rounded-xl border p-4 transition hover:shadow-md hover:border-slate-300"
          >
            <h2 className="font-medium">
              <Link className="hover:underline" to={`/articles/${a.id}`}>
                {a.title}
              </Link>
            </h2>
            <div className="text-sm text-slate-500">
              {a.author_name} ·{" "}
              {new Date(a.published_at).toLocaleDateString("he-IL")}
            </div>
            <p className="mt-2 text-sm">{a.content.slice(0, 120)}...</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="rounded-lg border px-4 py-1 text-sm transition hover:bg-slate-100 disabled:opacity-40"
        >
          הקודם
        </button>

        <span className="px-2 text-sm">
          עמוד {page} מתוך {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-lg border px-4 py-1 text-sm transition hover:bg-slate-100 disabled:opacity-40"
        >
          הבא
        </button>
      </div>
    </div>
  );
}
