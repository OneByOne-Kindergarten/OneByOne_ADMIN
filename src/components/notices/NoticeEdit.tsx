import { Edit, SimpleForm, TextInput, BooleanInput } from "react-admin";

export const NoticeEdit = () => (
  <Edit title="공지사항 수정">
    <SimpleForm>
      <TextInput source="id" label="공지사항 ID" disabled />
      <TextInput source="title" label="제목" required fullWidth />
      <TextInput
        source="content"
        label="내용"
        multiline
        rows={8}
        required
        fullWidth
      />
      <BooleanInput source="isPushSend" label="푸시 알림 전송" />
      <BooleanInput source="isPublic" label="공개 여부" />
    </SimpleForm>
  </Edit>
);
