# mini-world

2D 캔버스 기반 스포츠 미니게임 월드. 섬 3개, 종목 11개, 캐릭터 12명.
단일 HTML(v23, ~1MB)로 작성된 게임을 Next.js 앱으로 이전하는 프로젝트입니다.

## Stack

| 영역 | 사용 |
|------|------|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Rendering | Canvas 2D, `requestAnimationFrame` 루프 (React 렌더 사이클 밖) |
| State | Zustand (vanilla store) |
| Backend | Supabase (Postgres + RLS, Auth, Storage) |
| Test | Vitest (unit), Playwright (e2e) |
| Tooling | pnpm, ESLint, Vercel |

## Architecture

```
React Header ──subscribe(selector)──▶ gameStore (Zustand) ◀──touch/replace── legacy game (v23)
                                   │                                      │
                              saveData                              Canvas 2D loop
                     (default · sanitize · serialize)            (world + arcade)
                                   │
                              localStorage  ──(Phase 3)──▶  Supabase mini_world.saves
```

- **Strangler 방식 이전**: v23 스크립트를 `src/legacy/v23/`에서 그대로 실행하고, 기능 단위로 `config` → `store` → `ui` → `games`로 분리합니다.
- **엔진/React 분리**: 프레임 루프는 React 밖에서 돌고, UI를 헤더부터 React로 옮기는 중입니다. `src/engine`, `src/games`는 Next.js에 의존하지 않습니다.
- **상태 2계층**: 저장 대상(`state`: 코인·레벨·기록)은 store, 비저장 대상(`runtime`: 입력·카메라·진행 중 판)은 엔진 내부.
- **헤더 React화**: 재화·효과음·저장 상태를 selector로 구독합니다. 헤더 버튼은 레거시가 반환하는 액션으로 기존 설정 모달을 엽니다. 효과음·도움말 버튼은 v23 디자인대로 숨기고 설정 화면에서 제공합니다. 사이드바·모달은 레거시 DOM 렌더링을 유지합니다.
- **저장 포맷 v4**: v2/v3 필드 호환. 로드 시 `sanitizeSave`에서 범위·타입을 정리하고, 구버전 저장 키와 캐릭터 id를 자동 마이그레이션합니다.

## Project Structure

```
src/
├─ app/            # 라우트: /(게임), /lab(신규 엔진 실험)
├─ legacy/v23/     # v23 게임 스크립트·마크업·CSS (분리 진행 중)
├─ config/         # 종목·섬·지역·스테이션·장식·캐릭터 데이터 (타입 정의 포함)
├─ store/          # gameStore, saveData
├─ engine/         # 루프, 입력, 그리기 헬퍼
├─ world/          # 캐릭터 렌더링, SVG 초상화 폴백
└─ ui/             # React 헤더(GameHeader), 레거시 부팅, 실험용 캔버스
tests/
├─ unit/           # config, saveData, 저장 마이그레이션, 금지 명칭 검사
└─ e2e/            # 부팅·이동·저장 유지·이미지 폴백·헤더 연동
docs/
├─ plans/          # plan_YYYY-MM-DD.md
├─ logs/           # log_YYYY-MM-DD.md
└─ guides/         # guide_YYYY-MM-DD.md
```

## Getting Started

Node.js 24, pnpm 10 기준.

```bash
pnpm install
cp .env.example .env.local
pnpm dev                          # http://localhost:3000
```

### Scripts

| 명령 | 설명 |
|------|------|
| `pnpm dev` | 개발 서버 (Turbopack) |
| `pnpm build` / `pnpm start` | 프로덕션 빌드 / 실행 |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | 라우트 타입 생성 + `tsc --noEmit` |
| `pnpm test` | 단위 테스트 |
| `pnpm test:e2e` | E2E 테스트 (최초 1회 `pnpm exec playwright install chromium`) |

### Environment Variables

| 변수 | 범위 | 용도 |
|------|------|------|
| `NEXT_PUBLIC_CHARACTER_BASE_URL` | public | 캐릭터 이미지 경로 (`<base>/<id>.webp`). 비우면 도형·SVG 폴백 |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public | Supabase publishable(anon) 키, RLS로 보호 |
| `SUPABASE_SECRET_KEY` | server only | 점수 제출 API 전용 (Phase 4) |

## Data (Supabase)

공유 프로젝트 안의 전용 스키마 `mini_world`를 사용합니다.

| 객체 | 설명 | RLS |
|------|------|-----|
| `profiles` | 닉네임(대소문자 무시 unique), 대표 캐릭터 | 본인 행 |
| `saves` | 저장 JSON, 1인 1행 | 본인 행 |
| `runs` | 판 기록, 서버(service role)만 insert | 본인 행 읽기 |
| `leaderboard_weekly` | 주간 종목별 최고 점수 뷰 | 공개 읽기 |
| `mini-world-characters` | 캐릭터 이미지 버킷 | 공개 읽기 |

## Roadmap

- [x] **Phase 0** — Next.js 셸, 테스트 환경
- [ ] **Phase 1** — v23 이전: 레거시 모듈 실행 ✅ · config 분리 ✅ · store 분리 ✅ · 헤더 React화 ✅ · 사이드바/모달 React화 · 엔진 분리
- [ ] **Phase 2** — 종목 11개를 `GameModule` 인터페이스로 분리, 레거시 제거
- [ ] **Phase 3** — 닉네임 로그인(익명 세션), 클라우드 저장
- [ ] **Phase 4** — 판 기록 검증 API, 주간 리더보드

## Docs

- [Guide](docs/guides/guide_2026-11-01.md) — 명령어, 구조, 설계 원칙, 저장소 규칙
- [Plan](docs/plans/plan_2026-11-01.md) — 범위, 아키텍처, 데이터 설계, 로드맵
- [Logs](docs/logs/) — 일자별 작업 기록
