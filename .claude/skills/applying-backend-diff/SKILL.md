---
name: applying-backend-diff
description: Use when the user shares a backend PR, patch URL, or diff and asks to mirror, port, or add those API endpoint changes into the @connectedxm/client TypeScript SDK (queries/mutations files under src/queries and src/mutations). Triggered by phrases like "update client sdk with this diff", "mirror this endpoint", "add this to client-sdk", "port these endpoints", or sharing a backend PR while in the client-sdk repo or one of its worktrees.
---

# Applying a Backend Diff to client-sdk

## Overview

Backend adds or changes a client API endpoint → client-sdk needs a matching query or mutation file. Unlike admin-sdk, this SDK **is** the source package (`@connectedxm/client`) — there's no downstream OpenAPI generator. The strict file shape still matters because the TanStack Query wrappers (`useConnectedSingleQuery`, `useConnectedInfiniteQuery`, `useConnectedCursorQuery`, `useConnectedMutation`) and downstream consumers expect the canonical triple: query-key helper, async function, hook.

The repo's [CLAUDE.md](../../../CLAUDE.md) is the source of truth for conventions; this skill is the procedural recipe for going from a backend diff to a working, lint-clean SDK change.

## When to use

- User shares a backend PR URL (github.com, patch-diff.githubusercontent.com) and asks to update the client SDK.
- User pastes a diff and asks to mirror endpoints in client-sdk.
- User asks to "add this endpoint" to client-sdk and provides backend code.

**Don't use** for:
- Pure refactors, dependency bumps, or test-only changes.
- Edits to `dist/` (build output — never hand-edit).
- WebSocket-only protocol changes that don't touch HTTP endpoints (those need wiring in `src/websockets/`, not new query/mutation files — see step 6).

## Workflow

### 1. Get the diff

If the user gave a GitHub PR URL or a `patch-diff.githubusercontent.com` URL, fetch via `gh` CLI rather than WebFetch — patch-diff URLs redirect through auth and frequently 401:

```bash
gh pr view <num> --repo <owner>/<repo> --json title,body,files,additions,deletions
gh api repos/<owner>/<repo>/pulls/<num>/files --jq '.[] | {path: .filename, patch: .patch}'
```

The PR description often names the pattern to mirror ("mirrors the existing X(...)") — read it before scanning code.

### 2. Extract, per endpoint

- HTTP method + URL path (e.g. `GET /payments/:paymentId/tax-metadata`)
- Path / query params and their types
- Request body shape (mutations only)
- Response `data` shape — including all branches (soft-skip messages, error messages, success payload)
- Any **new** custom HTTP status codes the backend returns for "this user can't do this" (e.g. a new `468 ERR_XYZ`) — these must be added to `CUSTOM_ERROR_CODES` (see step 5).

### 3. Find the canonical example to mirror

Locate the parent resource directory by grepping for an existing endpoint on the same resource:

```bash
grep -rln "/payments/" src/queries/ src/mutations/
```

Then mirror the closest-matching file:

| Endpoint type | Canonical example | Wrapper helper |
|---|---|---|
| Single GET | `src/queries/<resource>/useGetX.ts` | `useConnectedSingleQuery` |
| Paginated list | `src/queries/<resource>/useGetXs.ts` | `useConnectedInfiniteQuery` |
| Cursor list | `src/queries/streams/useGetStreamChatMessages.ts` | `useConnectedCursorQuery` |
| Mutation | `src/mutations/<resource>/useUpdateX.ts` / `useCreateX.ts` / `useDeleteX.ts` | `useConnectedMutation` |

### 4. Reuse existing types

Before adding a new interface to `src/interfaces.ts`, grep for it:

```bash
grep -n "^export.*<TypeName>\b" src/interfaces.ts
```

Most domain models (`Payment`, `Activity`, `Account`, etc.) are already exported from `@interfaces`. For genuinely dynamic response blobs (raw third-party data, free-form metadata), `Record<string, any>` is fine — don't invent a misleading concrete interface just to "stay consistent."

### 5. Create the file with exact shape

Get this wrong and consumers either fail to import the hook or it silently bypasses the cache-invalidation contract other code relies on.

**Query file exports, in order:**
1. `*_QUERY_KEY` — array key, nested under parent resource's key (e.g. `[...PAYMENT_QUERY_KEY(id), "TAX_METADATA"]`). Note the convention: list-level keys are bare arrays (e.g. `["PAYMENTS"]`); single-resource keys spread their parent.
2. `SET_*_QUERY_DATA` — cache setter using `GetBaseSingleQueryKeys` / `GetBaseInfiniteQueryKeys`
3. Params interface extending `SingleQueryParams` / `InfiniteQueryParams` / `CursorQueryParams`
4. `async` API function returning `Promise<ConnectedXMResponse<T>>`
5. `use*` hook calling the appropriate `useConnected*Query`

