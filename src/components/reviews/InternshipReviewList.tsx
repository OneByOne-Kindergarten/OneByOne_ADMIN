import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  FunctionField,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  TextInput,
  NumberInput,
  SelectInput,
} from "react-admin";
import { Card, CardContent } from "@mui/material";

const InternshipReviewFilters = [
  <NumberInput label="유치원 ID (필수)" source="kindergartenId" alwaysOn />,
  <SelectInput
    label="정렬"
    source="sortType"
    choices={[
      { id: "LATEST", name: "최신순" },
      { id: "POPULAR", name: "인기순" },
    ]}
    defaultValue="LATEST"
  />,
  <SelectInput
    label="평가 유형"
    source="internshipReviewStarRatingType"
    choices={[
      { id: "ALL", name: "전체" },
      { id: "BENEFIT_AND_SALARY", name: "급여/복리후생" },
      { id: "WORK_LIFE_BALANCE", name: "워라밸" },
      { id: "WORK_ENVIRONMENT", name: "근무환경" },
      { id: "MANAGER", name: "원장/동료" },
      { id: "CUSTOMER", name: "아이/학부모" },
    ]}
    defaultValue="ALL"
  />,
  <NumberInput label="평점" source="starRating" min={0} max={5} />,
];

const InternshipReviewActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const InternshipReviewList = () => (
  <Card>
    <CardContent>
      <List
        filters={InternshipReviewFilters}
        actions={<InternshipReviewActions />}
        title="실습 리뷰 관리"
        perPage={25}
        sort={{ field: "createdAt", order: "DESC" }}
      >
        <Datagrid rowClick="show">
          <TextField source="internshipReviewId" label="리뷰 ID" />
          <FunctionField
            label="작성자"
            render={(record: any) => record.user?.nickname || "익명"}
          />
          <NumberField source="kindergartenId" label="유치원 ID" />
          <TextField source="kindergartenName" label="유치원명" />
          <TextField source="oneLineComment" label="한줄평" />
          <NumberField source="benefitAndSalaryScore" label="급여/복리후생" />
          <NumberField source="workLifeBalanceScore" label="워라밸" />
          <NumberField source="workEnvironmentScore" label="근무환경" />
          <NumberField source="managerScore" label="원장/동료" />
          <NumberField source="customerScore" label="아이/학부모" />
          <NumberField source="likeCount" label="좋아요" />
          <NumberField source="shareCount" label="공유" />
          <DateField source="createdAt" label="작성일" showTime />
        </Datagrid>
      </List>
    </CardContent>
  </Card>
);
