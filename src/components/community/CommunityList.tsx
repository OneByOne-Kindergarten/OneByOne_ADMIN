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

const CommunityFilter = () => (
  <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
    <CardContent>
      <FilterList label="상태별" icon={<></>}>
        <FilterListItem label="전체" value={{}} />
        <FilterListItem label="활성" value={{ isActive: true }} />
        <FilterListItem label="비활성" value={{ isActive: false }} />
      </FilterList>
    </CardContent>
  </Card>
);

export const CommunityList = () => (
  <List aside={<CommunityFilter />} title="커뮤니티 관리">
    <Datagrid rowClick="show">
      <TextField source="id" label="게시글 ID" />
      <TextField source="title" label="제목" />
      <TextField source="content" label="내용" />
      <TextField source="authorNickname" label="작성자" />
      <NumberField source="likeCount" label="좋아요 수" />
      <NumberField source="commentCount" label="댓글 수" />
      <BooleanField source="isActive" label="활성 상태" />
      <DateField source="createdAt" label="작성일" showTime />
      <DateField source="updatedAt" label="수정일" showTime />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
