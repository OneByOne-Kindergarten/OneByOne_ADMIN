import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  TopToolbar,
  FilterButton,
  NumberInput,
  useListContext,
  BulkDeleteButton,
  BulkExportButton,
} from "react-admin";
import { Typography, Box } from "@mui/material";
import StatusChip from "@/components/common/StatusChip";
import RoleChip from "@/components/common/RoleChip";

const CommentFilters = [
  <NumberInput
    key="postId"
    label="게시글 ID (필수)"
    source="postId"
    alwaysOn
    sx={{
      "& .MuiInputBase-root": {
        height: "42px",
        fontSize: "14px",
      },
    }}
  />,
];

const CommentActions = () => (
  <TopToolbar>
    <FilterButton />
  </TopToolbar>
);

const CommentBulkActionButtons = () => (
  <>
    <BulkExportButton />
    <BulkDeleteButton />
  </>
);

const CommentStatusField = ({ record }: { record: any }) => {
  if (!record.status) {
    return null;
  }

  return <StatusChip status={record.status} />;
};

const UserRoleField = ({ record }: { record: any }) => {
  if (!record.userRole) {
    return null;
  }

  return <RoleChip role={record.userRole} />;
};

const ConditionalDatagrid = () => {
  const { filterValues, data } = useListContext();

  if (!filterValues?.postId || (data && data[0]?._isPlaceholder)) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          게시글 ID를 입력해주세요
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          댓글을 조회하기 위해서는 필터에서 게시글 ID를 입력해주세요.
        </Typography>
      </Box>
    );
  }

  return (
    <Datagrid rowClick={false} bulkActionButtons={<CommentBulkActionButtons />}>
      <TextField source="id" label="댓글 ID" />
      <FunctionField
        label="부모 댓글 ID"
        render={(record: any) => record.parentId || "-"}
      />
      <TextField source="content" label="내용" />
      <TextField source="nickName" label="작성자" />
      <FunctionField
        label="역할"
        render={(record: any) => <UserRoleField record={record} />}
      />
      <FunctionField
        label="상태"
        render={(record: any) => <CommentStatusField record={record} />}
      />
      <DateField source="createdAt" label="작성일" showTime />
    </Datagrid>
  );
};

const EmptyComponent = () => {
  const { filterValues } = useListContext();

  if (!filterValues?.postId) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          게시글 ID를 입력해주세요
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          댓글을 조회하기 위해서는 필터에서 게시글 ID를 입력해주세요.
        </Typography>
      </Box>
    );
  }

  return null;
};

export const CommentList = () => (
  <List
    filters={CommentFilters}
    actions={<CommentActions />}
    title="커뮤니티 관리 - 댓글"
    perPage={25}
    filterDefaultValues={{}}
    disableSyncWithLocation={false}
    sort={{ field: "createdAt", order: "DESC" }}
    empty={<EmptyComponent />}
  >
    <ConditionalDatagrid />
  </List>
);
