import { API_CONFIG } from "@/config/api";

// HTTP 클라이언트 유틸리티
interface ApiCallOptions<T> {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  data?: T;
  withAuth?: boolean;
  withCredentials?: boolean;
  timeout?: number;
}

class ApiError extends Error {
  status: number;
  statusText: string;
  data?: unknown;

  constructor(status: number, statusText: string, data?: unknown) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

// 토큰 관리
export const getAdminToken = (): string | null => {
  return (
    localStorage.getItem("admin_token") ||
    import.meta.env.VITE_ADMIN_TOKEN ||
    null
  );
};

export const setAdminToken = (token: string): void => {
  localStorage.setItem("admin_token", token);
};

export const removeAdminToken = (): void => {
  localStorage.removeItem("admin_token");
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API 호출 함수
export async function apiCall<TRequest, TResponse>({
  method,
  path,
  data,
  withAuth = true, // 어드민은 기본적으로 인증 필요
  withCredentials = false,
  timeout = API_CONFIG.TIMEOUT,
}: ApiCallOptions<TRequest>): Promise<TResponse> {
  const url = `${API_CONFIG.BASE_URL}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(withAuth ? getAuthHeaders() : {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const options: RequestInit = {
      method,
      headers,
      signal: controller.signal,
      ...(data && method !== "GET" ? { body: JSON.stringify(data) } : {}),
      ...(withCredentials ? { credentials: "include" } : {}),
    };

    const response = await fetch(url, options);
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData: unknown;

      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
          console.log("API Error (JSON):", errorData);
        }
      } catch (e) {
        console.log("Failed to parse error response:", e);
      }

      throw new ApiError(response.status, response.statusText, errorData);
    }

    // 204 No Content 처리
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return {} as TResponse;
    }

    // JSON 응답 파싱
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return {} as TResponse;
      }
    } catch {
      return {} as TResponse;
    }
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("요청 시간이 초과되었습니다.");
    }

    throw new Error("네트워크 오류가 발생했습니다.");
  }
}

// 재시도 로직이 포함된 API 호출
export async function apiCallWithRetry<TRequest, TResponse>(
  options: ApiCallOptions<TRequest>,
  retryCount: number = API_CONFIG.RETRY_COUNT
): Promise<TResponse> {
  let lastError: Error;

  for (let i = 0; i <= retryCount; i++) {
    try {
      return await apiCall<TRequest, TResponse>(options);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");

      // 4xx 오류는 재시도하지 않음
      if (
        error instanceof ApiError &&
        error.status >= 400 &&
        error.status < 500
      ) {
        throw error;
      }

      // 마지막 시도가 아니면 잠시 대기 후 재시도
      if (i < retryCount) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
  }

  throw lastError!;
}
