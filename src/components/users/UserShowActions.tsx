import { TopToolbar, Button, useRecordContext } from "react-admin";
import { useState } from "react";
import { Edit as EditIcon } from "@mui/icons-material";
import UserStatusDialog from "./UserStatusDialog";

export const UserShowActions = () => {
  const record = useRecordContext();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  if (!record) return null;

  const handleStatusClick = () => {
    setStatusDialogOpen(true);
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
  };

  return (
    <>
      <TopToolbar>
        <Button
          onClick={handleStatusClick}
          label="상태 변경"
          variant="contained"
          color="primary"
        >
          <EditIcon />
        </Button>
      </TopToolbar>

      <UserStatusDialog
        open={statusDialogOpen}
        onClose={handleStatusDialogClose}
        user={record}
      />
    </>
  );
};
