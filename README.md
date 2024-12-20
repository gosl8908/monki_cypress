# Backoffice Automation Scripts

이 프로젝트는 [Cypress](https://www.cypress.io/)를 활용하여 Backoffice의 주요 기능을 자동화하고 테스트하기 위해 설계된 스크립트입니다.

## 📋 프로젝트 개요

Backoffice 관리 시스템의 주요 기능을 효율적으로 검증하기 위해 Cypress를 사용한 자동화 스크립트를 제공합니다.  
이 프로젝트는 다음과 같은 작업을 지원합니다:

- **UI 자동화 테스트**: 버튼 클릭, 입력 필드 검증, 동적 요소 처리 등.
- **API 테스트**: Cypress 내장 기능을 활용한 REST API 테스트.
- **리포트 생성 및 알림**: 테스트 결과 리포트를 생성하고 이메일로 전송.
- **CI/CD 통합**: GitHub Actions를 사용하여 자동화 테스트를 실행.

---

## 📦 주요 기능

- **UI 테스트**: Backoffice 주요 페이지와 워크플로의 UI 요소 테스트.
- **조건부 동작**: 특정 조건에 따라 동적으로 UI 동작 수행.
- **에러 관리 및 리포팅**: 실패 시 스크린샷 저장, 로깅, 이메일 리포트 전송.
- **Shell 스크립트 통합**: 테스트 준비 및 데이터 초기화를 위한 Shell 스크립트 포함.

---
## ⚙️ 디렉토리 구조  
```
project-directory/  
├── .github/workflows/   # GitHub Actions 설정 파일  
├── .vscode/             # VSCode 설정  
├── cypress/             # Cypress 테스트 관련 파일  
│   ├── fixtures/        # 테스트 데이터  
│   ├── e2e/             # 테스트 스크립트  
│   ├── reports/         # 테스트 결과 리포트  
│   ├── support/         # 공통 함수 및 명령어  
├── node_modules/        # 프로젝트 의존성  
├── shell/               # Shell 스크립트  
├── .eslintignore        # ESLint 제외 파일 설정  
├── .eslintrc.js         # ESLint 설정  
├── .gitignore           # Git 제외 파일 설정  
├── .prettierignore      # Prettier 제외 파일 설정  
├── .prettierrc          # Prettier 설정  
├── cypress.config.js    # Cypress 기본 설정  
├── package-lock.json    # NPM 종속성 잠금 파일  
├── package.json         # 프로젝트 메타데이터 및 의존성  
├── yarn.lock            # Yarn 종속성 잠금 파일  
└── README.md            # 프로젝트 문서 
```
---

## 🧪 GitHub Actions 통합
.github/workflows 디렉토리에 GitHub Actions 워크플로가 포함되어 있습니다. 이 워크플로는 다음 작업을 자동화합니다:

1. 의존성 설치
2. Cypress 테스트 실행
3. 테스트 결과를 CI/CD 리포트로 저장

## 워크플로 실행
GitHub 저장소에 푸시하면 CI/CD 파이프라인이 자동으로 실행됩니다.

---


