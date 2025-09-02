import {
  List,
  Datagrid,
  TextField,
  DateField,
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

const InquiryFilters = [
  <SearchInput source="title" alwaysOn placeholder="문의 제목" />,
  <SelectInput
    label="상태"
    source="status"
    choices={[
      { id: "PENDING", name: "대기중" },
      { id: "ANSWERED", name: "답변완료" },
      { id: "CLOSED", name: "닫기" },
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
  <TextInput label="작성자" source="userNickname" />,
];

const InquiryActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const statusChoices = [
  { id: "PENDING", name: "대기중" },
  { id: "ANSWERED", name: "답변완료" },
  { id: "CLOSED", name: "닫기" },
];

export const InquiryList = () => (
  <List
    filters={InquiryFilters}
    actions={<InquiryActions />}
    title="문의 관리"
    perPage={25}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <TextField source="title" label="분류" />
      <TextField source="content" label="문의내용" />
      <TextField source="answer" label="답변내용" />
      <TextField source="userNickname" label="작성자" />
      <SelectField source="status" choices={statusChoices} label="상태" />
      <DateField source="createdAt" label="작성일" showTime />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
