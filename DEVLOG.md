# 드림아이티비즈 (DreamIT BIZ) 개발일지

> 온라인 IT 교육 플랫폼 — React + Supabase + Iamport 기반 풀스택 전환 프로젝트

---

## 2026-06-17

### 1단계 · 파일 업로드 및 초기 구조 구성

**작업 내용**
- 로컬 `C:\YOON\바이브코딩_수도권이노베이션스퀘어\수업내용\rest06` 폴더의 정적 HTML 사이트 전체를 GitHub 리포지토리(`yoonrileychoi/rest06`)에 업로드
- 기존 파일 목록: `DreamIT BIZ.html`, `about.html`, `ai.html`, `certifications.html`, `community.html`, `corporate.html`, `courses.html`, `styles.css`, `pages.css`, `app.js`, `site.js`, `page.js`, `palette.js`, `tweaks.jsx`, `tweaks-panel.jsx`, 이미지 자산 (courses × 6, tutors × 4, og-image)
- `index.html` 진입점 생성 — GitHub Pages 기본 파일명 요구사항 충족
- 모든 하위 페이지의 내부 링크 `"DreamIT BIZ.html"` → `"index.html"` 일괄 수정
- `site.js`의 `HOME` 변수도 `index.html`로 수정

**커밋**
```
Initial upload: DreamIT BIZ 온라인 IT 교육 플랫폼 사이트 전체 파일
Add index.html entry point and fix internal links
```

---

### 2단계 · React + Supabase + Iamport 기술 스택 전환

**배경**
- 정적 HTML → 풀스택 React 앱으로 전환 요청
- 구글 로그인, 카카오 로그인, 결제(아임포트) 기능 추가 필요

**기술 스택 결정**

| 영역 | 선택 | 이유 |
|------|------|------|
| 빌드 도구 | Vite 6 | 빠른 HMR, 가벼운 설정 |
| UI 프레임워크 | React 18 | 컴포넌트 재사용성 |
| 라우팅 | React Router 6 | SPA 페이지 전환 |
| 백엔드/DB | Supabase | Auth + DB + Storage 통합 |
| 소셜 로그인 | Supabase Auth | Google, Kakao OAuth 지원 |
| 결제 | Iamport (PortOne) | 국내 PG 연동 표준 |
| 배포 | GitHub Actions → GitHub Pages | CI/CD 자동화 |

**구현한 파일 구조**
```
rest06/
├── .github/workflows/deploy.yml   # GitHub Pages 자동 배포
├── public/assets/                 # 이미지 자산 (courses, tutors)
├── src/
│   ├── context/AuthContext.jsx    # Google + Kakao 로그인 컨텍스트
│   ├── lib/supabase.js            # Supabase 클라이언트
│   ├── components/
│   │   ├── auth/LoginModal.jsx    # 소셜 로그인 모달 UI
│   │   ├── layout/Header.jsx      # 반응형 헤더 + 드롭다운 메뉴
│   │   ├── layout/Footer.jsx      # 푸터
│   │   └── payment/usePayment.js  # Iamport 결제 훅
│   ├── pages/
│   │   ├── Home.jsx               # 메인 페이지 (히어로, 강좌, 튜터 등)
│   │   ├── About.jsx              # 회사소개 + 강사소개 + 오시는 길
│   │   ├── Courses.jsx            # 온라인/오프라인 강좌 + 결제 버튼
│   │   ├── Certifications.jsx     # AWS, SQLD, 정보처리기사, 컴활
│   │   ├── AI.jsx                 # AI 활용 트랙
│   │   ├── Community.jsx          # 공지사항 + Q&A (Supabase 연동)
│   │   └── Corporate.jsx          # 기업교육 문의 폼 (Supabase 저장)
│   ├── App.jsx                    # 라우터 설정
│   └── main.jsx                   # 앱 진입점
├── index.html                     # Vite HTML 템플릿
├── vite.config.js                 # base: '/rest06/'
├── package.json
└── .env.example                   # 필요한 환경변수 목록
```

**주요 기능 상세**

#### 인증 (Supabase Auth)
- `AuthContext.jsx` — 전역 로그인 상태 관리
- Google OAuth: Supabase 대시보드에서 Google provider 활성화 필요
- Kakao OAuth: Supabase 대시보드에서 Kakao provider 활성화 필요
- 로그인 후 리다이렉트: `window.location.origin + '/rest06/'`

#### 결제 (Iamport / PortOne)
- `usePayment.js` 훅으로 캡슐화
- 결제 완료 후 Supabase `purchases` 테이블에 기록
- 미로그인 상태에서 "수강 신청" 클릭 시 → 로그인 모달 자동 표시

#### 기업 교육 문의
- Corporate 페이지의 문의 폼 → Supabase `corporate_inquiries` 테이블 저장

#### GitHub Actions 자동 배포
- `master` 브랜치 푸시 시 자동 빌드 → GitHub Pages 배포
- 환경변수는 GitHub Secrets에서 주입

---

### 설정 필요 사항 (배포 전 체크리스트)

#### Supabase 대시보드
- [ ] Google OAuth 활성화 (Authentication → Providers → Google)
- [ ] Kakao OAuth 활성화 (Authentication → Providers → Kakao)
- [ ] Redirect URL 추가: `https://yoonrileychoi.github.io/rest06/`
- [ ] `purchases` 테이블 생성:
  ```sql
  create table purchases (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id),
    course_id text,
    imp_uid text,
    merchant_uid text,
    amount integer,
    paid_at timestamptz
  );
  ```
- [ ] `corporate_inquiries` 테이블 생성:
  ```sql
  create table corporate_inquiries (
    id uuid default gen_random_uuid() primary key,
    company text,
    name text,
    email text,
    phone text,
    message text,
    created_at timestamptz
  );
  ```
- [ ] `community_posts` 테이블 생성:
  ```sql
  create table community_posts (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id),
    title text,
    content text,
    created_at timestamptz default now()
  );
  ```

#### GitHub Secrets (Settings → Secrets and variables → Actions)
- [ ] `VITE_SUPABASE_URL` — Supabase 프로젝트 URL
- [ ] `VITE_SUPABASE_ANON_KEY` — Supabase anon public key
- [ ] `VITE_IAMPORT_CODE` — 아임포트 가맹점 식별코드 (imp_XXXXXXXX)

#### GitHub Pages 활성화
- Settings → Pages → Source: **GitHub Actions** 선택

#### Iamport (PortOne)
- [ ] PortOne 콘솔에서 사이트 등록
- [ ] 허용 도메인에 `yoonrileychoi.github.io` 추가

---

## 향후 계획

- [ ] Supabase Row Level Security (RLS) 정책 설정
- [ ] 강좌 상세 페이지 (`/courses/:id`) 구현
- [ ] 수강 내역 마이페이지 구현
- [ ] Iamport 서버 사이드 결제 검증 (Supabase Edge Functions)
- [ ] 커뮤니티 게시글 작성 기능
- [ ] 다크 모드 + 컬러 테마 설정 유지 (기존 palette.js 로직 React 이식)
