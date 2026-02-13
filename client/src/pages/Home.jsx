import { useEffect, useState } from "react";
import { listArticles } from "../services/articles";
import { Link } from "react-router-dom";
import SkeletonCard from "../components/SkeletonCard";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(searchValue = "") {
    try {
      setLoading(true);
      setError("");

      const data = await listArticles(1, searchValue);
      setArticles(data.results);
      setVisibleCount(3);
    } catch {
      setError("לא ניתן להתחבר לשרת.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    load(search.trim());
  }

  const visibleArticles = articles.slice(0, visibleCount);

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

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold mb-4">כתבות אחרונות</h1>

      {/* חיפוש */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חפש כתבה..."
          className="flex-1 rounded-lg border px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          חפש
        </button>
      </form>

      {visibleArticles.length === 0 ? (
        <div className="text-slate-500">אין כתבות להצגה</div>
      ) : (
        <ul className="space-y-3">
          {visibleArticles.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border p-4 transition hover:shadow-md hover:border-slate-300"
            >
              <Link
                to={`/articles/${a.id}`}
                className="text-lg font-medium hover:underline"
              >
                {a.title}
              </Link>

              <div className="mt-1 text-sm text-slate-500">
                {a.author_name} ·{" "}
                {new Date(a.published_at).toLocaleDateString("he-IL")}
              </div>

              <div className="mt-2 text-sm text-slate-600 line-clamp-2">
                {a.content}
              </div>
            </li>
          ))}
        </ul>
      )}

      {visibleCount < articles.length && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="rounded-lg bg-slate-200 px-4 py-2 hover:bg-slate-300"
          >
            הצג עוד
          </button>
          <Link
            to="/articles"
            className="text-sm text-blue-600 hover:underline"
          >
            מעבר לרשימת כל הכתבות
          </Link>
        </div>
      )}
    </div>
  );
}
