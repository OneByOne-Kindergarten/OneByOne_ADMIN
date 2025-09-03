import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Pagination,
} from "@mui/material";
import { apiCall } from "@/utils/api";
import { API_PATHS } from "@/config/api";

interface User {
  userId: number;
  email: string;
  nickname: string;
  role: string;
  provider: string;
  status: string;
  kindergartenName?: string;
  hasWrittenReview: boolean;
  isRestoredUser: boolean;
  createdAt: string;
}

const roleLabels: Record<string, string> = {
  TEACHER: "교사",
  PROSPECTIVE_TEACHER: "예비교사",
  GENERAL: "일반사용자",
  ADMIN: "관리자",
};

const providerLabels: Record<string, string> = {
  LOCAL: "로컬",
  GOOGLE: "구글",
  KAKAO: "카카오",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
  SUSPENDED: "정지",
};

export const UserList = () => {
  const [filters, setFilters] = useState({
    email: "",
    nickname: "",
    role: "",
    provider: "",
    status: "",
    kindergartenName: "",
  });
  const [page, setPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", appliedFilters, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", (page - 1).toString());
      params.append("size", "20");

      // 필터 추가
      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const hasFilters = Object.values(appliedFilters).some((v) => v);
      const endpoint = hasFilters
        ? API_PATHS.ADMIN.USERS.SEARCH
        : API_PATHS.ADMIN.USERS.LIST;

      return await apiCall<
        void,
        { content: User[]; totalElements: number; totalPages: number }
      >({
        method: "GET",
        path: `${endpoint}?${params.toString()}`,
        withAuth: true,
      });
    },
  });

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
    setPage(1);
  };

  const handleReset = () => {
    const resetFilters = {
      email: "",
      nickname: "",
      role: "",
      provider: "",
      status: "",
      kindergartenName: "",
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setPage(1);
  };

  if (error) {
    return (
      <Box>
        <Typography color="error">
          사용자 목록을 불러오는데 실패했습니다: {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        사용자 관리
      </Typography>

      {/* 검색 필터 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            label="이메일"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            size="small"
          />
          <TextField
            label="닉네임"
            value={filters.nickname}
            onChange={(e) =>
              setFilters({ ...filters, nickname: e.target.value })
            }
            size="small"
          />
          <FormControl size="small">
            <InputLabel>역할</InputLabel>
            <Select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              label="역할"
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="TEACHER">교사</MenuItem>
              <MenuItem value="PROSPECTIVE_TEACHER">예비교사</MenuItem>
              <MenuItem value="GENERAL">일반사용자</MenuItem>
              <MenuItem value="ADMIN">관리자</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>가입 방식</InputLabel>
            <Select
              value={filters.provider}
              onChange={(e) =>
                setFilters({ ...filters, provider: e.target.value })
              }
              label="가입 방식"
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="LOCAL">로컬</MenuItem>
              <MenuItem value="GOOGLE">구글</MenuItem>
              <MenuItem value="KAKAO">카카오</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>상태</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              label="상태"
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="ACTIVE">활성</MenuItem>
              <MenuItem value="INACTIVE">비활성</MenuItem>
              <MenuItem value="SUSPENDED">정지</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="유치원명"
            value={filters.kindergartenName}
            onChange={(e) =>
              setFilters({ ...filters, kindergartenName: e.target.value })
            }
            size="small"
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" onClick={handleSearch}>
            검색
          </Button>
          <Button variant="outlined" onClick={handleReset}>
            초기화
          </Button>
        </Box>
      </Paper>

      {/* 테이블 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>사용자 ID</TableCell>
              <TableCell>이메일</TableCell>
              <TableCell>닉네임</TableCell>
              <TableCell>역할</TableCell>
              <TableCell>가입 방식</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>유치원명</TableCell>
              <TableCell>리뷰 작성</TableCell>
              <TableCell>가입일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : data?.content?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data?.content?.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.nickname}</TableCell>
                  <TableCell>
                    <Chip
                      label={roleLabels[user.role] || user.role}
                      size="small"
                      color={user.role === "ADMIN" ? "error" : "default"}
                    />
                  </TableCell>
                  <TableCell>
                    {providerLabels[user.provider] || user.provider}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[user.status] || user.status}
                      size="small"
                      color={
                        user.status === "ACTIVE"
                          ? "success"
                          : user.status === "SUSPENDED"
                          ? "error"
                          : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>{user.kindergartenName || "-"}</TableCell>
                  <TableCell>{user.hasWrittenReview ? "✅" : "❌"}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 페이지네이션 */}
      {data?.totalPages && data.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={data.totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};
