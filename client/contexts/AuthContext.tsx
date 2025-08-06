"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useApolloClient, useMutation, useLazyQuery } from "@apollo/client";
import { LOGIN, SIGNUP } from "@/graphql/mutation";
import { ME } from "@/graphql/queries";
import { User } from "@/schema/schema";

interface AuthContextType {
  user: User | null;
  setUser: (user: any) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (username: string, password: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const client = useApolloClient();

  const [getMe] = useLazyQuery(ME, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.me) setUser(data.me);
    },
    onError: () => {
      setUser(null);
    },
  });

  const [loginMutation] = useMutation(LOGIN);
  const [signupMutation] = useMutation(SIGNUP);

  // Run on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [getMe]);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await loginMutation({
        variables: { username, password },
      });
      if (data?.login?.token) {
        localStorage.setItem("token", data.login.token);
        await getMe();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const signup = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await signupMutation({
        variables: { username, password },
      });
      if (data?.signup?.token) {
        localStorage.setItem("token", data.signup.token);
        await getMe();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Signup failed:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    client.clearStore();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isLoading , setUser}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
