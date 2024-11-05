import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { callApi, errorResponse } from "./config";
import { errorNotify } from "./components/ToastAlert";

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  fetchUserInfo: (token: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchUserInfo(storedToken); // Fetch user info if token exists
    }
  }, []);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await callApi<any>(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/user/personal-info/${token}`,
        "GET",
        undefined,
        {
          Authorization: `${token}`,
        }
      );
      setUser(response?.data);
    } catch (err) {
      errorNotify(errorResponse(err));
    }
  };

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    fetchUserInfo(newToken); // Fetch user info after login
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, login, logout, fetchUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
