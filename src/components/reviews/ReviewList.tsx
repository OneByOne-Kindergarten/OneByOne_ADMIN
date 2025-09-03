import { useState } from "react";
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
  Tabs,
  Tab,
  TextField,
  Button,
  Alert,
} from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`review-tabpanel-${index}`}
      aria-labelledby={`review-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const ReviewList = () => {
  const [tabValue, setTabValue] = useState(0);
  const [kindergartenId, setKindergartenId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setReviews([]); // 탭 변경 시 기존 데이터 초기화
  };

  const handleSearch = async () => {
    if (!kindergartenId.trim()) {
      setError("유치원 ID를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: API 호출 구현
      // const response = await apiCall({
      //   method: "GET",
      //   path: tabValue === 0
      //     ? API_PATHS.REVIEWS.INTERNSHIP.LIST(parseInt(kindergartenId))
      //     : API_PATHS.REVIEWS.WORK.LIST(parseInt(kindergartenId)),
      //   withAuth: true,
      // });
      // setReviews(response);

      // 임시 데이터
      setReviews([]);
    } catch (err) {
      setError("리뷰 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        리뷰 관리
      </Typography>

      {/* 유치원 ID 검색 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label="유치원 ID"
            value={kindergartenId}
            onChange={(e) => setKindergartenId(e.target.value)}
            placeholder="유치원 ID를 입력하세요"
            size="small"
            type="number"
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? "검색 중..." : "검색"}
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="리뷰 관리 탭"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="실습 리뷰" />
          <Tab label="근무 리뷰" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>리뷰 ID</TableCell>
                  <TableCell>유치원명</TableCell>
                  <TableCell>작성자</TableCell>
                  <TableCell>근무환경</TableCell>
                  <TableCell>학습지원</TableCell>
                  <TableCell>지도교사</TableCell>
                  <TableCell>작성일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      데이터 로딩 중...
                    </TableCell>
                  </TableRow>
                ) : reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {kindergartenId
                        ? "해당 유치원의 실습 리뷰가 없습니다."
                        : "유치원 ID를 입력하고 검색하세요."}
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review, index) => (
                    <TableRow key={index}>
                      <TableCell>{review.id}</TableCell>
                      <TableCell>{review.kindergartenName}</TableCell>
                      <TableCell>{review.author}</TableCell>
                      <TableCell>{review.workEnvironment}</TableCell>
                      <TableCell>{review.learningSupport}</TableCell>
                      <TableCell>{review.instructor}</TableCell>
                      <TableCell>{review.createdAt}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>리뷰 ID</TableCell>
                  <TableCell>유치원명</TableCell>
                  <TableCell>작성자</TableCell>
                  <TableCell>복리후생</TableCell>
                  <TableCell>워라밸</TableCell>
                  <TableCell>근무환경</TableCell>
                  <TableCell>관리자</TableCell>
                  <TableCell>고객응대</TableCell>
                  <TableCell>작성일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      데이터 로딩 중...
                    </TableCell>
                  </TableRow>
                ) : reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      {kindergartenId
                        ? "해당 유치원의 근무 리뷰가 없습니다."
                        : "유치원 ID를 입력하고 검색하세요."}
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review, index) => (
                    <TableRow key={index}>
                      <TableCell>{review.id}</TableCell>
                      <TableCell>{review.kindergartenName}</TableCell>
                      <TableCell>{review.author}</TableCell>
                      <TableCell>{review.benefit}</TableCell>
                      <TableCell>{review.workLifeBalance}</TableCell>
                      <TableCell>{review.workEnvironment}</TableCell>
                      <TableCell>{review.manager}</TableCell>
                      <TableCell>{review.customer}</TableCell>
                      <TableCell>{review.createdAt}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Box>
  );
};
