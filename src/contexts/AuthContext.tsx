import { useState, useEffect, type ReactNode } from "react";
import { apiCall } from "@/utils/api";
import { API_PATHS } from "@/config/api";
import { AuthContext, type User } from "./AuthContextDefinition";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 페이지 로드 시 저장된 인증 정보 확인
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");
      const savedUser = localStorage.getItem("admin_user");

      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          if (userData.role === "ADMIN") {
            setUser(userData);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Failed to parse saved user:", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // 로그인 API 호출
      const response = await apiCall<
        { email: string; password: string; fcmToken: string },
        { accessToken: string; refreshToken: string }
      >({
        method: "POST",
        path: API_PATHS.USERS.SIGN_IN,
        data: {
          email,
          password,
          fcmToken: "admin-dashboard",
        },
        withAuth: false,
      });

      localStorage.setItem("admin_token", response.accessToken);

      // 사용자 정보 조회
      const userInfo = await apiCall<
        void,
        { user: { role: string; nickname: string; userId: number } }
      >({
        method: "GET",
        path: API_PATHS.USERS.BASE,
        withAuth: true,
      });

      // 관리자 권한 확인
      if (userInfo.user.role !== "ADMIN") {
        localStorage.removeItem("admin_token");
        throw new Error("관리자 권한이 필요합니다.");
      }

      const userData: User = {
        id: userInfo.user.userId,
        email,
        nickname: userInfo.user.nickname,
        role: userInfo.user.role,
      };

      setUser(userData);
      localStorage.setItem("admin_user", JSON.stringify(userData));
      localStorage.setItem("admin_logged_in", "true");
    } catch (error) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      localStorage.removeItem("admin_logged_in");
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_logged_in");
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
