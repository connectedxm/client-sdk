---
name: applying-backend-diff
description: Use when the user shares a backend PR, patch URL, or diff and asks to mirror, port, or add those API endpoint changes into the @connectedxm/client TypeScript SDK (queries/mutations files under src/queries and src/mutations). Triggered by phrases like "update client sdk with this diff", "mirror this endpoint", "add this to client-sdk", "port these endpoints", or sharing a backend PR while in the client-sdk repo or one of its worktrees.
---

# Applying a Backend Diff to client-sdk

## Overview

Backend adds or changes a client API endpoint → client-sdk needs a matching query or mutation file. There is **no OpenAPI generator** in this repo (unlike `admin-sdk`) — the source files you write here *are* the published artifact (`@connectedxm/client`). That means deviations don't get silently dropped from a regen step; instead they break consumers (`client-web`, `client-mobile`) at runtime or at type-check. The file shape is still strict — for consistency with the existing 150+ query/mutation files and so the `useConnected*Query` / `useConnectedMutation` wrappers can do their job (locale-prefixed query keys, error routing for 401/403/404 + custom codes 453–467, retry policy).

The repo's [CLAUDE.md](CLAUDE.md) is the source of truth for conventions; this skill is the procedural recipe for going from a backend diff to a working, lint-clean SDK change.

## When to use

- User shares a backend PR URL (github.com, patch-diff.githubusercontent.com) and asks to update the SDK.
- User pastes a diff and asks to mirror endpoints in client-sdk.
- User asks to "add this endpoint" to client-sdk and provides backend code.

**Don't use** for:
- Endpoints that belong to the admin API surface — those go in `admin-sdk`, not here. If the backend route lives under an admin-only controller, stop and tell the user.
- Changes that don't involve adding/modifying API endpoints (e.g., dependency bumps, internal refactors).

## Workflow

### 1. Get the diff

If the user gave a GitHub PR URL or a `patch-diff.githubusercontent.com` URL, fetch via `gh` CLI rather than WebFetch — patch-diff URLs redirect through auth and frequently 401:

```bash
gh pr view <num> --repo <owner>/<repo> --json title,body,files,additions,deletions
gh api repos/<owner>/<repo>/pulls/<num>/files --jq '.[] | {path: .filename, patch: .patch}'
```

The PR description often names the pattern to mirror ("mirrors the existing X(...)") — read it before scanning code.

### 2. Extract, per endpoint

- HTTP method + URL path (e.g. `GET /accounts/:accountId/followers`)
- Path / query params and their types
- Request body shape (mutations only)
- Response `data` shape — including all branches (soft-skip messages, error messages, success payload)
- Any **new error status codes** in the 453–467 range — these must be added to `CUSTOM_ERROR_CODES` in `src/utilities/GetErrorMessage.ts` or the query wrappers will silently retry 3× instead of routing to `onModuleForbidden`

### 3. Find the canonical example to mirror

Locate the parent resource directory by grepping for an existing endpoint on the same resource:

```bash
grep -rln "/accounts/" src/queries/ src/mutations/
```

Then mirror the closest-matching file:

| Endpoint type | Canonical example | Wrapper helper |
|---|---|---|
| Single GET | `src/queries/<resource>/useGetX.ts` (e.g. `accounts/useGetAccount.ts`) | `useConnectedSingleQuery` |
| Paginated list | `src/queries/<resource>/useGetXs.ts` (e.g. `accounts/useGetAccounts.ts`) | `useConnectedInfiniteQuery` |
| Cursor list | `src/queries/streams/useGetStreamChatMessages.ts` | `useConnectedCursorQuery` |
| Mutation | `src/mutations/<resource>/useUpdateX.ts` / `useCreateX.ts` / `useDeleteX.ts` / `useFollowAccount.ts` | `useConnectedMutation` |

### 4. Reuse existing types

Before adding to `src/interfaces.ts`, grep it:

```bash
grep -n "^export.*<TypeName>\b" src/interfaces.ts
```

There is no `src/params.ts` in this repo (unlike `admin-sdk`) — params interfaces live inline in each query/mutation file, extending `SingleQueryParams` / `InfiniteQueryParams` / `CursorQueryParams` / `MutationParams` imported from the wrapper file (`"../useConnectedSingleQuery"`, etc.).

For **genuinely dynamic** response blobs (e.g., raw third-party transaction data, free-form metadata), `Record<string, any>` is fine — don't invent a misleading concrete interface just to "stay consistent."

### 5. Create the file with exact shape

The wrappers (`useConnectedSingleQuery` / `useConnectedInfiniteQuery` / `useConnectedCursorQuery` / `useConnectedMutation`) expect a specific export shape so they can inject `clientApiParams` from `useConnected()` context, prepend the locale (and `search` for infinite/cursor) to the query key, and route errors correctly. Match the canonical example line-by-line — wrong types or missing setters break consumer cache hydration silently.

