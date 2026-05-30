# Commit Guide

This project uses short, focused commits with clear, descriptive messages.

## Recommended Format

Use Conventional Commits when possible:

`<type>(<scope>): <short summary>`

Examples:

- `feat(auth): add JWT login response`
- `fix(pavilion): include booking totals in response`
- `docs(commit): add commit message guide`
- `refactor(api): simplify pavilion controller DTO`

## Common Types

- `feat` for new user-facing or API functionality
- `fix` for bug fixes and regressions
- `docs` for documentation-only changes
- `refactor` for behavior-preserving code changes
- `test` for tests and test updates
- `chore` for tooling, maintenance, and dependency updates

## Choosing a Scope

Use a scope that matches the area you changed:

- `auth`
- `pavilion`
- `pool`
- `court`
- `maintenance`
- `frontend`
- `backend`
- `db`
- `docs`

If the change spans multiple areas, keep the scope broad enough to stay accurate, for example `feat(backend)` or `fix(frontend)`.

## Commit Message Rules

- Keep the subject line under 72 characters when possible.
- Write in the imperative mood: `add`, `fix`, `update`, not `added` or `fixed`.
- Make one commit per logical change.
- Avoid combining unrelated frontend, backend, and database work in the same commit unless they are part of one end-to-end feature.
- Do not commit secrets, `.env` files, build artifacts, or generated files unless they are intentionally tracked.

## Good Commit Examples For This Repo

- `feat(auth): return token and normalized user data`
- `feat(pavilion): add booking fields to API response`
- `feat(db): add pools, courts, and maintenance tables`
- `fix(middleware): use fallback jwt secret for local dev`
- `docs(development): add commit message guidance`

## Poor Commit Examples

- `update stuff`
- `fixed bug`
- `more changes`
- `new feature`
- `wip`

## Suggested Workflow

1. Finish one logical unit of work.
2. Review the diff.
3. Pick the commit type and scope.
4. Write a short summary that explains the change.
5. Commit only the files that belong to that change.
