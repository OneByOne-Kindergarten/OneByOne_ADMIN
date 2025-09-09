import {
  List,
  Datagrid,
  TextField,
  NumberField,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  TextInput,
  DateInput,
  SearchInput,
  SelectInput,
  BulkDeleteButton,
  FunctionField,
} from "react-admin";
import RoleChip from "@/components/common/RoleChip";
import { KoreanDateField } from "@/components/common/KoreanDateField";
import {
  SUB_CATEGORY_LABELS,
  CATEGORY_LABELS,
  SUB_CATEGORY_CHOICES,
} from "@/constants/community";

const CommunityFilters = [
  <SearchInput source="title" alwaysOn placeholder="게시글 제목" />,
  <SelectInput
    label="카테고리"
    source="category"
    choices={[
      { id: "TEACHER", name: "교사" },
      { id: "PROSPECTIVE_TEACHER", name: "예비교사" },
    ]}
    emptyText="전체"
    alwaysOn
    sx={{
      "& .MuiInputBase-root": {
        height: "42px",
        fontSize: "14px",
      },
    }}
  />,
  <SelectInput
    label="하위 카테고리"
    source="categoryName"
    choices={[
      ...SUB_CATEGORY_CHOICES.TEACHER,
      ...SUB_CATEGORY_CHOICES.PROSPECTIVE_TEACHER,
    ]}
    emptyText="전체"
    alwaysOn
    sx={{
      "& .MuiInputBase-root": {
        height: "42px",
        fontSize: "14px",
      },
    }}
  />,
  <TextInput label="내용" source="content" />,
  <TextInput label="작성자" source="userName" />,
  <DateInput label="시작일" source="startDate" />,
  <DateInput label="종료일" source="endDate" />,
];

const CommunityActions = () => {
  return (
    <TopToolbar>
      <FilterButton />
      <CreateButton />
      <ExportButton />
    </TopToolbar>
  );
};

const CategoryField = ({ record }: { record: any }) => {
  const categoryLabel =
    CATEGORY_LABELS[record.category as keyof typeof CATEGORY_LABELS] ||
    record.category;

  return <RoleChip role={record.category} label={categoryLabel} />;
};

const SubCategoryField = ({ record }: { record: any }) => {
  const subCategoryValue = record.communityCategoryName || record.categoryName;

  const label =
    SUB_CATEGORY_LABELS[subCategoryValue as keyof typeof SUB_CATEGORY_LABELS] ||
    subCategoryValue ||
    "없음";

  return <RoleChip role="GENERAL" label={label} />;
};

export const CommunityList = () => (
  <List
    filters={CommunityFilters}
    actions={<CommunityActions />}
    title="커뮤니티 관리"
    perPage={25}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show" bulkActionButtons={<BulkDeleteButton />}>
      <TextField source="id" label="ID" />
      <TextField source="title" label="제목" />
      <TextField source="content" label="내용" />
      <FunctionField
        label="카테고리"
        render={(record: any) => <CategoryField record={record} />}
      />
      <FunctionField
        label="하위 카테고리"
        render={(record: any) => <SubCategoryField record={record} />}
      />
      <TextField source="userNickname" label="작성자" />
      <TextField source="id" label="작성자 ID" />
      <NumberField source="likeCount" label="좋아요 수" />
      <NumberField source="commentCount" label="댓글 수" />
      <NumberField source="viewCount" label="조회 수" />
      <KoreanDateField source="createdAt" label="작성일" showTime />
    </Datagrid>
  </List>
);
