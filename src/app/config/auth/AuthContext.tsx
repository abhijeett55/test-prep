import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  login as apiLogin,
  fetchCurrentUser,
  logout as apiLogout,
  type CurrentUser,
} from "../../api/auth/auth";
import { tokenStorage } from "../../api/auth/client";

type AuthContextValue = {
  user: CurrentUser | null;
  loading: boolean;
  login: (userId: string, password: string) => Promise<CurrentUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const existingToken = tokenStorage.getAccess();
    if (!existingToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    fetchCurrentUser()
      .then(setUser)
      .catch(() => {
        tokenStorage.clear();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (userId: string, password: string) => {
    const tokenResponse = await apiLogin(userId, password);
    tokenStorage.set(tokenResponse.access_token, tokenResponse.refresh_token);
    const currentUser = await fetchCurrentUser();
    setUser(currentUser);
    return currentUser;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}