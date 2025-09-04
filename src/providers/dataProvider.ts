import { apiCallWithRetry } from "@/utils/api";
import { API_PATHS } from "@/config/api";
import type { PaginatedResponse } from "@/config/api";
import type { DataProvider } from "react-admin";

// 리소스별 ID 필드 매핑
const ID_FIELD_MAP: Record<string, string> = {
  users: "userId",
  kindergartens: "kindergartenId",
  community: "communityId",
  inquiries: "inquiryId",
  reports: "reportId",
  notices: "noticeId",
  "work-reviews": "workReviewId",
  "internship-reviews": "internshipReviewId",
};

// 리뷰 리소스 확인 함수
const isReviewResource = (resource: string): boolean => {
  return resource === "work-reviews" || resource === "internship-reviews";
};

// 존재하지 않는 리소스 확인 함수
const isNonExistentResource = (resource: string): boolean => {
  return resource === "targets";
};

// 범용 ID 매핑 함수
const normalizeId = (
  item: any,
  resource: string,
  requestedId?: string | number
): any => {
  // 에러 응답인 경우 먼저 처리
  if (item?.code && item?.message) {
    console.error(`API Error for ${resource}:`, item);
    throw new Error(
      item.message || `${resource} API 호출 중 오류가 발생했습니다.`
    );
  }

  const idField = ID_FIELD_MAP[resource];

  // 1. 지정된 ID 필드가 있는 경우
  if (idField && item[idField] !== undefined && item[idField] !== null) {
    return { ...item, id: item[idField] };
  }

  // 2. 기존 id 필드가 있는 경우
  if (item.id !== undefined && item.id !== null) {
    return item;
  }

  // 3. requestedId가 있는 경우 (getOne, update 등에서 사용)
  if (requestedId !== undefined && requestedId !== null) {
    return { ...item, id: requestedId };
  }

  // 4. 자동으로 ID 필드 찾기
  const possibleIdFields = Object.keys(item).filter(
    (key) =>
      key.toLowerCase().includes("id") &&
      typeof item[key] === "number" &&
      item[key] > 0
  );

  if (possibleIdFields.length > 0) {
    return { ...item, id: item[possibleIdFields[0]] };
  }

  // 5. ID가 없어도 에러 발생시키지 않고 임시 ID 생성
  const tempId = Date.now() + Math.random();
  console.warn(
    `No ID field found for ${resource}, using temporary ID: ${tempId}`
  );
  return { ...item, id: tempId };
};

// 리소스별 API 경로 매핑
const getResourcePath = (resource: string, params?: any): string => {
  const pathMap: Record<string, string> = {
    users: API_PATHS.ADMIN.USERS.LIST,
    kindergartens: API_PATHS.KINDERGARTEN.BASE,
    inquiries: API_PATHS.INQUIRY.ALL,
    community: API_PATHS.COMMUNITY.BASE,
    reports: API_PATHS.REPORT.ADMIN,
    notices: API_PATHS.NOTICE.ADMIN,
    favorites: API_PATHS.FAVORITE.BASE,
    notifications: API_PATHS.NOTIFICATION.MY,
  };

  // 특별한 경로 처리
  if (resource === "inquiries" && params?.status) {
    return API_PATHS.INQUIRY.STATUS(params.status);
  }

  // 사용자 검색 API 사용 조건
  if (resource === "users" && hasSearchParams(params)) {
    return API_PATHS.ADMIN.USERS.SEARCH;
  }

  // 리뷰 리소스 처리
  if (isReviewResource(resource)) {
    return getReviewPath(resource, params);
  }

  return pathMap[resource] || `/${resource}`;
};

// 검색 파라미터 확인 함수
const hasSearchParams = (params: any): boolean => {
  return (
    params &&
    (params.email ||
      params.nickname ||
      params.role ||
      params.provider ||
      params.status)
  );
};

