import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  FormDataConsumer,
} from "react-admin";
import { SUB_CATEGORY_CHOICES } from "@/constants/community";

// 조건부 하위 카테고리 선택 컴포넌트
const ConditionalSubCategorySelect = () => {
  return (
    <FormDataConsumer>
      {({ formData }) => {
        const category = formData?.category;
        const choices = [
          ...(SUB_CATEGORY_CHOICES[
            category as keyof typeof SUB_CATEGORY_CHOICES
          ] || []),
        ];

        return (
          <SelectInput
            source="categoryName"
            label="하위 카테고리"
            choices={choices}
            validate={[required()]}
            key={category}
          />
        );
      }}
    </FormDataConsumer>
  );
};

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
      <ConditionalSubCategorySelect />
    </SimpleForm>
  </Create>
);
