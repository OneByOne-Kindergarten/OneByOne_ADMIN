export const API_PATHS = {
  USERS: {
    BASE: "/users",
    SIGN_IN: "/users/sign-in",
    WITHDRAW: "/users/withdraw",
    BLOCK_LIST: "/blocks/list",
    BLOCK_USER: "/blocks",
    UNBLOCK_USER: (email: string) => `/blocks/${email}`,
  },

  // 사용자 관리
  ADMIN: {
    USERS: {
      LIST: "/admin/users",
      DETAIL: (userId: number) => `/admin/users/${userId}`,
      SEARCH: "/admin/users/search",
    },
  },

  // 유치원 관리
  KINDERGARTEN: {
    BASE: "/kindergarten",
    DETAIL: (id: number) => `/kindergarten/${id}`,
    SIMPLE: (id: number) => `/kindergarten/${id}/simple`,
    NEARBY: "/kindergarten/nearby",
  },

  // 문의 관리
  INQUIRY: {
    BASE: "/inquiry",
    ALL: "/inquiry/all",
    MY: "/inquiry/my",
    DETAIL: (id: number) => `/inquiry/${id}`,
    STATUS: (status: string) => `/inquiry/status/${status}`,
    CLOSE: (id: number) => `/inquiry/${id}/close`,
    ANSWER: (id: number) => `/inquiry/${id}/answer`,
  },

  // 커뮤니티 관리
  COMMUNITY: {
    BASE: "/community",
    DETAIL: (id: number) => `/community/${id}`,
    DELETE: (id: number) => `/community/${id}`,
    LIKE: (id: number) => `/community/${id}/like`,
    TOP: "/community/top",
    COMMENT: {
      BASE: (postId: number) => `/community/${postId}/comment`,
      ALL: (postId: number) => `/community/${postId}/comment/all`,
      DELETE: (commentId: number) => `/comment/${commentId}`,
    },
  },

  // 리뷰 관리
  REVIEWS: {
    WORK: {
      BASE: "/work/review",
      LIST: (kindergartenId: number) => `/work/reviews/${kindergartenId}`,
      LIKE: (reviewId: number) => `/work/review/${reviewId}/like`,
    },
    INTERNSHIP: {
      BASE: "/internship/review",
      LIST: (kindergartenId: number) => `/internship/reviews/${kindergartenId}`,
      LIKE: (reviewId: number) => `/internship/review/${reviewId}/like`,
    },
  },

  // 공지사항 관리
  NOTICE: {
    BASE: "/notice",
    ADMIN: "/admin/notice",
    DETAIL: (noticeId: number) => `/admin/notice/${noticeId}`,
    PUBLIC_STATUS: (noticeId: number) =>
      `/admin/notice/${noticeId}/public-status`,
  },

  // 신고 관리
  REPORT: {
    BASE: "/report",
    MY: "/report/my",
    ADMIN: "/admin/report",
    DETAIL: (reportId: number) => `/admin/report/${reportId}`,
    STATUS: (reportId: number) => `/admin/report/${reportId}/status`,
  },

  // 즐겨찾기 관리
  FAVORITE: {
    BASE: "/favorite-kindergartens",
    STATUS: "/favorite-kindergartens/status",
  },

  // 알림 관리
  NOTIFICATION: {
    MY: "/notification/my",
    UNREAD_COUNT: "/notification/my/unread/count",
    READ: (id: number) => `/notification/${id}/read`,
    READ_ALL: "/notification/my/read-all",
    SETTINGS: "/users/notification-settings",
  },

  // 토큰 관리
  AUTH: {
    REISSUE: "/users/reissue",
    FIND_PASSWORD: "/users/email-certification",
    CHECK_EMAIL: "/users/check-email-certification",
    RESET_PASSWORD: "/users/temporary-password",
  },
};

// API 기본 설정
export const API_CONFIG = {
  BASE_URL: import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_URL || "",
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
};

// 응답 데이터 타입 정의
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}
