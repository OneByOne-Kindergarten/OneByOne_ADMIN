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
  <SearchInput source="email" alwaysOn placeholder="이메일" />,
  <SearchInput source="nickname" alwaysOn placeholder="닉네임" />,
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
  <SelectInput
    label="가입 방식"
    source="provider"
    choices={[
      { id: "LOCAL", name: "로컬" },
      { id: "GOOGLE", name: "구글" },
      { id: "KAKAO", name: "카카오" },
    ]}
    emptyText="전체"
    sx={{
      "& .MuiInputBase-root": {
        height: "42px",
        fontSize: "14px",
      },
    }}
  />,
  <SelectInput
    label="상태"
    source="status"
    choices={[
      { id: "ACTIVE", name: "활성" },
      { id: "INACTIVE", name: "비활성" },
      { id: "SUSPENDED", name: "정지" },
    ]}
    emptyText="전체"
    sx={{
      "& .MuiInputBase-root": {
        height: "42px",
        fontSize: "14px",
      },
    }}
  />,
  <TextInput label="유치원명" source="kindergartenName" />,
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

const providerChoices = [
  { id: "LOCAL", name: "로컬" },
  { id: "NAVER", name: "네이버" },
  { id: "KAKAO", name: "카카오" },
  { id: "APPLE", name: "애플" },
];

const statusChoices = [
  { id: "ACTIVE", name: "활성" },
  { id: "INACTIVE", name: "비활성" },
  { id: "SUSPENDED", name: "정지" },
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
      <TextField source="id" label="ID" />
      <TextField source="nickname" label="닉네임" />
      <TextField source="email" label="이메일" />
      <SelectField source="role" choices={roleChoices} label="역할" />
      <SelectField
        source="provider"
        choices={providerChoices}
        label="가입 방식"
      />
      <TextField source="career" label="교사 인증" />
      <BooleanField source="hasWrittenReview" label="리뷰 작성" />
      <SelectField source="status" choices={statusChoices} label="상태" />
      <DateField source="createdAt" label="가입일" showTime />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
