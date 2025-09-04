import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  useNotify,
  useRedirect,
} from "react-admin";

export const ReportEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSuccess = () => {
    notify("신고 상태가 성공적으로 변경되었습니다.", {
      type: "success",
    });
    redirect("list", "reports");
  };

  const handleError = () => {
    notify("신고 상태 변경에 실패했습니다.", { type: "error" });
  };

  return (
    <Edit
      title="신고 처리"
      mutationMode="pessimistic"
      mutationOptions={{
        onSuccess: handleSuccess,
        onError: handleError,
      }}
    >
      <SimpleForm>
        <TextInput source="id" label="신고 ID" disabled />
        <TextInput source="reporterNickname" label="신고자" disabled />
        <TextInput source="targetType" label="신고 대상 타입" disabled />
        <TextInput source="targetId" label="대상 ID" disabled />
        <TextInput
          source="reason"
          label="신고 사유"
          multiline
          rows={3}
          disabled
        />
        <SelectInput
          source="status"
          label="처리 상태"
          choices={[
            { id: "PENDING", name: "대기중" },
            { id: "PROCESSED", name: "처리완료" },
            { id: "REJECTED", name: "처리거부" },
            { id: "YET", name: "보류" },
          ]}
          required
        />
      </SimpleForm>
    </Edit>
  );
};
