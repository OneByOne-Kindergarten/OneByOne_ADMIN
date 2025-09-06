import { CustomChip } from "./CustomChip";

const getRoleColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "error";
    case "PROSPECTIVE_TEACHER":
      return "secondary";
    case "TEACHER":
      return "primary";
    case "GENERAL":
      return "default";
    default:
      return "default";
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case "TEACHER":
      return "교사";
    case "PROSPECTIVE_TEACHER":
      return "예비교사";
    case "GENERAL":
      return "일반사용자";
    case "ADMIN":
      return "관리자";
    default:
      return role;
  }
};

export default function RoleChip({
  role,
  label,
}: {
  role: string;
  label?: string;
}) {
  const displayLabel = label || getRoleLabel(role);
  return (
    <CustomChip label={displayLabel} color={getRoleColor(role)} size="small" />
  );
}