**Mutation file exports, in order:**
1. Params interface extending `MutationParams`
2. `async` API function — after a successful response (`data.status === "ok"`), call relevant `SET_*_QUERY_DATA` setters and `queryClient.invalidateQueries(...)` so consumers see fresh data without a refetch round-trip
3. `use*` hook calling `useConnectedMutation`

Path aliases `@src/*` and `@interfaces` are configured — use them.

**If the backend introduced a new "user can't do this" HTTP status code (in the 453–467 family or beyond):** add the constant and append it to `CUSTOM_ERROR_CODES` in `src/utilities/GetErrorMessage.ts`. Codes not in that array get retried 3× and surface through the wrong handler (404/401/generic) instead of `onModuleForbidden`. This step is silently load-bearing — it's easy to miss because lint and types pass without it.

### 6. WebSocket events (only if backend added one)

If the backend diff introduces a new `ReceivedWSMessage` type, wire it in **both** places:

1. The `switch` in `src/hooks/useConnectedWebsocket.tsx`
2. A handler file under `src/websockets/{chat,threads,stream,...}/` that mutates the React Query cache directly

Missing either side means the event is received but ignored, or referenced but undefined.

### 7. Update barrels by hand

**Important difference from admin-sdk:** this repo has no `npm run exports` script. Barrel `index.ts` files are hand-maintained. After creating a new file under `src/queries/<resource>/` or `src/mutations/<resource>/`, append the corresponding `export * from "./useGetX";` line to that directory's `index.ts`. Keep the existing alphabetical ordering.

The top-level `src/queries/index.ts` and `src/mutations/index.ts` re-export the per-resource barrels — only edit those if you added a **new** resource directory.

### 8. Verify

```bash
npm run lint   # runs tsc --noEmit + eslint over src/**/*.ts
npm test       # vitest run (CI mode)
```

Both must pass clean before reporting completion. `tsup` (`npm run build`) is the bundler — `tsc` in `lint` is no-emit and catches type errors.

### 9. Version bump (only if the user is opening the PR now)

CI rejects PRs to `main` that don't bump `version` in `package.json` to a strictly greater plain semver (`x.y.z`, no pre-release tags). Ask the user which bump (patch/minor/major) before editing. If they're staging the work on a feature branch and not ready to PR, don't bump yet.

## Common mistakes

| Mistake | Fix |
|---|---|
| File deviates from canonical shape (wrong export order, missing `SET_*_QUERY_DATA`, return type not `Promise<ConnectedXMResponse<T>>`) | Diff your new file line-by-line against the closest existing file in the same directory |
| Adding a new interface that already exists in `interfaces.ts` | Grep `src/interfaces.ts` first; reuse types verbatim |
| Forgetting to add the new export line to the resource's `index.ts` barrel | `npm run lint` passes (file compiles in isolation) but consumers can't import the new hook from `@connectedxm/client`. Always edit the barrel. |
| New backend status code in 453+ range not appended to `CUSTOM_ERROR_CODES` | Surfaces wrong handler + silent 3× retry. Edit `src/utilities/GetErrorMessage.ts`. |
| New WS event type wired only in the switch OR only in a handler file | Wire **both** sides; the event is silently dropped otherwise. |
| Mutation function doesn't invalidate / set related cache after success | Consumers see stale data until next refetch. Mirror the invalidation pattern from `useUpdateActivity.ts`. |
| Using WebFetch on `github.com/.../pull/N.diff` | Use `gh pr view` and `gh api repos/.../pulls/N/files` instead |
| `cd`-ing out of the current worktree | Stay in the worktree directory; use absolute paths |
| Bumping `package.json` version on a work-in-progress branch | Only bump right before opening the PR to `main`; otherwise it churns merge conflicts |

## Red flags — stop and reconsider

- About to write a new interface without grepping `src/interfaces.ts` first
- About to skip editing the per-resource `index.ts` because "it's just an export line"
- New 4xx status code in the backend diff but not touching `CUSTOM_ERROR_CODES`
- File shape doesn't match the canonical example (different export order, missing `SET_*_QUERY_DATA`, return type not `Promise<ConnectedXMResponse<T>>`)
- Skipping `npm run lint` or `npm test` because "the change is small"
- Hand-editing anything under `dist/`
