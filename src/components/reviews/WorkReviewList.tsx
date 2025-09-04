import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  FunctionField,
  TopToolbar,
  FilterButton,
  NumberInput,
  SelectInput,
  useListContext,
} from "react-admin";
import { Typography, Box } from "@mui/material";

const WorkReviewFilters = [
  <NumberInput
    key="kindergartenId"
    label="유치원 ID (필수)"
    source="kindergartenId"
    alwaysOn
    sx={{
      "& .MuiInputBase-root": {
        height: "42px",
        fontSize: "14px",
      },
    }}
  />,
  <SelectInput
    key="sortType"
    label="정렬"
    source="sortType"
    choices={[
      { id: "LATEST", name: "최신순" },
      { id: "POPULAR", name: "인기순" },
    ]}
    emptyText="전체"
    alwaysOn
    sx={{
      "& .MuiInputBase-root": {
        height: "42px",
        fontSize: "14px",
      },
    }}
  />,
  <NumberInput
    key="starRating"
    label="평점"
    source="starRating"
    min={0}
    max={5}
    sx={{
      "& .MuiInputBase-root": {
        height: "42px",
        fontSize: "14px",
      },
    }}
  />,
];

const WorkReviewActions = () => (
  <TopToolbar>
    <FilterButton />
  </TopToolbar>
);

const ConditionalDatagrid = () => {
  const { filterValues, data } = useListContext();

  // 유치원 ID가 없는 경우 메시지 표시
  if (!filterValues?.kindergartenId || (data && data[0]?._isPlaceholder)) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          유치원 ID를 입력해주세요
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          근무 리뷰를 조회하기 위해서는 필터에서 유치원 ID를 입력해주세요.
        </Typography>
      </Box>
    );
  }

  return (
    <Datagrid rowClick={false}>
      <TextField source="workReviewId" label="리뷰 ID" />
      <FunctionField
        label="작성자 ID"
        render={(record: any) => record.user?.userId || "0"}
      />
      <FunctionField
        label="작성자"
        render={(record: any) => record.user?.nickname || "익명"}
      />
      <TextField source="kindergartenName" label="유치원" />
      <TextField source="workType" label="근무형태" />
      <NumberField source="workYear" label="근무년차" />
      <TextField source="oneLineComment" label="한줄평" />
      <NumberField source="benefitAndSalaryScore" label="급여" />
      <NumberField source="workLifeBalanceScore" label="워라밸" />
      <NumberField source="workEnvironmentScore" label="분위기" />
      <NumberField source="managerScore" label="관리자" />
      <NumberField source="customerScore" label="고객" />
      <NumberField source="likeCount" label="좋아요" />
      <DateField source="createdAt" label="작성일" showTime />
    </Datagrid>
  );
};

const EmptyComponent = () => {
  const { filterValues } = useListContext();

  // 유치원 ID가 입력되었지만 데이터가 없는 경우
  if (filterValues?.kindergartenId) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          해당 유치원의 근무 리뷰가 없습니다
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          유치원 ID {filterValues.kindergartenId}에 대한 근무 리뷰가 존재하지
          않습니다.
        </Typography>
      </Box>
    );
  }

  // 기본 상황 (유치원 ID 미입력)
  return null;
};

export const WorkReviewList = () => (
  <List
    filters={WorkReviewFilters}
    actions={<WorkReviewActions />}
    title="근무 리뷰 관리"
    perPage={25}
    filterDefaultValues={{}}
    disableSyncWithLocation={false}
    sort={{ field: "id", order: "ASC" }}
    empty={<EmptyComponent />}
  >
    <ConditionalDatagrid />
  </List>
);
