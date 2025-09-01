import type { AuthProvider } from "react-admin";
import { apiCall } from "@/utils/api";
import { API_PATHS } from "@/config/api";
import { setAdminToken, removeAdminToken, getAdminToken } from "@/utils/api";

// OneByOne API 로그인 응답 타입
interface ApiLoginResponse {
  accessToken: string;
  refreshToken: string;
}

// 사용자 프로필 타입
interface AdminProfile {
  id: number;
  username: string;
  fullName: string;
  role: string;
  permissions: string[];
  lastLoginAt: string;
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
          fcmToken: "string",
        },
        withAuth: false,
        withCredentials: true,
      });

      // 토큰 저장
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

      return Promise.resolve();
    } catch (error) {
      console.error("Admin login failed:", error);
      removeAdminToken();
      localStorage.removeItem("adminAuth");

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
      // 로컬 스토리지 정리
      removeAdminToken();
      localStorage.removeItem("adminAuth");
    }

    return Promise.resolve();
  },

  // 인증 상태 확인 (실제 OneByOne API 사용)
  checkAuth: async () => {
    const token = getAdminToken();

    if (!token) {
      // 토큰이 없으면 조용히 로그인 페이지로 리다이렉트
      return Promise.reject();
    }

    try {
      // 실제 OneByOne API로 사용자 정보 확인
      const userInfo = await apiCall<
        void,
        { user: { role: string; nickname: string; userId: number } }
      >({
        method: "GET",
        path: API_PATHS.USERS.BASE,
        withAuth: true,
      });

      // 관리자 권한 재확인
      if (userInfo.user.role !== "ADMIN") {
        removeAdminToken();
        localStorage.removeItem("adminAuth");
        return Promise.reject();
      }

      return Promise.resolve();
    } catch (error) {
      console.error("Auth check failed:", error);

      // 토큰이 만료된 경우 리프레시 시도
      const authData = localStorage.getItem("adminAuth");
      if (authData) {
        try {
          const { refreshToken } = JSON.parse(authData);
          await refreshAuthToken(refreshToken);

          // 리프레시 후 다시 권한 확인
          const userInfo = await apiCall<void, { user: { role: string } }>({
            method: "GET",
            path: API_PATHS.USERS.BASE,
            withAuth: true,
          });

          if (userInfo.user.role === "ADMIN") {
            return Promise.resolve();
          } else {
            throw new Error("권한 없음");
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }

      // 리프레시 실패 시 로그아웃
      removeAdminToken();
      localStorage.removeItem("adminAuth");
      return Promise.reject();
    }
  },

  // 오류 처리 (401, 403 등)
  checkError: (error) => {
    const status = error.status;

    if (status === 401) {
      // 인증 실패
      removeAdminToken();
      localStorage.removeItem("adminAuth");
      return Promise.reject();
    }

    if (status === 403) {
      // 권한 부족
      return Promise.reject();
    }

    if (status >= 500) {
      // 서버 오류
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

  // 사용자 정보 가져오기
  getIdentity: async () => {
    try {
      // 서버에서 최신 프로필 정보 가져오기
      const profile = await apiCall<void, AdminProfile>({
        method: "GET",
        path: API_PATHS.USERS.BASE,
        withAuth: true,
      });

      return Promise.resolve({
        id: profile.id,
        fullName: profile.fullName || profile.username,
        avatar: undefined, // 아바타 이미지가 있다면 추가
      });
    } catch (error) {
      console.error("Failed to get identity:", error);

      // 서버 요청 실패 시 로컬 저장소에서 정보 가져오기
      const authData = localStorage.getItem("adminAuth");
      if (authData) {
        try {
          const { user } = JSON.parse(authData);
          return Promise.resolve({
            id: user.id,
            fullName: user.username,
            avatar: undefined,
          });
        } catch (parseError) {
          console.error("Failed to parse auth data:", parseError);
        }
      }

      return Promise.reject(new Error("사용자 정보를 가져올 수 없습니다."));
    }
  },
};

// 토큰 리프레시 함수
async function refreshAuthToken(refreshToken: string): Promise<void> {
  try {
    const response = await apiCall<
      { refreshToken: string },
      { accessToken: string; refreshToken: string }
    >({
      method: "POST",
      path: API_PATHS.AUTH.REISSUE,
      data: { refreshToken },
      withAuth: false,
    });

    // 새 토큰들 저장
    setAdminToken(response.accessToken);

    // 어드민 인증 정보의 리프레시 토큰 업데이트
    const authData = localStorage.getItem("adminAuth");
    if (authData) {
      const parsed = JSON.parse(authData);
      parsed.refreshToken = response.refreshToken;
      localStorage.setItem("adminAuth", JSON.stringify(parsed));
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
}
