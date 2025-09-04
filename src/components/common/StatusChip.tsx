import { CustomChip } from "./CustomChip";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "default";
    case "ANSWERED":
    case "PROCESSED":
    case "ACTIVE":
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

export default function StatusChip({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  return (
    <CustomChip label={label} color={getStatusColor(status)} size="small" />
  );
}
