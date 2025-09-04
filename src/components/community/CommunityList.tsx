import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  TextInput,
  SelectField,
  DateInput,
  SearchInput,
  SelectInput,
  BulkDeleteButton,
} from "react-admin";

const CommunityFilters = [
  <SearchInput source="title" alwaysOn placeholder="게시글 제목" />,
  <SelectInput
    label="카테고리"
    source="category"
    choices={[
      { id: "TEACHER", name: "교사" },
      { id: "PROSPECTIVE_TEACHER", name: "예비교사" },
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
  <TextInput label="내용" source="content" />,
  <TextInput label="작성자" source="userName" />,
  <TextInput label="하위 카테고리" source="categoryName" />,
  <DateInput label="시작일" source="startDate" />,
  <DateInput label="종료일" source="endDate" />,
];

const CommunityActions = () => {
  return (
    <TopToolbar>
      <FilterButton />
      <CreateButton />
      <ExportButton />
    </TopToolbar>
  );
};

const categoryChoices = [
  { id: "TEACHER", name: "교사" },
  { id: "PROSPECTIVE_TEACHER", name: "예비교사" },
];

export const CommunityList = () => (
  <List
    filters={CommunityFilters}
    actions={<CommunityActions />}
    title="커뮤니티 관리"
    perPage={25}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show" bulkActionButtons={<BulkDeleteButton />}>
      <TextField source="id" label="ID" />
      <TextField source="title" label="제목" />
      <TextField source="content" label="내용" />
      <SelectField
        source="category"
        choices={categoryChoices}
        label="카테고리"
      />
      <TextField source="categoryName" label="하위 카테고리" />
      <TextField source="userNickname" label="작성자" />
      <TextField source="id" label="작성자 ID" />
      <NumberField source="likeCount" label="좋아요 수" />
      <NumberField source="commentCount" label="댓글 수" />
      <NumberField source="viewCount" label="조회 수" />
      <DateField source="createdAt" label="작성일" showTime />
    </Datagrid>
  </List>
);
