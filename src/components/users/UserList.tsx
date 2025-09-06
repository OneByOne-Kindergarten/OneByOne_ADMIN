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
import { useState } from "react";
import StatusChip from "@/components/common/StatusChip";
import RoleChip from "@/components/common/RoleChip";
import UserStatusDialog from "./UserStatusDialog";

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
      { id: "NAVER", name: "네이버" },
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
      { id: "DELETED", name: "탈퇴" },
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

const UserRoleField = ({ record }: { record: any }) => {
  return <RoleChip role={record.role} />;
};

const UserStatusField = ({
  record,
  onStatusClick,
}: {
  record: any;
  onStatusClick: (user: any) => void;
}) => {
  if (!record.status) {
    return null;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onStatusClick(record);
      }}
      style={{ cursor: "pointer" }}
    >
      <StatusChip status={record.status} />
    </div>
  );
};

export const UserList = () => {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleStatusClick = (user: any) => {
    setSelectedUser(user);
    setStatusDialogOpen(true);
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <List
        filters={UserFilters}
        actions={<UserActions />}
        title="유저 관리"
        perPage={25}
        sort={{ field: "createdAt", order: "DESC" }}
      >
        <Datagrid rowClick="show" bulkActionButtons={<UserBulkActionButtons />}>
          <TextField source="id" label="ID" />
          <EmailField source="email" label="이메일" />
          <TextField source="nickname" label="닉네임" />
          <TextField source="provider" label="가입 방법" />
          <FunctionField
            label="역할"
            render={(record: any) => <UserRoleField record={record} />}
          />
          <FunctionField
            label="상태"
            render={(record: any) => (
              <UserStatusField
                record={record}
                onStatusClick={handleStatusClick}
              />
            )}
          />
          <BooleanField source="hasWrittenReview" label="리뷰 작성" />
          <DateField source="createdAt" label="가입일" showTime />
        </Datagrid>
      </List>

      <UserStatusDialog
        open={statusDialogOpen}
        onClose={handleStatusDialogClose}
        user={selectedUser}
      />
    </>
  );
};
