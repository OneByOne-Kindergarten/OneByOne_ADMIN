import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  EditButton,
  ShowButton,
  BooleanField,
  FilterList,
  FilterListItem,
} from "react-admin";
import { Card, CardContent } from "@mui/material";

const ReviewFilter = () => (
  <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
    <CardContent>
      <FilterList label="평점별" icon={<></>}>
        <FilterListItem label="전체" value={{}} />
        <FilterListItem label="5점" value={{ rating: 5 }} />
        <FilterListItem label="4점" value={{ rating: 4 }} />
        <FilterListItem label="3점" value={{ rating: 3 }} />
        <FilterListItem label="2점" value={{ rating: 2 }} />
        <FilterListItem label="1점" value={{ rating: 1 }} />
      </FilterList>
    </CardContent>
  </Card>
);

export const ReviewList = () => (
  <List aside={<ReviewFilter />} title="리뷰 관리">
    <Datagrid rowClick="show">
      <TextField source="id" label="리뷰 ID" />
      <TextField source="kindergartenName" label="유치원명" />
      <TextField source="authorNickname" label="작성자" />
      <NumberField source="rating" label="평점" />
      <TextField source="content" label="리뷰 내용" />
      <BooleanField source="isActive" label="활성 상태" />
      <DateField source="createdAt" label="작성일" showTime />
      <DateField source="updatedAt" label="수정일" showTime />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
