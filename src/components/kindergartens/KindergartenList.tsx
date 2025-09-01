import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  EditButton,
  ShowButton,
  FilterList,
  FilterListItem,
} from "react-admin";
import { Card, CardContent } from "@mui/material";

const KindergartenFilter = () => (
  <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
    <CardContent>
      <FilterList label="설립별" icon={<></>}>
        <FilterListItem label="전체" value={{}} />
        <FilterListItem label="국공립" value={{ establishment: "국공립" }} />
        <FilterListItem label="사립" value={{ establishment: "사립" }} />
      </FilterList>
    </CardContent>
  </Card>
);

export const KindergartenList = () => (
  <List aside={<KindergartenFilter />} title="유치원 관리">
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <TextField source="name" label="유치원명" />
      <TextField source="establishment" label="설립" />
      <TextField source="address" label="주소" />
      <TextField source="phoneNumber" label="전화번호" />
      <NumberField source="classCount3" label="3세반 수" />
      <NumberField source="classCount4" label="4세반 수" />
      <NumberField source="classCount5" label="5세반 수" />
      <NumberField source="pupilCount3" label="3세 원아수" />
      <NumberField source="pupilCount4" label="4세 원아수" />
      <NumberField source="pupilCount5" label="5세 원아수" />
      <DateField source="createdAt" label="등록일" showTime />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
