import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  FilterButton,
  SelectInput,
  TopToolbar,
  BulkDeleteButton,
  useListContext,
} from "react-admin";
import { Chip, Typography } from "@mui/material";

const ReportFilters = [
  <SelectInput
    key="status"
    label="상태"
    source="status"
    choices={[
      { id: "PENDING", name: "대기중" },
      { id: "PROCESSED", name: "처리완료" },
      { id: "REJECTED", name: "거부" },
      { id: "YET", name: "보류" },
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
    key="targetType"
    label="신고 대상"
    source="targetType"
    choices={[
      { id: "REVIEW", name: "리뷰" },
      { id: "COMMENT", name: "댓글" },
      { id: "POST", name: "게시글" },
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
];

const ReportListActions = () => (
  <TopToolbar>
    <FilterButton />
  </TopToolbar>
);

const ReportBulkActions = () => (
  <>
    <BulkDeleteButton />
  </>
);

const StatusField = ({ record }: { record: any }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "PROCESSED":
        return "success";
      case "REJECTED":
        return "error";
      case "YET":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기중";
      case "PROCESSED":
        return "처리완료";
      case "REJECTED":
        return "처리거부";
      case "YET":
        return "보류";
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

const TargetTypeField = ({ record }: { record: any }) => {
  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case "REVIEW":
        return "리뷰";
      case "COMMENT":
        return "댓글";
      case "POST":
        return "게시글";
      default:
        return targetType;
    }
  };

  return <Typography>{getTargetTypeLabel(record.targetType)}</Typography>;
};

const EmptyComponent = () => {
  const { filterValues } = useListContext();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <Typography variant="h6" color="textSecondary">
        {filterValues && Object.keys(filterValues).length > 0
          ? "필터 조건에 맞는 신고가 없습니다"
          : "등록된 신고가 없습니다"}
      </Typography>
    </div>
  );
};

export const ReportList = () => (
  <List
    filters={ReportFilters}
    actions={<ReportListActions />}
    empty={<EmptyComponent />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid bulkActionButtons={<ReportBulkActions />}>
      <TextField source="id" label="ID" />
      <FunctionField
        label="신고 대상"
        render={(record: any) => <TargetTypeField record={record} />}
      />
      <TextField source="targetId" label="대상 ID" />
      <TextField source="reason" label="신고 사유" />
      <TextField source="reporterNickname" label="신고자" />
      <FunctionField
        label="상태"
        render={(record: any) => <StatusField record={record} />}
      />
      <DateField source="createdAt" label="작성일" showTime />
    </Datagrid>
  </List>
);
