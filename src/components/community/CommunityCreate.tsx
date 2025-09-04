import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
} from "react-admin";

export const CommunityCreate = () => (
  <Create title="커뮤니티 게시글 작성">
    <SimpleForm>
      <TextInput
        source="title"
        label="제목"
        validate={[required()]}
        fullWidth
      />
      <TextInput
        source="content"
        label="내용"
        multiline
        rows={5}
        validate={[required()]}
        fullWidth
      />
      <SelectInput
        source="category"
        label="카테고리"
        choices={[
          { id: "TEACHER", name: "교사" },
          { id: "PROSPECTIVE_TEACHER", name: "예비교사" },
        ]}
        validate={[required()]}
        defaultValue="TEACHER"
      />
      <TextInput
        source="communityCategoryName"
        label="하위 카테고리명"
        validate={[required()]}
        fullWidth
      />
      <TextInput
        source="communityCategoryDescription"
        label="하위 카테고리 설명"
        multiline
        rows={3}
        fullWidth
      />
    </SimpleForm>
  </Create>
);