**Query file exports, in order:**
1. `*_QUERY_KEY` — array key, nested under parent resource's key when applicable (e.g. `[...ACCOUNTS_QUERY_KEY(), accountId]`)
2. `SET_*_QUERY_DATA` — cache setter that appends `GetBaseSingleQueryKeys(...baseKeys)` (or `GetBaseInfiniteQueryKeys(...)`), defaulting baseKeys to `["en"]`
3. Params interface extending `SingleQueryParams` / `InfiniteQueryParams` / `CursorQueryParams` (imported from `"../useConnectedSingleQuery"` etc.)
4. `async` API function (`Get*`) destructuring `clientApiParams`, calling `GetClientAPI(clientApiParams)`, returning `Promise<ConnectedXMResponse<T>>`
5. `use*` hook calling the appropriate `useConnected*Query`

**Mutation file exports, in order:**
1. Params interface extending `MutationParams`
2. `async` API function destructuring `clientApiParams` AND `queryClient`. After the request succeeds, update the cache directly with `queryClient.setQueryData([...RELATED_QUERY_KEY(...), clientApiParams.locale], ...)` — **the locale MUST be appended** because that's how the wrappers actually key the cache. Use `produce` from `immer` for shape-preserving updates. Call `queryClient.invalidateQueries({ queryKey: ... })` for keys you don't update directly.
3. `use*` hook calling `useConnectedMutation<ParamsType, ResponseType>`

**Imports follow the project conventions:**
- Types: `from "@interfaces"` (or `from "@src/interfaces"`)
- API factory: `from "@src/ClientAPI"`
- Query/mutation wrappers and their param types: `from "../useConnectedSingleQuery"` (relative — the wrapper lives one directory up)
- Cross-resource query keys: `from "@src/queries"` or a specific file like `from "@src/queries/self/useGetSelfRelationships"`
- Immer: `import { produce } from "immer"`

Path aliases `@src/*` and `@interfaces` are configured in both `tsconfig.json` and resolved by `tsup` and Vitest — use them for cross-directory imports.

### 6. Add the file to the local barrel — by hand

Unlike `admin-sdk`, **there is no `npm run exports` script** in this repo and no `.cursor/rules/index-exports.mdc`. The per-folder `index.ts` files are hand-maintained. Add the new file with an `export *` line:

```ts
// src/queries/<resource>/index.ts
export * from "./useGetX";
```

Follow the existing ordering in the file (it's roughly insertion-order, not alphabetical — match what's already there). The top-level `src/queries/index.ts` and `src/mutations/index.ts` re-export the per-resource folders with `export * from "./<resource>"`; if you added a *new* resource folder, add that line too.

### 7. Verify

```bash
npm run lint    # runs `npx tsc` (noEmit) + `eslint src/**/*.ts` — both must pass
npm test        # vitest run — runs the existing suite
npm run build   # tsup ESM + .d.ts emit — confirms exports survive the bundler
```

`npm run lint` alone catches type errors (it invokes `tsc`); running `npx tsc` separately is redundant.

### 8. No generator step

This repo has no `npm run generate`, no `openapi.json`, and no `sdks/typescript/` output. The `.ts` files in `src/` are the publish artifact — `npm run build` (tsup) bundles them into `dist/` and `publish.yml` ships that on push to `main`. Don't look for a generator-shaped step that doesn't exist.

## Common mistakes

| Mistake | Fix |
|---|---|
| File deviates from canonical shape → wrappers can't infer types, or `SET_*_QUERY_DATA` doesn't match the cache key consumers expect | Diff your new file line-by-line against the closest existing file in the same directory |
| Forgetting to add the new file to the local `index.ts` → consumers can't import the hook | Add the `export * from "./useGetX"` line by hand; there's no script |
| Manual `queryClient.setQueryData` in a mutation without appending `clientApiParams.locale` → cache write goes to the wrong key, UI doesn't refresh | The wrappers key everything with the locale appended; mutations must too |
| Adding a new 453–467 status code without updating `CUSTOM_ERROR_CODES` in `src/utilities/GetErrorMessage.ts` → query wrapper silently retries 3× and surfaces the wrong handler | Add the code to `CUSTOM_ERROR_CODES` in the same PR |
| Putting params in `src/params.ts` because that's how `admin-sdk` does it | This repo has no `params.ts`; inline the params interface in the query/mutation file |
| Adding a new type that already exists in `interfaces.ts` | Grep first; reuse types verbatim |
| Inventing a misleading concrete interface for a dynamic provider blob | Use `Record<string, any>` — keep it honest |
| Looking for `scripts/generate.ts` / `npm run generate` / `openapi.json` | They don't exist in this repo |
| Using WebFetch on `github.com/.../pull/N.diff` | Use `gh pr view` and `gh api repos/.../pulls/N/files` instead |
| `cd`-ing out of the current worktree | Stay in the worktree directory; use absolute paths |

## Red flags — stop and reconsider

- About to write a new interface without grepping `src/interfaces.ts` first
- Manual `setQueryData` in a mutation that does **not** append `clientApiParams.locale` to the key
- File shape doesn't match the canonical example (different export order, missing `SET_*_QUERY_DATA`, return type not `Promise<ConnectedXMResponse<T>>`, params not extending the wrapper's params type)
- Added a new status code in the 453–467 range without touching `src/utilities/GetErrorMessage.ts`
- Forgot to add the new file to the local `src/queries/<resource>/index.ts` or `src/mutations/<resource>/index.ts`
- Skipping `npm run lint` because "the change is small" — it runs `tsc` and catches mistakes that don't surface until a consumer installs the package
- Searching for an OpenAPI generator or `openapi.json` — they don't exist here
