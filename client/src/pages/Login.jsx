import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import { useToast } from "../services/useToast";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const isFormValid = email.trim() !== "" && password.trim() !== "";
  const { showToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });

      showToast("התחברת בהצלחה", "success");
      navigate("/");
    } catch (err) {
      if (!err.response) {
        showToast("לא ניתן להתחבר לשרת. נסה שוב מאוחר יותר.", "error");
      } else if (err.response.status === 401) {
        showToast("אימייל או סיסמה שגויים", "error");
      } else {
        showToast("אירעה שגיאה לא צפויה", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-right">
      <h2 className="mb-6 text-center text-2xl font-semibold">התחברות</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">אימייל</label>
          <input
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-900 focus:outline-none"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">סיסמה</label>
          <input
            dir="ltr"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-900 focus:outline-none"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full rounded-lg bg-slate-900 py-2 text-white transition
             hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "מתחבר..." : "התחבר"}
        </button>
      </form>
    </div>
  );
}

export default Login;
