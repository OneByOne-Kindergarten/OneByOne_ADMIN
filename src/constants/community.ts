// 🏷️ 커뮤니티 관련 상수들

// 하위 카테고리 라벨 매핑
export const SUB_CATEGORY_LABELS = {
  free: "자유",
  salary: "월급/취업",
  class: "수업/환경구성",
  guidance: "유아지도",
  university: "대학생활",
  practice: "실습",
  job: "취업/면접",
} as const;

// 카테고리별 하위 카테고리 선택지
export const SUB_CATEGORY_CHOICES = {
  TEACHER: [
    { id: "free", name: "자유" },
    { id: "guidance", name: "유아지도" },
    { id: "salary", name: "월급/취업" },
    { id: "class", name: "수업/환경구성" },
  ],
  PROSPECTIVE_TEACHER: [
    { id: "university", name: "대학생활" },
    { id: "practice", name: "실습" },
    { id: "job", name: "취업/면접" },
  ],
} as const;

// 카테고리 라벨 매핑
export const CATEGORY_LABELS = {
  TEACHER: "교사",
  PROSPECTIVE_TEACHER: "예비교사",
} as const;

// 타입 정의
export type SubCategoryKey = keyof typeof SUB_CATEGORY_LABELS;
export type CategoryKey = keyof typeof SUB_CATEGORY_CHOICES;
