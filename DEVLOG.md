# 드림아이티비즈 (DreamIT BIZ) 개발일지

> 온라인 IT 교육 플랫폼 — React + Supabase + Iamport 기반 풀스택 전환 프로젝트  
> GitHub: https://github.com/yoonrileychoi/rest06

---

## 2026-06-17 (1일차)

### 작업 개요

정적 HTML 5페이지 → React 18 + Supabase + Iamport 풀스택 앱으로 전체 전환.  
Google/Kakao 소셜 로그인, 강좌 결제 기능, GitHub Actions 자동 배포까지 완성.

---

### 커밋 이력

| 해시 | 내용 |
|------|------|
| `3129032` | 초기 업로드: 정적 HTML 사이트 전체 35개 파일 |
| `498534e` | index.html 진입점 생성 + 내부 링크 `DreamIT BIZ.html` → `index.html` 수정 |
| `793be8f` | React + Supabase + Iamport 앱 전환 (36개 파일 추가) |
| `ae19a44` | 개발일지 DEVLOG.md 최초 작성 |
| 현재 | Supabase 클라이언트 빌드 안전성 수정, 개발일지 상세화 |

---

### 기술 스택

| 분류 | 기술 | 용도 |
|------|------|------|
| 빌드 | Vite 6 | 개발 서버 + 번들링 |
| UI | React 18 | 컴포넌트 기반 UI |
| 라우팅 | React Router 6 | SPA 페이지 전환 |
| 백엔드 | Supabase | 인증 + DB + 스토리지 |
| 로그인 | Supabase Auth OAuth | Google, Kakao |
| 결제 | Iamport (PortOne) | 국내 PG 연동 (기능 구현 완료, 실키 미연동) |
| 배포 | GitHub Actions → GitHub Pages | 자동 CI/CD |

---

### 프로젝트 구조

```
rest06/
├── .github/workflows/deploy.yml   ← GitHub Pages 자동 배포 워크플로우
├── public/
│   └── assets/                   ← 강좌 이미지(c1~c6), 강사 이미지(t1~t4), og-image
├── src/
│   ├── lib/supabase.js            ← Supabase 클라이언트 (환경변수 없어도 빌드 가능)
│   ├── context/AuthContext.jsx    ← 전역 로그인 상태, Google/Kakao signIn/signOut
│   ├── components/
│   │   ├── auth/LoginModal.jsx    ← 소셜 로그인 모달 (Google 파란버튼, Kakao 노란버튼)
│   │   ├── layout/Header.jsx      ← 스크롤 감지 헤더, 드롭다운 메뉴, 모바일 햄버거
│   │   ├── layout/Footer.jsx      ← 푸터
│   │   └── payment/usePayment.js  ← Iamport 결제 훅 + Supabase purchases 저장
│   ├── pages/
│   │   ├── Home.jsx               ← 히어로, 통계, 강좌(결제), 튜터, 후기, CTA
│   │   ├── About.jsx              ← 회사소개, 강사 프로필, 오시는 길
│   │   ├── Courses.jsx            ← 온라인/오프라인 탭 전환 + 강좌별 결제
│   │   ├── Certifications.jsx     ← AWS / SQLD / 정보처리기사 / 컴활
│   │   ├── AI.jsx                 ← AI 활용 트랙 소개
│   │   ├── Community.jsx          ← 공지사항 + Q&A (Supabase 실시간 조회)
│   │   └── Corporate.jsx          ← 기업교육 파트너사 + 문의 폼 (Supabase 저장)
│   ├── App.jsx                    ← 라우터
│   ├── main.jsx                   ← BrowserRouter(basename=/rest06) + AuthProvider
│   └── index.css                  ← React 전용 추가 스타일
├── styles.css                     ← 기존 메인 CSS (그대로 유지)
├── pages.css                      ← 기존 하위 페이지 CSS (그대로 유지)
├── index.html                     ← Vite 진입점 + Iamport CDN 스크립트
├── vite.config.js                 ← base: '/rest06/'
├── package.json
└── .env.example                   ← 필요한 환경변수 목록
```

---

### 구현 기능 상세

#### 소셜 로그인
- 헤더 우측 "로그인" 버튼 클릭 → 모달 팝업
- Google 계정 / 카카오 계정 버튼 클릭 → Supabase OAuth 리다이렉트
- 로그인 성공 시 헤더에 사용자 이름 표시 + "로그아웃" 버튼 전환
- 로그인 상태는 `localStorage` 기반 세션으로 유지 (Supabase 자동 처리)

#### 결제 (Iamport)
- 강좌 카드마다 "수강 신청" 버튼 존재
- 비로그인 상태 → 클릭 시 로그인 모달 자동 표시
- 로그인 상태 → Iamport 결제창 호출
- 결제 성공 시 Supabase `purchases` 테이블에 기록
- **현재 상태**: 기능 코드 완성, 실제 가맹점 코드 미연동 (사업자 등록 후 연동 예정)

#### 기업교육 문의 폼
- 회사명, 담당자명, 이메일, 연락처, 문의내용 입력 → Supabase `corporate_inquiries` 저장
- 제출 성공 시 감사 메시지 표시

#### 커뮤니티 Q&A
- Supabase `community_posts` 테이블 실시간 조회
- 현재 읽기 전용 (작성 기능은 추후 개발 예정)

