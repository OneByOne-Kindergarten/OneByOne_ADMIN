import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  EditButton,
  ShowButton,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  TextInput,
  SelectField,
  DateInput,
  SearchInput,
  FilterList,
  FilterListItem,
} from "react-admin";
import { Card, CardContent } from "@mui/material";

const CommunityFilters = [
  <SearchInput source="title" alwaysOn placeholder="제목으로 검색" />,
  <TextInput label="내용" source="content" />,
  <TextInput label="작성자" source="userName" />,
  <DateInput label="시작일" source="startDate" />,
  <DateInput label="종료일" source="endDate" />,
];

const CommunityFilter = () => (
  <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
    <CardContent>
      <FilterList label="카테고리별" icon={<></>}>
        <FilterListItem label="교사" value={{ category: "TEACHER" }} />
        <FilterListItem
          label="예비교사"
          value={{ category: "PROSPECTIVE_TEACHER" }}
        />
      </FilterList>
    </CardContent>
  </Card>
);

const CommunityActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const categoryChoices = [
  { id: "TEACHER", name: "교사" },
  { id: "PROSPECTIVE_TEACHER", name: "예비교사" },
];

export const CommunityList = () => (
  <List
    filters={CommunityFilters}
    aside={<CommunityFilter />}
    actions={<CommunityActions />}
    title="커뮤니티 관리"
    perPage={25}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" label="게시글 ID" />
      <TextField source="title" label="제목" />
      <TextField source="content" label="내용" />
      <SelectField
        source="category"
        choices={categoryChoices}
        label="카테고리"
      />
      <TextField source="categoryName" label="하위 카테고리" />
      <TextField source="id" label="작성자 ID" />
      <NumberField source="likeCount" label="좋아요 수" />
      <NumberField source="commentCount" label="댓글 수" />
      <DateField source="createdAt" label="작성일" showTime />
      <DateField source="updatedAt" label="수정일" showTime />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
