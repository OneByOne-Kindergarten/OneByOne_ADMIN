import { CustomChip } from "./CustomChip";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "default";
    case "ANSWERED":
    case "PROCESSED":
    case "ACTIVE":
    case "APPROVED":
      return "success";
    case "CLOSED":
    case "DELETED":
    case "REJECTED":
    case "INACTIVE":
      return "error";
    default:
      return "secondary";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "PENDING":
      return "대기";
    case "ANSWERED":
      return "답변완료";
    case "PROCESSED":
      return "처리완료";
    case "ACTIVE":
      return "활성";
    case "APPROVED":
      return "승인";
    case "CLOSED":
      return "마감";
    case "DELETED":
      return "탈퇴";
    case "REJECTED":
      return "거부";
    case "INACTIVE":
      return "비활성";
    case "SUSPENDED":
      return "정지";
    default:
      return status;
  }
};

export default function StatusChip({
  status,
  label,
}: {
  status: string;
  label?: string;
}) {
  const displayLabel = label || getStatusLabel(status);
  return (
    <CustomChip
      label={displayLabel}
      color={getStatusColor(status)}
      size="small"
    />
  );
}
