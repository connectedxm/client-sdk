# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm test` — run vitest once (CI-mode)
- `npm run dev` — vitest watch mode
- `npm run lint` — `tsc` (no emit) + ESLint over `src/**/*.ts`
- `npm run build` — `tsup` produces ESM output + `.d.ts` in `dist/`
- `npm run release` — lint, test, build (run before publishing)
- `npm run local` — release + `npm pack` (produces `.tgz` for local install)
- Run a single test: `npx vitest run tests/index.test.ts -t "<name pattern>"`

CI (`.github/workflows/tests.yml`) runs lint, `tsc`, and build on every push to `staging`. Publish to npm happens automatically on push to `main` (`publish.yml`).

## Versioning rules (enforced in CI)

Every PR targeting `main` must bump `version` in `package.json` to a **strictly greater** plain semver `x.y.z` — pre-release tags and build metadata are rejected by `version-check.yml`. The PR template asks which bump (major/minor/patch) and a Linear ticket (`closes CXM-####`); both are checked by workflows.

## Architecture

This SDK exposes React hooks that wrap **TanStack Query** (`@tanstack/react-query`) for the ConnectedXM REST API plus a **WebSocket** stream for real-time updates. Consumers wrap their tree in `ConnectedProvider`; everything else reads context from it.

Three layers, one shape:

1. **Async function** (`Get*` / mutation verb) — takes typed params including `clientApiParams`, calls `GetClientAPI(clientApiParams)` to build an axios instance, returns `ConnectedXMResponse<T>`.
2. **Hook** (`useGet*` / `useUpdate*`) — wraps the async fn with `useConnectedSingleQuery`, `useConnectedInfiniteQuery`, `useConnectedCursorQuery`, or `useConnectedMutation`. These wrappers inject `clientApiParams` from `useConnected()` context, attach the standard error-handling/retry policy, and prepend the locale (and `search` for infinite/cursor) to the query key.
3. **Query key helper** (`*_QUERY_KEY(...)`) and optional **`SET_*_QUERY_DATA`** seed function — exported alongside the hook so other code can invalidate or hydrate the cache.

When adding a new endpoint, follow this triple in `src/queries/<resource>/` or `src/mutations/<resource>/` and re-export from the local `index.ts`. The single import surface is `src/index.ts` (re-exports `hooks`, `interfaces`, `utilities`, `queries`, `mutations`, `ClientAPI`, `ConnectedProvider`).

### Response envelope

All API responses are `ConnectedXMResponse<TData>` (`{ status, message, data, count?, url?, cursor? }`). Cursor pagination uses the `cursor` field; offset/page pagination uses page-size-based "got a full page → there's another" logic in `useConnectedInfiniteQuery`.

### Custom error codes

`utilities/GetErrorMessage.ts` defines status codes **453–467** (e.g. `ERR_NOT_GROUP_MEMBER`, `ERR_REGISTRATION_UNAVAILABLE`). The query wrappers treat these like 403 — they invoke `onModuleForbidden` from context and **do not retry**. 401 calls `onNotAuthorized`, 404 calls `onNotFound`. Any new "this user can't do this" status must be added to `CUSTOM_ERROR_CODES` or it will silently retry 3× and surface the wrong handler.

### WebSocket pipeline

`ConnectedProvider` requires the consumer to pass `useWebSocket` from `react-use-websocket` as a prop (it's a peer dep so we don't take a hard dependency). `useConnectedWebsocket` builds the socket URL from `getToken` + `getExecuteAs` + `organizationId`, then routes incoming `ReceivedWSMessage` payloads by `type` (`chat.message.*`, `thread.message.*`, `stream.chat.*`, `stream.connected/disconnected`, `pulse`) into per-type handlers under `src/websockets/{chat,threads,stream}/` that mutate the React Query cache directly. New event types must be wired up in **both** `useConnectedWebsocket.tsx`'s switch and a new handler file.

### Path aliases

`tsconfig.json` defines `@src/*` → `./src/*` and `@interfaces` → `./src/interfaces`. Both are resolved by `tsup` at build time and by Vitest. Use them for cross-directory imports so the bundler doesn't generate brittle relative paths.

## Peer dependencies

`react`, `@tanstack/react-query`, `@types/react`, and `react-use-websocket` are **optional peers** — the SDK imports types and `react-use-websocket` is passed in at the provider level. Keep it that way; do not add a hard runtime dependency on React or the query client.
