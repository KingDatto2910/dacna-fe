// dacna/hooks/use-auth.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// Chúng ta sẽ cần tạo các hàm API này trong 'lib/api.ts'
import { apiLogin, apiRegister, apiVerifyOtp } from "@/lib/auth-api";
import { LoginCredentials, RegisterData } from "@/lib/types"; // Sẽ định nghĩa

// 1. Định nghĩa kiểu dữ liệu User (đơn giản)
export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: "customer" | "admin" | "staff";
}

// 2. Định nghĩa kiểu dữ liệu cho Context
interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
}

// 3. Tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Tạo Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Bắt đầu ở true để kiểm tra local storage
  const router = useRouter();

  // 5. [QUAN TRỌNG] Kiểm tra đăng nhập khi tải trang
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("jwt_token");
      const storedUser = localStorage.getItem("auth_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to load auth state from storage", e);
      // Xóa dữ liệu hỏng
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("auth_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 6. Hàm Login
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const { token, user } = await apiLogin(credentials);

      setToken(token);
      setUser(user);

      localStorage.setItem("jwt_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));

      // Xóa dòng 'await mergeLocalCartToDb(token);' nếu có

      toast.success(`Welcome back, ${user.name}!`);
      router.push("/home");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 7. Hàm Register
  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      await apiRegister(data);
      toast.success(
        "Registration successful! Please check your email to verify."
      );
      // Chuyển sang trang xác minh
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 8. Hàm Verify OTP
  const verifyOtp = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      await apiVerifyOtp(email, otp);
      toast.success("Account verified successfully! You can now log in.");
      router.push("/"); // Chuyển về trang login
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 9. Hàm Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("auth_user");
    toast.success("Logged out successfully.");
    router.push("/"); // Về trang login
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    verifyOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 10. Tạo Hook (để dễ sử dụng)
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
