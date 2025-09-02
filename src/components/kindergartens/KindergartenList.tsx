import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ShowButton,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  TextInput,
  SearchInput,
  FunctionField,
} from "react-admin";

// 리뷰 평점 계산 함수
const calculateAverageRating = (record: any): string => {
  const internshipScores = record.internshipReviewAggregate || {};
  const workScores = record.workReviewAggregate || {};

  // 실습 리뷰 평점들
  const internshipValues = [
    internshipScores.workEnvironmentScoreAggregate || 0,
    internshipScores.learningSupportScoreAggregate || 0,
    internshipScores.instructionTeacherScoreAggregate || 0,
  ].filter((score) => score > 0); // 0점인 항목은 제외

  // 근무 리뷰 평점들
  const workValues = [
    workScores.benefitAndSalaryScoreAggregate || 0,
    workScores.workLiftBalanceScoreAggregate || 0,
    workScores.workEnvironmentScoreAggregate || 0,
    workScores.managerScoreAggregate || 0,
    workScores.customerScoreAggregate || 0,
  ].filter((score) => score > 0); // 0점인 항목은 제외

  // 모든 평점 합치기
  const allScores = [...internshipValues, ...workValues];

  if (allScores.length === 0) {
    return "평점 없음";
  }

  // 평균 계산 (최대 5.0)
  const average =
    allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
  return Math.min(average, 5.0).toFixed(1);
};

const KindergartenFilters = [
  <SearchInput source="name" alwaysOn placeholder="유치원 이름" />,
  <TextInput label="설립 유형" source="establishment" />,
  <TextInput label="주소" source="address" />,
];

const KindergartenActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const KindergartenList = () => (
  <List
    filters={KindergartenFilters}
    actions={<KindergartenActions />}
    title="유치원 관리"
    perPage={25}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <TextField source="name" label="유치원 이름" />
      <TextField source="establishment" label="설립 유형" />
      <TextField source="address" label="주소" />
      <FunctionField
        label="리뷰 평점"
        render={(record: any) => (
          <span
            style={{
              color:
                record.internshipReviewAggregate || record.workReviewAggregate
                  ? "#1976d2"
                  : "#757575",
              fontWeight: "bold",
            }}
          >
            ⭐ {calculateAverageRating(record)}
          </span>
        )}
      />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
