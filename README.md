# 똑똑(Knock Knock)

## 기술 스택

| 항목                 | 내용                                                      |
| -------------------- | --------------------------------------------------------- |
| **Language**         | TypeScript                                                |
| **Framework**        | Next.js                                                   |
| **Build Tool**       | Webpack 5                                                 |
| **Transpiler**       | SWC                                                       |
| **Package Manager**  | Pnpm<br>※ 전역 설치 필요: `npm install -g pnpm`           |
| **Database (BaaS)**  | Supabase                                                  |
| **State Management** | - Server State: TanStack Query<br>- Client State: Zustand |
| **UI Library**       | shadcn/ui                                                 |
| **CSS Framework**    | TailwindCSS                                               |
| **Deployment**       | Vercel                                                    |

# Git 작업 메시지 규칙

## 메시지 타입별 형식

| 메시지 타입      | 설명                         | 예시                         |
| ---------------- | ---------------------------- | ---------------------------- |
| **Issue**        | `[키워드] 작업 내용`         | `[Feat] 검색 기능 버그 수정` |
| **Commit**       | `이슈 넘버/키워드: 수정사항` | `#1/Feat: 로그인 기능 추가`  |
| **Pull Request** | `이슈 넘버/키워드: 수정사항` | `#2/Docs: README.md 수정`    |

---

## 키워드 (태그)

| 태그 이름    | 설명                     |
| ------------ | ------------------------ |
| **Feat**     | 기능 추가                |
| **Fix**      | 버그 수정                |
| **Docs**     | 문서 작업                |
| **Style**    | 디자인 작업              |
| **Test**     | 테스트 코드 추가, 수정   |
| **Refactor** | 코드 리팩토링            |
| **Chore**    | 코드 수정 없이 설정 변경 |

---

## 브랜치 구조

- `main`: 배포용 브랜치
- `develop`: 개발용 통합 브랜치
- `feat/이슈 넘버`: 기능 개발 브랜치 예) `feat/12`
