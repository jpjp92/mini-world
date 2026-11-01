# 미니 월드

세 개의 섬을 돌아다니며 열한 가지 스포츠 미니게임에 도전하는 2D 웹 게임이에요.

- **바나나 아일랜드**: 축구, 테니스, 바나나 런, 스타라이트 점프
- **챔피언 코브**: 사이클, 야구, 프리킥, 양궁
- **스노우 피크**: 스키, 피겨, 태권도

섬에서 바나나·조개·별을 채집해 코인과 챌린지 포인트를 모으고, 구장에 도전해 레벨과 챔피언 트로피를 얻어요. 장식으로 섬을 꾸미고, 주민 심부름과 퀴즈도 즐길 수 있어요.

> 단일 HTML 파일(v23)로 만든 게임을 Next.js 앱으로 옮기는 중이에요. 지금은 v23 코드를 레거시 모듈로 그대로 실행하면서 기능을 하나씩 분리하고 있어요.

## 기술 스택

- Next.js 16 (App Router) · React 19 · TypeScript
- Canvas 2D (게임 루프는 React 밖에서 실행)
- Zustand (게임 상태)
- Supabase (닉네임 로그인, 클라우드 저장, 리더보드 예정)
- Vitest · Playwright
- pnpm · Vercel

## 시작하기

```bash
pnpm install
cp .env.example .env.local   # 값 채우기
pnpm dev                     # http://localhost:3000
```

| 명령 | 설명 |
|------|------|
| `pnpm dev` | 개발 서버 |
| `pnpm build` / `pnpm start` | 프로덕션 빌드 / 실행 |
| `pnpm lint` / `pnpm typecheck` | 린트 / 타입 검사 |
| `pnpm test` | 단위 테스트 |
| `pnpm test:e2e` | E2E 테스트 (처음 한 번 `pnpm exec playwright install chromium`) |

환경 변수는 [.env.example](.env.example)을 참고하세요. 캐릭터 이미지 주소를 비워두면 도형 캐릭터로 그려져요.

## 구조

```
src/
  app/          # 페이지 (/ 게임, /lab 새 엔진 실험)
  legacy/v23/   # v23 게임 코드 (분리 진행 중)
  config/       # 종목·섬·캐릭터 데이터
  store/        # 게임 상태 스토어, 저장 데이터 검사·직렬화
  engine/       # 게임 루프, 입력, 그리기
  world/        # 캐릭터 등 월드 요소
  ui/           # React 컴포넌트
tests/          # unit, e2e
docs/           # 기획, 작업 일지, 개발 가이드
```

## 진행 상황

- [x] Phase 0: Next.js 셸, 테스트 환경
- [ ] Phase 1: v23 이전 (레거시 모듈 실행 ✅, 설정 데이터 분리 ✅, 상태·저장 분리 ✅, UI React화)
- [ ] Phase 2: 종목 11개 모듈 분리
- [ ] Phase 3: 닉네임 로그인, 클라우드 저장
- [ ] Phase 4: 기록과 주간 리더보드

## 문서

- [개발 가이드](docs/guide.md): 명령어, 구조, 설계 원칙, 저장소 규칙
- [기획](docs/plan_2026-11-01.md)
- 작업 일지: `docs/log_YYYY-MM-DD.md`
