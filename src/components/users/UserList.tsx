import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  FunctionField,
  TopToolbar,
  FilterButton,
  SelectInput,
  BooleanField,
  ExportButton,
  BulkDeleteButton,
  BulkExportButton,
  SearchInput,
} from "react-admin";
import { Chip } from "@mui/material";

const UserFilters = [
  <SearchInput key="email" source="email" placeholder="이메일 검색" alwaysOn />,
  <SearchInput
    key="nickname"
    source="nickname"
    placeholder="닉네임 검색"
    alwaysOn
  />,
  <SelectInput
    key="role"
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
    key="provider"
    label="가입 방법"
    source="provider"
    choices={[
      { id: "LOCAL", name: "로컬" },
      { id: "GOOGLE", name: "구글" },
      { id: "KAKAO", name: "카카오" },
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
    key="status"
    label="상태"
    source="status"
    choices={[
      { id: "ACTIVE", name: "활성" },
      { id: "INACTIVE", name: "비활성" },
      { id: "SUSPENDED", name: "정지" },
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

const UserActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

const UserBulkActionButtons = () => (
  <>
    <BulkExportButton />
    <BulkDeleteButton />
  </>
);

const RoleChip = ({ record }: { record: any }) => {
  const roleLabels: Record<string, string> = {
    TEACHER: "교사",
    PROSPECTIVE_TEACHER: "예비교사",
    GENERAL: "일반사용자",
    ADMIN: "관리자",
  };

  const roleColors: Record<
    string,
    | "primary"
    | "secondary"
    | "default"
    | "error"
    | "info"
    | "success"
    | "warning"
  > = {
    TEACHER: "primary",
    PROSPECTIVE_TEACHER: "secondary",
    GENERAL: "default",
    ADMIN: "error",
  };

  return (
    <Chip
      label={roleLabels[record.role] || record.role}
      color={roleColors[record.role] || "default"}
      size="small"
    />
  );
};

const ProviderChip = ({ record }: { record: any }) => {
  const providerLabels: Record<string, string> = {
    LOCAL: "로컬",
    GOOGLE: "구글",
    KAKAO: "카카오",
  };

  return (
    <Chip
      label={providerLabels[record.provider] || record.provider}
      variant="outlined"
      size="small"
    />
  );
};

const StatusChip = ({ record }: { record: any }) => {
  const statusLabels: Record<string, string> = {
    ACTIVE: "활성",
    INACTIVE: "비활성",
    SUSPENDED: "정지",
  };

  const statusColors: Record<
    string,
    | "primary"
    | "secondary"
    | "default"
    | "error"
    | "info"
    | "success"
    | "warning"
  > = {
    ACTIVE: "success",
    INACTIVE: "default",
    SUSPENDED: "error",
  };

  return (
    <Chip
      label={statusLabels[record.status] || record.status}
      color={statusColors[record.status] || "default"}
      size="small"
    />
  );
};

export const UserList = () => (
  <List
    filters={UserFilters}
    actions={<UserActions />}
    title="유저 관리"
    perPage={25}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show" bulkActionButtons={<UserBulkActionButtons />}>
      <TextField source="userId" label="ID" />
      <EmailField source="email" label="이메일" />
      <TextField source="nickname" label="닉네임" />
      <FunctionField
        label="역할"
        render={(record: any) => <RoleChip record={record} />}
      />
      <FunctionField
        label="가입 방법"
        render={(record: any) => <ProviderChip record={record} />}
      />
      <FunctionField
        label="상태"
        render={(record: any) => <StatusChip record={record} />}
      />
      <TextField source="kindergartenName" label="유치원명" />
      <BooleanField source="hasWrittenReview" label="리뷰 작성" />
      <BooleanField source="isRestoredUser" label="복구 사용자" />
      <DateField source="createdAt" label="가입일" showTime />
    </Datagrid>
  </List>
);
