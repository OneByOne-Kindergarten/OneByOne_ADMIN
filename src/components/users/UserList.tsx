import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  EditButton,
  ShowButton,
  SelectField,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  TextInput,
  SearchInput,
  SelectInput,
} from "react-admin";

const UserFilters = [
  <SearchInput source="nickname" alwaysOn placeholder="닉네임" />,
  <SearchInput source="userId" alwaysOn placeholder="사용자 ID" />,
  <SelectInput
    label="역할"
    source="role"
    choices={[
      { id: "TEACHER", name: "교사" },
      { id: "PROSPECTIVE_TEACHER", name: "예비교사" },
      { id: "GENERAL", name: "일반사용자" },
      { id: "ADMIN", name: "관리자" },
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
  <TextInput label="경력" source="career" />,
];

const UserActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const roleChoices = [
  { id: "TEACHER", name: "교사" },
  { id: "PROSPECTIVE_TEACHER", name: "예비교사" },
  { id: "GENERAL", name: "일반사용자" },
  { id: "ADMIN", name: "관리자" },
];

export const UserList = () => (
  <List
    filters={UserFilters}
    actions={<UserActions />}
    title="사용자 관리"
    perPage={25}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="userId" label="사용자 ID" />
      <TextField source="nickname" label="닉네임" />
      <SelectField source="role" choices={roleChoices} label="역할" />
      <TextField source="career" label="경력" />
      <BooleanField source="hasWrittenReview" label="리뷰 작성 여부" />
      <BooleanField source="restoredUser" label="복구된 사용자" />
      <DateField source="createdAt" label="가입일" showTime />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
