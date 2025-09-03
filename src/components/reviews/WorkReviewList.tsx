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
} from "react-admin";

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

export const WorkReviewList = () => (
  <List
    filters={WorkReviewFilters}
    actions={<WorkReviewActions />}
    title="근무 리뷰 관리"
    perPage={25}
    sort={{ field: "createdAt", order: "DESC" }}
    filterDefaultValues={{ sortType: "LATEST" }}
  >
    <Datagrid rowClick="show">
      <TextField source="workReviewId" label="리뷰 ID" />
      <FunctionField
        label="작성자"
        render={(record: any) => record.user?.nickname || "익명"}
      />
      <NumberField source="kindergartenId" label="유치원 ID" />
      <TextField source="kindergartenName" label="유치원명" />
      <NumberField source="workYear" label="근무년차" />
      <TextField source="oneLineComment" label="한줄평" />
      <NumberField source="benefitAndSalaryScore" label="급여/복리후생" />
      <NumberField source="workLifeBalanceScore" label="워라밸" />
      <NumberField source="workEnvironmentScore" label="근무환경" />
      <NumberField source="managerScore" label="원장/동료" />
      <NumberField source="customerScore" label="아이/학부모" />
      <NumberField source="likeCount" label="좋아요" />
      <NumberField source="shareCount" label="공유" />
      <DateField source="createdAt" label="작성일" showTime />
      <TextField source="workType" label="근무형태" />
    </Datagrid>
  </List>
);