// 리뷰 경로 생성 함수
const getReviewPath = (resource: string, params?: any): string => {
  const kindergartenId = params?.filter?.kindergartenId;

  if (kindergartenId) {
    return resource === "work-reviews"
      ? API_PATHS.REVIEWS.WORK.LIST(kindergartenId)
      : API_PATHS.REVIEWS.INTERNSHIP.LIST(kindergartenId);
  }

  // kindergartenId가 없으면 더미 경로 반환
  return resource === "work-reviews"
    ? "/work/reviews/0"
    : "/internship/reviews/0";
};

// 쿼리 파라미터 생성 함수
const buildQueryParams = (
  resource: string,
  params: any
): Record<string, string> => {
  const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
  const { field, order } = params.sort || { field: "id", order: "ASC" };

  const baseParams = {
    page: String(page - 1), // 0-based pagination
    size: String(perPage),
  };

  // 리뷰 리소스는 정렬 파라미터 제외
  if (isReviewResource(resource)) {
    return {
      ...baseParams,
      ...formatFilterParams(params.filter),
    };
  }

  // 신고 리소스는 searchDTO 형태로 전송
  if (resource === "reports") {
    const searchDTO: any = {};
    if (params.filter?.status) searchDTO.status = params.filter.status;
    if (params.filter?.targetType)
      searchDTO.targetType = params.filter.targetType;

    return {
      ...baseParams,
      ...(Object.keys(searchDTO).length > 0
        ? { searchDTO: JSON.stringify(searchDTO) }
        : {}),
    };
  }

  // 기본 리소스
  return {
    ...baseParams,
    ...(field && order ? { sort: `${field},${order.toLowerCase()}` } : {}),
    ...formatFilterParams(params.filter),
  };
};

// 필터 파라미터 변환
const formatFilterParams = (
  filter?: Record<string, unknown>
): Record<string, string> => {
  if (!filter) return {};

  const params: Record<string, string> = {};
  Object.entries(filter).forEach(([key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      key !== "kindergartenId"
    ) {
      params[key] = String(value);
    }
  });
  return params;
};

// kindergartenId 유효성 검증
const isValidKindergartenId = (kindergartenId: any): boolean => {
  return (
    kindergartenId &&
    kindergartenId !== "" &&
    kindergartenId !== null &&
    kindergartenId !== undefined &&
    String(kindergartenId).trim() !== "" &&
    !isNaN(Number(kindergartenId)) &&
    Number(kindergartenId) > 0
  );
};

// API 응답 처리
const processListResponse = (response: any, resource: string) => {
  const responseData = response.data || response;
  const normalizedData = (responseData.content || responseData || []).map(
    (item: any) => normalizeId(item, resource)
  );

  return {
    data: normalizedData,
    total:
      responseData.totalElements ||
      response.totalElements ||
      normalizedData.length ||
      0,
  };
};

// 에러 처리
const handleApiError = (error: any, defaultMessage: string): never => {
  console.error(defaultMessage, error);

  if (error?.status === 401) {
    throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
  }

  throw new Error(defaultMessage);
};

// 상세 조회 경로 생성
const getDetailPath = (resource: string, id: string | number): string => {
  const pathMap: Record<string, (id: number) => string> = {
    users: API_PATHS.ADMIN.USERS.DETAIL,
    inquiries: API_PATHS.INQUIRY.DETAIL,
    community: API_PATHS.COMMUNITY.DETAIL,
    kindergartens: API_PATHS.KINDERGARTEN.DETAIL,
    reports: API_PATHS.REPORT.DETAIL,
  };

  if (pathMap[resource]) {
    return pathMap[resource](parseInt(String(id)));
  }

  // 리뷰 리소스 처리
  if (resource === "work-reviews") {
    return `${API_PATHS.REVIEWS.WORK.BASE}/${id}`;
  }
  if (resource === "internship-reviews") {
    return `${API_PATHS.REVIEWS.INTERNSHIP.BASE}/${id}`;
  }

  return `/${resource}/${id}`;
};

