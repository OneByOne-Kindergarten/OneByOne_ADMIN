import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  CreateButton,
  TopToolbar,
  BulkDeleteButton,
  useListContext,
  FunctionField,
  useUpdate,
  useNotify,
  useRefresh,
} from "react-admin";
import { Typography, Switch } from "@mui/material";

const NoticeListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

const NoticeBulkActions = () => (
  <>
    <BulkDeleteButton />
  </>
);

// 공개 상태 변경 토글
const PublicStatusToggle = ({ record }: { record: any }) => {
  const [update] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleToggle = async () => {
    try {
      await update(
        "notices",
        {
          id: record.id,
          data: { public: !record.public },
          previousData: record,
        },
        {
          mutationMode: "pessimistic",
          onSuccess: () => {
            notify(
              `공지사항이 ${
                !record.public ? "공개" : "비공개"
              }로 변경되었습니다.`,
              { type: "success" }
            );
            refresh();
          },
          onError: () => {
            notify("공개 상태 변경에 실패했습니다.", { type: "error" });
          },
        }
      );
    } catch (error) {
      console.error("Failed to update notice public status:", error);
      notify("공개 상태 변경에 실패했습니다.", { type: "error" });
    }
  };

  return (
    <Switch
      checked={record.public}
      onChange={handleToggle}
      color="primary"
      size="medium"
      sx={{ transform: "scale(1.2)" }}
    />
  );
};

const EmptyComponent = () => {
  const { filterValues } = useListContext();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <Typography variant="h6" color="textSecondary">
        {filterValues && Object.keys(filterValues).length > 0
          ? "필터 조건에 맞는 공지사항이 없습니다"
          : "등록된 공지사항이 없습니다"}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        새 공지사항을 작성해보세요.
      </Typography>
    </div>
  );
};

export const NoticeList = () => (
  <List
    actions={<NoticeListActions />}
    empty={<EmptyComponent />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid bulkActionButtons={<NoticeBulkActions />} rowClick={false}>
      <TextField source="id" label="ID" />
      <TextField source="title" label="제목" sx={{ minWidth: 500 }} />
      <TextField source="content" label="내용" />
      <BooleanField source="public" label="공개" sx={{ width: 40 }} />
      <FunctionField
        label="공개 변경"
        render={(record: any) => <PublicStatusToggle record={record} />}
        sx={{ width: 300 }}
      />
      <BooleanField source="pushSend" label="푸시 전송" sx={{ width: 60 }} />
      <DateField
        source="createdAt"
        label="작성일"
        showTime
        sx={{ width: 300 }}
      />
    </Datagrid>
  </List>
);
