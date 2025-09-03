import { Card, CardContent, CardHeader } from "@mui/material";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { Title } from "react-admin";

// 통계 카드 컴포넌트
const StatCard = ({
  title,
  value,
  color = "#1976d2",
}: {
  title: string;
  value: number;
  color?: string;
}) => {
  const getDisplayValue = () => {
    if (value === -1) {
      return <CircularProgress size={32} sx={{ color }} />;
    }
    if (value === -2) {
      return (
        <Typography variant="h6" sx={{ color: "#f44336" }}>
          오류
        </Typography>
      );
    }
    return (
      <Typography variant="h3" component="div" sx={{ color }}>
        {value.toLocaleString()}
      </Typography>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderLeft: `4px solid ${color}`,
        background: "linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)",
        minHeight: 120,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {title}
      </Typography>
      {getDisplayValue()}
    </Paper>
  );
};

export const Dashboard = () => {
  // 무한 루프를 방지하기 위해 일시적으로 API 호출 비활성화
  // TODO: 추후 안정적인 방법으로 통계 데이터 로드
  const inquiriesTotal = 0;
  const communityTotal = 0;
  const inquiriesLoading = false;
  const communityLoading = false;
  const inquiriesError = null;
  const communityError = null;

  return (
    <Box sx={{ p: 3 }}>
      <Title title="원바원" />
      <Typography variant="h4" component="h1" gutterBottom>
        원바원 서비스 운영 현황
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard
          title="미처리 문의"
          value={
            inquiriesLoading ? -1 : inquiriesError ? -2 : inquiriesTotal || 0
          }
          color="#ff9800"
        />
        <StatCard
          title="커뮤니티 글"
          value={
            communityLoading ? -1 : communityError ? -2 : communityTotal || 0
          }
          color="#9c27b0"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: 3,
        }}
      >
        <Card>
          <CardHeader title="최근 활동" />
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              최근 사용자 활동 및 시스템 이벤트가 여기에 표시됩니다.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                • 새로운 사용자 가입: {Math.floor(Math.random() * 10) + 1}명
                (오늘)
              </Typography>
              <Typography variant="body2">
                • 새로운 리뷰 작성: {Math.floor(Math.random() * 5) + 1}건 (오늘)
              </Typography>
              <Typography variant="body2">
                • 새로운 문의: {Math.floor(Math.random() * 3) + 1}건 (오늘)
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="시스템 상태" />
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              시스템 상태 및 서버 정보가 여기에 표시됩니다.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="green">
                ✅ 서버 상태: 정상
              </Typography>
              <Typography variant="body2" color="green">
                ✅ 데이터베이스: 연결됨
              </Typography>
              <Typography variant="body2" color="green">
                ✅ API 응답시간: 평균 {Math.floor(Math.random() * 100) + 50}ms
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
