import {
  TopToolbar,
  useUpdate,
  useNotify,
  useRefresh,
  Button,
  useRecordContext,
} from "react-admin";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

// 신고 상태 변경 다이얼로그
const StatusDialog = ({
  open,
  onClose,
  record,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  record: any;
  onUpdate: (status: string) => void;
}) => {
  const [status, setStatus] = useState(record?.status || "PENDING");

  const handleSubmit = () => {
    if (status && status !== record?.status) {
      onUpdate(status);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>신고 상태 변경</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>처리 상태</InputLabel>
          <Select
            value={status}
            label="처리 상태"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="PENDING">대기중</MenuItem>
            <MenuItem value="PROCESSED">처리완료</MenuItem>
            <MenuItem value="REJECTED">처리거부</MenuItem>
            <MenuItem value="YET">보류</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSubmit} variant="contained">
          상태 변경
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 신고 액션 버튼들
export const ReportShowActions = () => {
  const record = useRecordContext();
  const [update] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  if (!record) return null;

  // 신고 상태 변경
  const handleStatusUpdate = async (status: string) => {
    try {
      await update(
        "reports",
        {
          id: record.id,
          data: { status },
          previousData: record,
        },
        {
          mutationMode: "pessimistic",
          onSuccess: () => {
            notify("신고 상태가 성공적으로 변경되었습니다.", {
              type: "success",
            });
            refresh();
          },
          onError: () => {
            notify("신고 상태 변경에 실패했습니다.", { type: "error" });
          },
        }
      );
    } catch (error) {
      console.error("Failed to update report status:", error);
      notify("신고 상태 변경에 실패했습니다.", { type: "error" });
    }
  };

  const canEdit = record.status === "PENDING" || record.status === "YET";

  return (
    <TopToolbar>
      {canEdit && (
        <Button
          onClick={() => setStatusDialogOpen(true)}
          label="상태 변경"
          variant="contained"
          color="primary"
        >
          <EditIcon />
        </Button>
      )}
      <StatusDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        record={record}
        onUpdate={handleStatusUpdate}
      />
    </TopToolbar>
  );
};
