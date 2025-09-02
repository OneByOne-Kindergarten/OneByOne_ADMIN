import type { AuthProvider } from "react-admin";
import { apiCall } from "@/utils/api";
import { API_PATHS } from "@/config/api";
import { setAdminToken, removeAdminToken, getAdminToken } from "@/utils/api";

interface ApiLoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      const response = await apiCall<
        { email: string; password: string; fcmToken: string },
        ApiLoginResponse
      >({
        method: "POST",
        path: API_PATHS.USERS.SIGN_IN,
        data: {
          email: username,
          password,
          fcmToken: "admin-dashboard",
        },
        withAuth: false,
        withCredentials: true,
      });

      setAdminToken(response.accessToken);

      // 사용자 정보 조회하여 어드민 권한 확인
      const userInfo = await apiCall<
        void,
        { user: { role: string; nickname: string; userId: number } }
      >({
        method: "GET",
        path: API_PATHS.USERS.BASE,
        withAuth: true,
      });

      if (userInfo.user.role !== "ADMIN") {
        console.log(userInfo);
        removeAdminToken();
        throw new Error("관리자 권한이 없습니다.");
      }

      // 어드민 인증 정보 저장
      localStorage.setItem(
        "adminAuth",
        JSON.stringify({
          user: {
            id: userInfo.user.userId,
            email: username,
            nickname: userInfo.user.nickname,
            role: userInfo.user.role,
            permissions: ["admin"],
          },
          refreshToken: response.refreshToken,
          loginTime: new Date().toISOString(),
        })
      );

      // 로그인 완료 플래그 설정
      localStorage.setItem("admin_logged_in", "true");

      return Promise.resolve();
    } catch (error) {
      console.error("Admin login failed:", error);
      removeAdminToken();
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("admin_logged_in");

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error(
        "관리자 로그인에 실패했습니다. 관리자 권한이 있는 계정으로 로그인해주세요."
      );
    }
  },

  // 로그아웃 처리
  logout: async () => {
    try {
      // 서버에 로그아웃 요청 (옵션)
      // await apiCall({ method: "POST", path: "/admin/auth/logout" });
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      removeAdminToken();
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("admin_logged_in");
    }

    return Promise.resolve();
  },

  // 인증 상태 확인 - 처음 진입시 항상 로그인 페이지 표시
  checkAuth: () => {
    // 로컬 스토리지에서 로그인 완료 플래그 확인
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    const token = getAdminToken();
    const adminAuth = localStorage.getItem("adminAuth");

    // 명시적으로 로그인 완료되었고, 토큰과 인증 정보가 모두 있는 경우만 통과
    if (isLoggedIn === "true" && token && adminAuth) {
      try {
        const authData = JSON.parse(adminAuth);
        if (authData.user?.role === "ADMIN") {
          return Promise.resolve();
        }
      } catch {
        // 파싱 오류시 재로그인 필요
        localStorage.removeItem("admin_logged_in");
      }
    }

    // 그 외 모든 경우 로그인 페이지로
    return Promise.reject();
  },

  // 오류 처리
  checkError: (error) => {
    const status = error.status;

    if (status === 401 || status === 403) {
      return Promise.reject();
    }

    return Promise.resolve();
  },

  // 사용자 권한 확인
  getPermissions: () => {
    const authData = localStorage.getItem("adminAuth");

    if (authData) {
      try {
        const { user } = JSON.parse(authData);
        return Promise.resolve(user.permissions || ["admin"]);
      } catch (error) {
        console.error("Failed to parse auth data:", error);
      }
    }

    return Promise.resolve([]);
  },

  // 사용자 정보 가져오기 - localStorage만 사용
  getIdentity: () => {
    const authData = localStorage.getItem("adminAuth");
    if (authData) {
      try {
        const { user } = JSON.parse(authData);
        return Promise.resolve({
          id: user.id,
          fullName: user.nickname || "관리자",
          avatar: undefined,
        });
      } catch {
        // JSON 파싱 오류 시 기본값 반환
      }
    }

    return Promise.resolve({
      id: "admin",
      fullName: "관리자",
      avatar: undefined,
    });
  },
};
