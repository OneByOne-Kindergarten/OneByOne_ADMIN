import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { useUpdate, useNotify, useRefresh } from "react-admin";

interface UserStatusDialogProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

const UserStatusDialog: React.FC<UserStatusDialogProps> = ({
  open,
  onClose,
  user,
}) => {
  const [status, setStatus] = useState(user?.status || "");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const [update] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  const statusOptions = [
    { value: "ACTIVE", label: "활성" },
    { value: "SUSPENDED", label: "정지" },
    { value: "DELETED", label: "탈퇴" },
  ];

  const handleSubmit = async () => {
    if (!status) {
      notify("상태를 선택해주세요.", { type: "warning" });
      return;
    }

    setLoading(true);
    try {
      await update("users", {
        id: user.id,
        data: { status, reason },
        previousData: user,
      });

      notify(
        `사용자 상태가 ${
          statusOptions.find((opt) => opt.value === status)?.label
        }(으)로 변경되었습니다.`,
        {
          type: "success",
        }
      );
      refresh();
      onClose();
    } catch (error) {
      console.error("상태 변경 실패:", error);
      notify("상태 변경에 실패했습니다.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStatus(user?.status || "");
    setReason("");
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        사용자 상태 변경
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {user.nickname} ({user.email})
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>상태</InputLabel>
            <Select
              value={status}
              label="상태"
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="변경 사유"
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !status}
        >
          {loading ? "변경 중" : "변경"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserStatusDialog;
