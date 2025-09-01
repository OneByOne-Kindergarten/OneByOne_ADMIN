import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  ShowButton,
  SelectField,
  FilterList,
  FilterListItem,
} from "react-admin";
import { Card, CardContent } from "@mui/material";

const InquiryFilter = () => (
  <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
    <CardContent>
      <FilterList label="상태별" icon={<></>}>
        <FilterListItem label="전체" value={{}} />
        <FilterListItem label="대기중" value={{ status: "PENDING" }} />
        <FilterListItem label="처리완료" value={{ status: "COMPLETED" }} />
        <FilterListItem label="처리중" value={{ status: "IN_PROGRESS" }} />
      </FilterList>
    </CardContent>
  </Card>
);

const statusChoices = [
  { id: "PENDING", name: "대기중" },
  { id: "IN_PROGRESS", name: "처리중" },
  { id: "COMPLETED", name: "처리완료" },
];

export const InquiryList = () => (
  <List aside={<InquiryFilter />} title="문의 관리">
    <Datagrid rowClick="show">
      <TextField source="id" label="문의 ID" />
      <TextField source="title" label="제목" />
      <TextField source="userNickname" label="작성자" />
      <SelectField source="status" choices={statusChoices} label="상태" />
      <DateField source="createdAt" label="작성일" showTime />
      <DateField source="updatedAt" label="수정일" showTime />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
