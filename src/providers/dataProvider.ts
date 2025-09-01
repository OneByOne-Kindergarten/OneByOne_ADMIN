import { apiCallWithRetry } from "@/utils/api";
import { API_PATHS } from "@/config/api";
import type { PaginatedResponse } from "@/config/api";

// 리소스별 ID 필드 매핑
const ID_FIELD_MAP: Record<string, string> = {
  users: "userId",
  community: "communityId",
  inquiries: "inquiryId",
  work_reviews: "workReviewId",
  internship_reviews: "internshipReviewId",
};

// 범용 ID 매핑 함수
const normalizeId = (item: any, resource: string): any => {
  const idField = ID_FIELD_MAP[resource];

  if (idField && item[idField]) {
    return { ...item, id: item[idField] };
  }

  if (item.id) {
    return item;
  }

  // 자동으로 ID 필드 찾기
  const possibleIdFields = Object.keys(item).filter(
    (key) => key.toLowerCase().includes("id") && typeof item[key] === "number"
  );

  if (possibleIdFields.length > 0) {
    return { ...item, id: item[possibleIdFields[0]] };
  }

  console.warn(`No ID field found for ${resource}:`, item);
  return { ...item, id: Date.now() + Math.random() };
};

// 리소스별 API 경로 매핑
const getResourcePath = (resource: string, params?: any): string => {
  const pathMap: Record<string, string> = {
    users: API_PATHS.USERS.BASE,
    inquiries: API_PATHS.INQUIRY.ALL,
    community: API_PATHS.COMMUNITY.BASE,
    notices: API_PATHS.NOTICE.BASE,
    reports: API_PATHS.REPORT.BASE,
    favorites: API_PATHS.FAVORITE.BASE,
    notifications: API_PATHS.NOTIFICATION.MY,
  };

  // 리뷰는 kindergartenId가 필수이므로 특별 처리
  if (resource === "work_reviews" && params?.kindergartenId) {
    return API_PATHS.REVIEWS.WORK.LIST(params.kindergartenId);
  }
  if (resource === "internship_reviews" && params?.kindergartenId) {
    return API_PATHS.REVIEWS.INTERNSHIP.LIST(params.kindergartenId);
  }

  return pathMap[resource] || `/${resource}`;
};

// 정렬 파라미터 변환
const formatSortParam = (field: string, order: string): string => {
  return `${field},${order.toLowerCase()}`;
};

// 필터 파라미터 변환
const formatFilterParams = (
  filter: Record<string, unknown>
): Record<string, string> => {
  const params: Record<string, string> = {};

  Object.entries(filter).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params[key] = String(value);
    }
  });

  return params;
};

export const dataProvider = {
  getList: async (resource: any, params: any) => {
    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
    const { field, order } = params.sort || { field: "id", order: "ASC" };

    // 리뷰 리소스인 경우 kindergartenId가 필수
    if (
      (resource === "work_reviews" || resource === "internship_reviews") &&
      !params.filter?.kindergartenId
    ) {
      throw new Error(
        "유치원 ID를 입력해주세요. 리뷰 조회를 위해서는 유치원 ID가 필요합니다."
      );
    }

    const queryParams = {
      page: String(page - 1), // 0-based pagination
      size: String(perPage),
      ...(field && order ? { sort: formatSortParam(field, order) } : {}),
      ...formatFilterParams(params.filter),
    };

    const path = getResourcePath(resource, params.filter);
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
      console.error(`Failed to fetch ${resource}:`, error);
      throw new Error(`${resource} 목록을 불러오는데 실패했습니다.`);
    }
  },

  getOne: async (resource: any, params: any) => {
    const basePath = getResourcePath(resource);
    const path =
      resource === "users"
        ? API_PATHS.USERS.DETAIL(parseInt(params.id))
        : resource === "inquiries"
        ? API_PATHS.INQUIRY.DETAIL(parseInt(params.id))
        : resource === "community"
        ? API_PATHS.COMMUNITY.DETAIL(parseInt(params.id))
        : `${basePath}/${params.id}`;

    try {
      const response = await apiCallWithRetry<void, unknown>({
        method: "GET",
        path,
      });

      // API 응답이 {success: true, data: {...}} 형태인지 확인
      const responseData = response as any;
      const data = responseData.data || responseData;

      // React-Admin은 모든 레코드에 id 필드가 있어야 함
      // API 응답의 실제 ID 필드를 id로 매핑
      const normalizedData = normalizeId(data, resource);

      return { data: normalizedData };
    } catch (error) {
      console.error(`Failed to fetch ${resource} ${params.id}:`, error);
      throw new Error(`${resource} 상세 정보를 불러오는데 실패했습니다.`);
    }
  },

  getMany: async (resource: any, params: any) => {
    // 여러 개 조회는 개별 요청으로 처리 (API에 batch 엔드포인트가 없을 경우)
    try {
      const promises = params.ids.map((id: any) =>
        apiCallWithRetry<void, unknown>({
          method: "GET",
          path: `${getResourcePath(resource)}/${id}`,
        })
      );

      const responses = await Promise.all(promises);
      const normalizedResponses = responses.map((response: any) => {
        const data = (response as any).data || response;
        return normalizeId(data, resource);
      });
      return { data: normalizedResponses };
    } catch (error) {
      console.error(`Failed to fetch multiple ${resource}:`, error);
      throw new Error(`${resource} 목록을 불러오는데 실패했습니다.`);
    }
  },

  getManyReference: async (resource: any, params: any) => {
    // getList와 동일한 로직이지만 참조 필터 추가
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const queryParams = {
      page: String(page - 1),
      size: String(perPage),
      ...(field && order ? { sort: formatSortParam(field, order) } : {}),
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

      return {
        data: response.content || [],
        total: response.totalElements || 0,
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

      return { data: { ...(params.data as any), ...(response as any) } };
    } catch (error) {
      console.error(`Failed to create ${resource}:`, error);
      throw new Error(`${resource} 생성에 실패했습니다.`);
    }
  },

  update: async (resource: any, params: any) => {
    const basePath = getResourcePath(resource);
    const path = `${basePath}/${params.id}`;

    try {
      const response = await apiCallWithRetry<unknown, unknown>({
        method: "PUT",
        path,
        data: params.data,
      });

      return { data: { ...(params.data as any), ...(response as any) } };
    } catch (error) {
      console.error(`Failed to update ${resource} ${params.id}:`, error);
      throw new Error(`${resource} 수정에 실패했습니다.`);
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

      return { data: response || { id: params.id } };
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
