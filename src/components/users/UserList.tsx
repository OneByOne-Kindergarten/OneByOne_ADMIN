import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  EditButton,
  ShowButton,
  SelectField,
  FilterList,
  FilterListItem,
} from "react-admin";
import { Card, CardContent } from "@mui/material";

const UserFilter = () => (
  <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
    <CardContent>
      <FilterList label="역할별" icon={<></>}>
        <FilterListItem label="교사" value={{ role: "TEACHER" }} />
        <FilterListItem
          label="예비교사"
          value={{ role: "PROSPECTIVE_TEACHER" }}
        />
        <FilterListItem label="일반사용자" value={{ role: "GENERAL" }} />
        <FilterListItem label="관리자" value={{ role: "ADMIN" }} />
      </FilterList>
    </CardContent>
  </Card>
);

const roleChoices = [
  { id: "TEACHER", name: "교사" },
  { id: "PROSPECTIVE_TEACHER", name: "예비교사" },
  { id: "GENERAL", name: "일반사용자" },
  { id: "ADMIN", name: "관리자" },
];

export const UserList = () => (
  <List aside={<UserFilter />} title="사용자 관리">
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
