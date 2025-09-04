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
  TextField as MuiTextField,
} from "@mui/material";
import { Close as CloseIcon, Reply as ReplyIcon } from "@mui/icons-material";

// 문의 답변 다이얼로그
const AnswerDialog = ({
  open,
  onClose,
  onAnswer,
}: {
  open: boolean;
  onClose: () => void;
  record: any;
  onAnswer: (answer: string) => void;
}) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswer(answer);
      setAnswer("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>문의 답변</DialogTitle>
      <DialogContent>
        <MuiTextField
          label="답변 내용"
          multiline
          rows={4}
          fullWidth
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="답변을 입력하세요"
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSubmit} variant="contained">
          답변 전송
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 문의 액션 버튼들
export const InquiryShowActions = () => {
  const record = useRecordContext();
  const [update] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);

  if (!record) return null;

  // 문의 마감
  const handleClose = async () => {
    try {
      await update(
        "inquiries",
        {
          id: record.id,
          data: { action: "close" },
          previousData: record,
        },
        {
          mutationMode: "pessimistic",
          onSuccess: () => {
            notify("문의가 마감되었습니다.", { type: "success" });
            refresh();
          },
          onError: () => {
            notify("문의 마감에 실패했습니다.", { type: "error" });
          },
        }
      );
    } catch (error) {
      console.error("Failed to close inquiry:", error);
      notify("문의 마감에 실패했습니다.", { type: "error" });
    }
  };

  // 문의 답변
  const handleAnswer = async (answer: string) => {
    try {
      await update(
        "inquiries",
        {
          id: record.id,
          data: { action: "answer", answer },
          previousData: record,
        },
        {
          mutationMode: "pessimistic",
          onSuccess: () => {
            notify("답변이 전송되었습니다.", { type: "success" });
            refresh();
          },
          onError: () => {
            notify("답변 전송에 실패했습니다.", { type: "error" });
          },
        }
      );
    } catch (error) {
      console.error("Failed to answer inquiry:", error);
      notify("답변 전송에 실패했습니다.", { type: "error" });
    }
  };

  const isPending = record.status === "PENDING";

  return (
    <TopToolbar>
      {isPending && (
        <>
          <Button
            onClick={() => setAnswerDialogOpen(true)}
            label="답변하기"
            variant="contained"
            color="primary"
          >
            <ReplyIcon />
          </Button>
          <Button
            onClick={handleClose}
            label="마감하기"
            variant="outlined"
            color="error"
          >
            <CloseIcon />
          </Button>
        </>
      )}
      <AnswerDialog
        open={answerDialogOpen}
        onClose={() => setAnswerDialogOpen(false)}
        record={record}
        onAnswer={handleAnswer}
      />
    </TopToolbar>
  );
};
