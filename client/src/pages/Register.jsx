import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth";
import { useToast } from "../services/useToast";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const isFormValid =
    username.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    password === confirmPassword;

  const passwordsMismatch =
    confirmPassword.trim() !== "" &&
    password.trim() !== "" &&
    password !== confirmPassword;

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      showToast("כל השדות חובה", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("הסיסמאות אינן תואמות", "error");
      return;
    }

    setLoading(true);
    try {
      await register({ username, email, password });
      showToast("נרשמת בהצלחה, ניתן להתחבר", "success");
      navigate("/login");
    } catch (err) {
      if (!err.response) {
        showToast("לא ניתן להתחבר לשרת. נסה שוב מאוחר יותר.", "error");
      } else if (err.response.status === 409) {
        showToast("שם המשתמש כבר תפוס", "error");
      } else if (err.response.status === 400) {
        showToast("נתונים לא תקינים. בדוק את הפרטים שהזנת.", "error");
      } else {
        showToast("אירעה שגיאה לא צפויה", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-right">
      <h2 className="mb-1  text-2xl text-center font-semibold">הרשמה</h2>
      <p className="mb-5  text-xs text-slate-500">כל השדות חובה</p>
      <form onSubmit={handleSubmit} className="space-y-4" dir="ltr">
        <div>
          <label className="mb-1 block text-sm font-medium">שם משתמש</label>
          <input
            dir="rtl"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-900 focus:outline-none"
            autoComplete="username"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">אימייל</label>
          <input
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-900 focus:outline-none"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">אימות סיסמה</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-900 focus:outline-none"
            autoComplete="new-password"
          />
          {passwordsMismatch ? (
            <p className="mt-1 text-xs text-red-600">הסיסמאות אינן תואמות</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full rounded-lg bg-slate-900 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "נרשם..." : "הרשם"}
        </button>
      </form>
    </div>
  );
}

export default Register;
