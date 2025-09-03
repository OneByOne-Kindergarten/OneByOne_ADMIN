import type { AuthProvider } from "react-admin";
import { apiCall } from "@/utils/api";
import { API_PATHS } from "@/config/api";

export const authProvider: AuthProvider = {
  // 실제 API를 사용한 로그인 (간단한 에러 처리)
  login: async ({ username, password }) => {
    try {
      // 로그인 API 호출
      const response = await apiCall<
        { email: string; password: string; fcmToken: string },
        { accessToken: string; refreshToken: string }
      >({
        method: "POST",
        path: API_PATHS.USERS.SIGN_IN,
        data: {
          email: username,
          password,
          fcmToken: "admin-dashboard",
        },
        withAuth: false,
      });

      // 토큰 저장
      localStorage.setItem("admin_token", response.accessToken);
      localStorage.setItem("admin_logged_in", "true");

      // 간단한 사용자 정보 저장 (API 호출 없이)
      localStorage.setItem(
        "admin_user",
        JSON.stringify({
          id: 1,
          email: username,
          nickname: "관리자",
          role: "ADMIN",
        })
      );

      return Promise.resolve();
    } catch (error: any) {
      // 간단한 에러 처리
      const errorMessage = error?.message || "로그인에 실패했습니다.";
      return Promise.reject(new Error(errorMessage));
    }
  },

  // 로그아웃
  logout: () => {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_token");
    return Promise.resolve();
  },

  // 인증 확인 (API 호출 없음)
  checkAuth: () => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    return isLoggedIn === "true" ? Promise.resolve() : Promise.reject();
  },

  // 에러 처리 - 401 오류 시 자동 로그아웃
  checkError: (error) => {
    const status = error?.status || error?.response?.status;

    if (status === 401 || status === 403) {
      // 인증 만료 시 자동 로그아웃
      localStorage.removeItem("admin_logged_in");
      localStorage.removeItem("admin_user");
      localStorage.removeItem("admin_token");
      return Promise.reject({ redirectTo: "/login" });
    }

    return Promise.resolve();
  },

  // 권한 확인
  getPermissions: () => Promise.resolve(["admin"]),

  // 사용자 정보
  getIdentity: () => {
    const userData = localStorage.getItem("admin_user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return Promise.resolve({
          id: user.id,
          fullName: user.nickname,
          avatar: undefined,
        });
      } catch {
        // 파싱 실패 시 기본값
      }
    }

    return Promise.resolve({
      id: "admin",
      fullName: "관리자",
      avatar: undefined,
    });
  },
};