// 업데이트 요청 구성
const buildUpdateRequest = (resource: string, params: any) => {
  // 신고 상태 업데이트 - PATCH로 상태만 변경 (쿼리 파라미터 사용)
  if (resource === "reports") {
    return {
      path: `${API_PATHS.REPORT.STATUS(parseInt(params.id))}?status=${
        params.data.status
      }`,
      method: "PATCH",
      data: undefined, // body 없이 쿼리 파라미터만 사용
    };
  }

  // 공지사항 공개 상태 변경
  if (
    resource === "notices" &&
    ("public" in params.data || "isPublic" in params.data)
  ) {
    return {
      path: API_PATHS.NOTICE.PUBLIC_STATUS(parseInt(params.id)),
      method: "PATCH",
      data: {
        isPublic:
          params.data.public !== undefined
            ? params.data.public
            : params.data.isPublic,
      },
    };
  }

  // 기본 업데이트
  return {
    path: `${getResourcePath(resource)}/${params.id}`,
    method: "PUT",
    data: params.data,
  };
};

export const dataProvider: DataProvider = {
  getList: async (resource: any, params: any) => {
    // 리뷰 리소스의 경우 kindergartenId 검증
    if (
      isReviewResource(resource) &&
      !isValidKindergartenId(params.filter?.kindergartenId)
    ) {
      return Promise.resolve({
        data: [{ id: "_placeholder_", _isPlaceholder: true }],
        total: 1,
      });
    }

    const queryParams = buildQueryParams(resource, params);
    const path = getResourcePath(resource, params);
    const fullPath = `${path}?${new URLSearchParams(queryParams).toString()}`;

    try {
      const response = await apiCallWithRetry<void, PaginatedResponse<unknown>>(
        {
          method: "GET",
          path: fullPath,
        }
      );

      return processListResponse(response, resource);
    } catch (error) {
      return handleApiError(
        error,
        `${resource} 목록을 불러오는데 실패했습니다.`
      );
    }
  },

  getOne: async (resource: any, params: any) => {
    // 존재하지 않는 리소스 처리
    if (isNonExistentResource(resource)) {
      throw new Error("Targets 리소스는 존재하지 않습니다.");
    }

    // 공지사항은 상세 조회 API가 없으므로 에러 처리
    if (resource === "notices") {
      throw new Error("공지사항 상세 조회 기능은 지원되지 않습니다.");
    }

    const path = getDetailPath(resource, params.id);

    try {
      const response = await apiCallWithRetry<void, unknown>({
        method: "GET",
        path,
      });

      const responseData = response as any;
      const data = responseData.data || responseData;
      const normalizedData = normalizeId(data, resource, params.id);

      return { data: normalizedData };
    } catch (error) {
      return handleApiError(
        error,
        `${resource} 상세 정보를 불러오는데 실패했습니다.`
      );
    }
  },

  getMany: async (resource: any, params: any) => {
    // 존재하지 않는 리소스에 대한 처리
    if (isNonExistentResource(resource)) {
      console.warn("Targets resource does not exist, returning empty data");
      return { data: [] };
    }

    try {
      const promises = params.ids.map((id: any) =>
        apiCallWithRetry<void, unknown>({
          method: "GET",
          path: getDetailPath(resource, id),
        }).then((response) => ({ response, requestedId: id }))
      );

      const responses = await Promise.all(promises);
      const normalizedResponses = responses.map(({ response, requestedId }) => {
        const data = (response as any).data || response;
        return normalizeId(data, resource, requestedId);
      });

      return { data: normalizedResponses };
    } catch (error) {
      return handleApiError(
        error,
        `${resource} 목록을 불러오는데 실패했습니다.`
      );
    }
  },

  getManyReference: async (resource: any, params: any) => {
    // getList와 동일한 로직이지만 참조 필터 추가
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const queryParams = {
      page: String(page - 1),
      size: String(perPage),
      ...(field && order ? { sort: `${field},${order.toLowerCase()}` } : {}),
      [params.target]: String(params.id),
      ...formatFilterParams(params.filter),
    };

    const path = getResourcePath(resource);
    const queryString = new URLSearchParams(queryParams).toString();
    const fullPath = `${path}?${queryString}`;

    try {
      const response = await apiCallWithRetry<void, PaginatedResponse<unknown>>(
        {
          method: "GET",
          path: fullPath,
        }
      );

      // API 응답이 래핑된 형태인지 확인
      const responseData = (response as any).data || response;

      // 각 레코드에 id 필드 매핑
      const normalizedData = (responseData.content || responseData || []).map(
        (item: any) => normalizeId(item, resource)
      );

      return {
        data: normalizedData,
        total:
          responseData.totalElements ||
          response.totalElements ||
          normalizedData.length ||
          0,
      };
    } catch (error) {
      console.error(`Failed to fetch ${resource} reference:`, error);
      throw new Error(`${resource} 참조 목록을 불러오는데 실패했습니다.`);
    }
  },

  create: async (resource: any, params: any) => {
    const path = getResourcePath(resource);

    try {
      const response = await apiCallWithRetry<unknown, unknown>({
        method: "POST",
        path,
        data: params.data,
      });

      // API 응답에서 실제 데이터 추출
      const responseData = response as any;
      const actualData = responseData.data || responseData;

      const data = { ...params.data, ...actualData };
      return { data: normalizeId(data, resource) };
    } catch (error) {
      console.error(`Failed to create ${resource}:`, error);
      throw new Error(`${resource} 생성에 실패했습니다.`);
    }
  },

  update: async (resource: any, params: any) => {
    const { path, method, data } = buildUpdateRequest(resource, params);

    try {
      const response = await apiCallWithRetry<unknown, unknown>({
        method: method as any,
        path,
        data,
      });

      // API 응답에서 실제 데이터 추출
      const responseData = response as any;
      const actualData = responseData.data || responseData;

      // 신고 업데이트의 경우 처리
      if (resource === "reports") {
        const resultData = {
          ...params.data,
          id: params.id, // 요청한 ID를 직접 사용
          ...(actualData || {}),
        };
        return { data: resultData };
      }

      // 일반적인 처리
      const resultData = { ...params.data, ...actualData };
      return { data: normalizeId(resultData, resource, params.id) };
    } catch (error) {
      return handleApiError(error, `${resource} 수정에 실패했습니다.`);
    }
  },

  updateMany: async (resource: any, params: any) => {
    const basePath = getResourcePath(resource);

    try {
      const promises = params.ids.map((id: any) =>
        apiCallWithRetry<unknown, unknown>({
          method: "PUT",
          path: `${basePath}/${id}`,
          data: params.data,
        })
      );

      await Promise.all(promises);
      return { data: params.ids };
    } catch (error) {
      console.error(`Failed to update multiple ${resource}:`, error);
      throw new Error(`${resource} 일괄 수정에 실패했습니다.`);
    }
  },

  delete: async (resource: any, params: any) => {
    const basePath = getResourcePath(resource);
    const path =
      resource === "community"
        ? API_PATHS.COMMUNITY.DELETE(parseInt(params.id))
        : `${basePath}/${params.id}`;

    try {
      const response = await apiCallWithRetry<void, unknown>({
        method: "DELETE",
        path,
      });

      const data = (response as any) || { id: params.id };
      return { data: normalizeId(data, resource) };
    } catch (error) {
      console.error(`Failed to delete ${resource} ${params.id}:`, error);
      throw new Error(`${resource} 삭제에 실패했습니다.`);
    }
  },

  deleteMany: async (resource: any, params: any) => {
    const basePath = getResourcePath(resource);

    try {
      const promises = params.ids.map((id: any) =>
        apiCallWithRetry<void, unknown>({
          method: "DELETE",
          path: `${basePath}/${id}`,
        })
      );

      await Promise.all(promises);
      return { data: params.ids };
    } catch (error) {
      console.error(`Failed to delete multiple ${resource}:`, error);
      throw new Error(`${resource} 일괄 삭제에 실패했습니다.`);
    }
  },
};
