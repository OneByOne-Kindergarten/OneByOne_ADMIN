import { Create, SimpleForm, TextInput, BooleanInput } from "react-admin";

export const NoticeCreate = () => (
  <Create title="공지사항 작성">
    <SimpleForm>
      <TextInput source="title" label="제목" required fullWidth />
      <TextInput
        source="content"
        label="내용"
        multiline
        rows={8}
        required
        fullWidth
      />
      <BooleanInput
        source="isPushSend"
        label="푸시 알림 전송"
        defaultValue={false}
      />
      <BooleanInput source="isPublic" label="즉시 공개" defaultValue={true} />
    </SimpleForm>
  </Create>
);
