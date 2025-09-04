import {
  List,
  Datagrid,
  TextField,
  DateField,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  TextInput,
  SearchInput,
  SelectInput,
  FunctionField,
  useListContext,
} from "react-admin";
import { Typography, Chip } from "@mui/material";

const InquiryFilters = [
  <SearchInput source="title" alwaysOn placeholder="문의 제목" />,
  <SelectInput
    label="상태"
    source="status"
    choices={[
      { id: "PENDING", name: "대기중" },
      { id: "ANSWERED", name: "답변완료" },
      { id: "CLOSED", name: "마감" },
    ]}
    sx={{
      "& .MuiInputBase-root": {
        width: "150px",
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

// 문의 상태 스타일 컴포넌트
const InquiryStatusField = ({ record }: { record: any }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "ANSWERED":
        return "success";
      case "CLOSED":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기중";
      case "ANSWERED":
        return "답변완료";
      case "CLOSED":
        return "마감";
      default:
        return status;
    }
  };

  return (
    <Chip
      label={getStatusLabel(record.status)}
      color={getStatusColor(record.status)}
      size="small"
    />
  );
};

const EmptyComponent = () => {
  const { filterValues } = useListContext();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <Typography variant="h6" color="textSecondary">
        {filterValues && Object.keys(filterValues).length > 0
          ? "필터 조건에 맞는 문의가 없습니다"
          : "등록된 문의가 없습니다"}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        문의가 접수되면 여기에 표시됩니다.
      </Typography>
    </div>
  );
};

export const InquiryList = () => (
  <List
    filters={InquiryFilters}
    actions={<InquiryActions />}
    title="문의 관리"
    perPage={25}
    sort={{ field: "createdAt", order: "DESC" }}
    empty={<EmptyComponent />}
  >
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <TextField source="title" label="분류" />
      <TextField source="content" label="문의내용" />
      <TextField source="answer" label="답변내용" />
      <TextField source="userNickname" label="작성자" />
      <FunctionField
        label="상태"
        render={(record: any) => <InquiryStatusField record={record} />}
      />
      <DateField source="createdAt" label="작성일" showTime />
    </Datagrid>
  </List>
);
