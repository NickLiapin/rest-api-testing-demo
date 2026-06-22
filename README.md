# REST API Test Automation

[![API Tests](https://github.com/NickLiapin/rest-api-testing-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/NickLiapin/rest-api-testing-demo/actions/workflows/ci.yml)
[![Playwright](https://img.shields.io/badge/Playwright-API-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/docs/api-testing)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

API test automation built with **Playwright's API testing** (request context, no
browser) in **TypeScript**. It covers a REST service end to end: authentication,
full CRUD, status codes, error handling and **JSON-schema validation** of responses.

The system under test is a small **bundled mock service** (`server/`), started
automatically before the tests. That keeps the suite **hermetic** - it runs the same
on any machine and in CI, with no external environment to depend on.

## What this demonstrates

- **API CRUD coverage** - create, read, update, delete, with positive and negative cases.
- **Auth testing** - token issuance, rejected credentials, and protected endpoints (401).
- **Contract testing** - responses validated against a JSON schema (Ajv).
- **Status-code & error assertions** - 200 / 201 / 204 / 400 / 401 / 404.
- **Hermetic CI** - a bundled mock is launched via Playwright's `webServer`; no browser
  binaries are downloaded, so runs are fast and reliable.

## Project structure

```
rest-api-testing-demo/
|-- server/index.js        # Bundled in-memory mock REST service (system under test)
|-- tests/                 # API specs: auth + users CRUD
|-- utils/schemas.ts       # JSON schemas + Ajv validation helper
|-- playwright.config.ts   # baseURL, reporters, webServer (auto-starts the mock)
`-- .github/workflows/     # GitHub Actions CI
```

## Running locally

```bash
npm install
npm test          # starts the mock automatically and runs the suite
npm run report    # open the HTML report
```

You can also run the mock on its own: `npm start` (serves on `http://localhost:4000`).

## Continuous Integration

Every push / pull request runs the full suite on GitHub Actions. Because the mock is
bundled and started by Playwright, there is no external dependency - the run is
deterministic. The HTML report is uploaded as a build artifact.

## Tech

Playwright (API), TypeScript, Ajv, Express (mock), GitHub Actions

---

Built by **Nick Liapin** - Senior SDET / QA Automation Engineer. A focused portfolio
demo of API test automation patterns; the approach scales to real services by pointing
the `baseURL` at the target environment.
