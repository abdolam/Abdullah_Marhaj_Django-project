import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { getAccessToken } from "./api";
import { logout as logoutService, getMe } from "./auth";

export function AuthProvider({ children }) {
  const [accessToken, setAccessTokenState] = useState(getAccessToken());
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = getAccessToken();
        if (!token) {
          setUser(null);
          return;
        }

        const data = await getMe();
        setUser(data);
      } catch {
        setUser(null);
      }
    }

    loadUser();
  }, [accessToken]);

  useEffect(() => {
    function onTokenChanged() {
      setAccessTokenState(getAccessToken());
    }

    window.addEventListener("auth:token-changed", onTokenChanged);
    return () =>
      window.removeEventListener("auth:token-changed", onTokenChanged);
  }, []);

  function logout() {
    logoutService();
    setAccessTokenState(null);
    setUser(null);
  }

  const value = {
    isAuthed: Boolean(accessToken),
    accessToken,
    user,
    isAdmin: Boolean(user?.is_staff),
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
