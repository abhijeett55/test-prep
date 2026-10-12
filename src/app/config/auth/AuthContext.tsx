import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { TOKEN_KEY, USER_KEY } from "../../../app/api/client";
import { login as apiLogin } from "../../../app/api/auth/auth";
import type { Role } from "../../../app/api/auth/roleRouting";

export interface AuthUser {
  id: string;
  role: Role;
  full_name: string;
  must_change_password: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (role: Role, userId: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore from localStorage on mount.
  useEffect(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(raw) as AuthUser);
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,

      async login(role, userId, password) {
        // 👇 single call — API layer handles the role → endpoint mapping
        const data = await apiLogin(role, userId, password);

        localStorage.setItem(TOKEN_KEY, data.access_token);

        const authUser: AuthUser = {
          id: userId,
          role,
          full_name: data.full_name,
          must_change_password: data.must_change_password,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        setUser(authUser);
        return authUser;
      },

      logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}