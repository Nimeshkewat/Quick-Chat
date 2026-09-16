import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { api } from "../lib/axios";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

type AuthUser = {
  _id: string;
  fullname: string;
  email: string;
  profilePic?: string;
  bio?: string;
};

type AuthContextType = {
  authUser: AuthUser | null;
  onlineUsers: string[];
  socket: Socket | null;
  isCheckingAuth: boolean;
  register: (data: {
    fullname: string;
    email: string;
    password: string;
    bio?: string;
  }) => Promise<boolean>;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (formData: FormData) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const connectSocket = (user: AuthUser) => {
    const newSocket = io(backendUrl, {
      query: { userId: user._id },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });
  };

  const checkAuth = async () => {
    try {
      const { data } = await api.get("/users/check-auth");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch {
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const register = async (payload: {
    fullname: string;
    email: string;
    password: string;
    bio?: string;
  }) => {
    try {
      const { data } = await api.post("/users/register", payload);
      if (data.success) {
        toast.success(data.message || "Account created");
        return true;
      }
      toast.error(data.message);
      return false;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return false;
    }
  };

  const login = async (payload: { email: string; password: string }) => {
    try {
      const { data } = await api.post("/users/login", payload);
      if (data.success) {
        await checkAuth();
        toast.success(data.message || "Logged in");
        return true;
      }
      toast.error(data.message);
      return false;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } finally {
      setAuthUser(null);
      setOnlineUsers([]);
      socket?.disconnect();
      setSocket(null);
      toast.success("Logged out");
    }
  };

  const updateProfile = async (formData: FormData) => {
    try {
      const { data } = await api.put("/users/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        onlineUsers,
        socket,
        isCheckingAuth,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
