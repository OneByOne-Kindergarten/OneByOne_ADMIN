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

export default function RoleChip({
  role,
  label,
}: {
  role: string;
  label: string;
}) {
  return <CustomChip label={label} color={getRoleColor(role)} size="small" />;
}