---

### Supabase 설정 안내

#### 1. Google OAuth 연동 방법
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. `API 및 서비스` → `사용자 인증 정보` → `OAuth 2.0 클라이언트 ID` 생성
4. **애플리케이션 유형**: 웹 애플리케이션
5. **승인된 리디렉션 URI** 추가:
   ```
   https://<your-supabase-project>.supabase.co/auth/v1/callback
   ```
6. 생성된 **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사
7. Supabase 대시보드 → `Authentication` → `Providers` → `Google` 활성화 후 붙여넣기

> Supabase에서 보이는 "Client ID / Client Secret"이 Google Cloud Console의 OAuth 자격증명입니다.  
> Google Developer Console에서 **"REST key"를 찾는 것이 아니라** OAuth 2.0 클라이언트 ID를 생성해야 합니다.

#### 2. Kakao OAuth 연동 방법
1. [Kakao Developers](https://developers.kakao.com) 접속 → 앱 생성
2. `앱 설정` → `플랫폼` → 웹 플랫폼 등록: `https://yoonrileychoi.github.io`
3. `제품 설정` → `카카오 로그인` 활성화
4. **Redirect URI** 추가:
   ```
   https://<your-supabase-project>.supabase.co/auth/v1/callback
   ```
5. `앱 키` → **REST API 키** 복사
6. Supabase 대시보드 → `Authentication` → `Providers` → `Kakao` 활성화 후 붙여넣기

#### 3. Redirect URL이란?
OAuth 로그인 후 사용자를 다시 앱으로 보내는 주소입니다.  
Supabase 대시보드 → `Authentication` → `URL Configuration` → **Site URL** 및 **Redirect URLs** 에 추가:
```
https://yoonrileychoi.github.io/rest06/
http://localhost:5173/rest06/
```
> Site URL: `https://yoonrileychoi.github.io/rest06/`  
> Redirect URLs: 위 두 줄 모두 추가 (개발환경 + 프로덕션)

---

### 데이터베이스 테이블 3개

Supabase 대시보드 → `Table Editor` 또는 `SQL Editor`에서 실행:

#### purchases (결제 내역)
```sql
create table public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  course_id text not null,
  imp_uid text,
  merchant_uid text,
  amount integer not null,
  paid_at timestamptz,
  created_at timestamptz default now()
);
alter table public.purchases enable row level security;
create policy "users can view own purchases"
  on public.purchases for select using (auth.uid() = user_id);
create policy "users can insert own purchases"
  on public.purchases for insert with check (auth.uid() = user_id);
```

#### corporate_inquiries (기업교육 문의)
```sql
create table public.corporate_inquiries (
  id uuid default gen_random_uuid() primary key,
  company text,
  name text,
  email text,
  phone text,
  message text,
  created_at timestamptz default now()
);
alter table public.corporate_inquiries enable row level security;
create policy "anyone can insert inquiry"
  on public.corporate_inquiries for insert with check (true);
```

#### community_posts (커뮤니티 게시글)
```sql
create table public.community_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  content text,
  created_at timestamptz default now()
);
alter table public.community_posts enable row level security;
create policy "anyone can view posts"
  on public.community_posts for select using (true);
create policy "logged in users can post"
  on public.community_posts for insert with check (auth.uid() = user_id);
```

---

### GitHub Actions 배포 설정

1. GitHub 리포지토리 → **Settings** → **Pages**
2. **Source**: `GitHub Actions` 선택 (Deploy from branch 아님)
3. 저장 후 다음 푸시 시 자동 배포 시작

**필요한 GitHub Secrets** (Settings → Secrets and variables → Actions):

| 이름 | 값 |
|------|---|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key |
| `VITE_IAMPORT_CODE` | `imp_XXXXXXXX` (사업자 등록 후 추가) |

---

### 현재 상태 (2026-06-17 기준)

| 기능 | 상태 |
|------|------|
| React 앱 구조 | ✅ 완료 |
| 7개 페이지 컴포넌트 | ✅ 완료 |
| 헤더 / 푸터 / 라우팅 | ✅ 완료 |
| Google 로그인 UI | ✅ 완료 (Supabase 설정 후 동작) |
| Kakao 로그인 UI | ✅ 완료 (Supabase 설정 후 동작) |
| Iamport 결제 코드 | ✅ 완료 (가맹점 코드 미연동) |
| Supabase DB 연동 | ✅ 완료 (테이블 생성 필요) |
| GitHub Actions 배포 | ✅ 워크플로우 완료 (Pages 활성화 필요) |
| 로컬 빌드 | ✅ 성공 확인 |

---

### 향후 개발 계획

- [ ] GitHub Pages 활성화 → 실제 배포 URL 확인
- [ ] Supabase Google / Kakao OAuth 실 연동
- [ ] Supabase 테이블 3개 생성 + RLS 적용
- [ ] 강좌 상세 페이지 (`/courses/:id`)
- [ ] 마이페이지 (수강 내역 조회)
- [ ] Iamport 사업자 등록 후 실결제 연동
- [ ] Supabase Edge Functions로 서버 사이드 결제 검증
- [ ] 커뮤니티 게시글 작성 / 수정 / 삭제
- [ ] 다크 모드 + 컬러 팔레트 설정 저장 (Supabase user metadata)
