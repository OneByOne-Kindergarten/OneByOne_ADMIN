# OneByOne 관리자 대시보드

OneByOne 어플리케이션의 관리자 페이지입니다. React-Admin을 기반으로 구축되었습니다.

## 🚀 기술 스택

- **React 19** + **TypeScript**
- **Vite** - 빠른 개발 환경
- **React-Admin** - 어드민 대시보드 프레임워크
- **Material-UI** - UI 컴포넌트 라이브러리
- **TanStack Query** - 서버 상태 관리
- **Tailwind CSS** - 유틸리티 퍼스트 CSS 프레임워크
- **React Hook Form** + **Zod** - 폼 관리 및 검증

## 📱 주요 기능

### 관리 기능

- **사용자 관리**: 사용자 목록, 역할 관리, 계정 상태 관리
- **유치원 관리**: 유치원 정보 관리, 승인/거부 처리
- **문의 관리**: 사용자 문의 처리 및 응답
- **커뮤니티 관리**: 게시글 및 댓글 관리, 신고 처리
- **리뷰 관리**: 유치원 리뷰 관리 및 검토

### 대시보드 기능

- 실시간 통계 대시보드
- 사용자 활동 모니터링
- 시스템 상태 모니터링

## 🛠 설치 및 실행

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── components/          # UI 컴포넌트
│   ├── users/          # 사용자 관리 컴포넌트
│   ├── kindergartens/  # 유치원 관리 컴포넌트
│   ├── inquiries/      # 문의 관리 컴포넌트
│   ├── community/      # 커뮤니티 관리 컴포넌트
│   └── reviews/        # 리뷰 관리 컴포넌트
├── providers/          # 데이터 및 인증 프로바이더
│   ├── dataProvider.ts # 데이터 프로바이더
│   └── authProvider.ts # 인증 프로바이더
├── App.tsx            # 메인 앱 컴포넌트
└── main.tsx           # 앱 진입점
```

## 🔧 설정

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
# OneByOne Admin API Configuration
VITE_API_URL=https://api.onebyone.live
VITE_ADMIN_TOKEN=
```

**중요:** `env.local.example` 파일을 복사하여 `.env.local` 파일을 생성하세요.

### 실행 방법

```bash
npm run dev
```

### 🔑 어드민 계정 로그인

실제 OneByOne API와 연동하여 어드민 페이지에 접근하려면:

1. **ADMIN 역할을 가진 계정 필요**: 일반 사용자 로그인 후 역할이 "ADMIN"인지 확인
2. **로그인 방법**:
   - 이메일과 비밀번호로 로그인
   - 시스템이 자동으로 ADMIN 역할 확인
   - ADMIN 역할이 아닌 경우 접근 거부

```typescript
// 어드민 로그인 프로세스
1. POST /users/sign-in (이메일/비밀번호)
2. GET /users (사용자 정보 조회)
3. 역할이 "ADMIN"인지 확인
4. ADMIN이면 어드민 대시보드 접근 허용
```

### 🌐 실제 API 연동 정보

[OneByOne API 스웨거 문서](https://api.onebyone.live/swagger-ui/index.html)를 기반으로 구현:

- **API Base URL**: `https://api.onebyone.live`
- **사용자 관리**: `/users/*`
- **유치원 관리**: `/kindergarten/*`
- **문의 관리**: `/inquiry/*`
- **커뮤니티 관리**: `/community/*`
- **리뷰 관리**: `/work/review`, `/internship/review`
- **인증**: `/users/sign-in`, `/users/reissue`

## 📋 환경 요구사항

- Node.js 20.16.0 이상
- npm 10.8.1 이상

## 🔒 보안

- 관리자 전용 인증 시스템
- 권한 기반 접근 제어
- HTTPS 사용 권장 (프로덕션 환경)

## 📝 라이선스

이 프로젝트는 OneByOne 팀의 소유입니다.
