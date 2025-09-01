import { apiCallWithRetry } from "@/utils/api";
import { API_PATHS } from "@/config/api";
import type { PaginatedResponse } from "@/config/api";

// 리소스별 API 경로 매핑
const getResourcePath = (resource: string): string => {
  const pathMap: Record<string, string> = {
    users: API_PATHS.USERS.BASE,
    kindergartens: API_PATHS.KINDERGARTEN.BASE,
    inquiries: API_PATHS.INQUIRY.ALL,
    community: API_PATHS.COMMUNITY.BASE,
    reviews: API_PATHS.REVIEWS.WORK.BASE, // 근무 리뷰
    internship_reviews: API_PATHS.REVIEWS.INTERNSHIP.BASE, // 실습 리뷰
    notices: API_PATHS.NOTICE.BASE,
    reports: API_PATHS.REPORT.BASE,
    favorites: API_PATHS.FAVORITE.BASE,
    notifications: API_PATHS.NOTIFICATION.MY,
  };

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

    const queryParams = {
      page: String(page - 1), // 0-based pagination
      size: String(perPage),
      ...(field && order ? { sort: formatSortParam(field, order) } : {}),
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
      console.error(`Failed to fetch ${resource}:`, error);
      throw new Error(`${resource} 목록을 불러오는데 실패했습니다.`);
    }
  },

  getOne: async (resource: any, params: any) => {
    const basePath = getResourcePath(resource);
    const path =
      resource === "users"
        ? API_PATHS.USERS.DETAIL(parseInt(params.id))
        : resource === "kindergartens"
        ? API_PATHS.KINDERGARTEN.DETAIL(parseInt(params.id))
        : resource === "inquiries"
        ? API_PATHS.INQUIRY.DETAIL(parseInt(params.id))
        : `${basePath}/${params.id}`;

    try {
      const response = await apiCallWithRetry<void, unknown>({
        method: "GET",
        path,
      });

      return { data: response };
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
      return { data: responses };
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
