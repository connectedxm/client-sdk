---
name: ship-to-prod
description: Open a release PR from `staging` to `main` in this repo. Handles the full flow — gathers commits, pulls Linear ticket references from commit messages and the PRs that merged into staging, drafts a title and body that match the repo's PR template, picks reviewers, and (after the user confirms) creates the PR with `gh pr create`. Use this whenever the user says anything along the lines of "open a staging PR", "release staging", "ship staging to prod", "cut a release", "PR staging", "promote staging", "merge staging into main", or any variant of opening/preparing a PR between the staging and main branches. Prefer this skill over running `gh pr create` directly — the manual flow misses Linear references, the version-bump check, and reviewer conventions.
---

# Staging → Main release PR

Use this when the user wants to open a release PR from `staging` into `main` in the `connectedxm/client-sdk` repo (npm package `@connectedxm/client`). Production is `main` here — pushing to `main` triggers `publish.yml`, which publishes `@connectedxm/client` to npm. The backend repo uses `prod`, but this SDK ships from `main`.

## What you're producing

A draft PR (or, on confirmation, an actual PR via `gh pr create`) with:

1. **Base/head**: base `main`, head `staging` — never invent a feature branch
2. **Title** that reflects what's in the diff (see "Writing the title")
3. **Body** matching `.github/pull_request_template.md`, with Linear refs harvested from commits AND from any sub-PRs they reference, plus the Semantic Versioning section ticked
4. **Reviewers** drawn from the repo's collaborators (excluding the PR author)

The user has asked to **always confirm before creating** the PR. Show the draft, wait for the go-ahead, then call `gh pr create`.

## Workflow

### 1. Sync and check there's something to ship

```bash
git fetch origin main staging
git log --oneline origin/main..origin/staging
```

If the log is empty, tell the user `staging` has nothing ahead of `main` — there's no PR to open. Stop.

If `staging` is behind `origin/staging` locally, that's fine — the PR is opened against the remote refs, not your working copy. But mention it so the user knows.

### 2. Check the version bump (hard gate)

`version-check.yml` rejects any PR to `main` whose `package.json` version isn't strictly greater than main's, in plain `x.y.z` semver (no pre-release tags, no build metadata).

```bash
git show origin/main:package.json | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).version"
git show origin/staging:package.json | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).version"
```

Compare the two. If staging's version is **not** strictly greater than main's, stop and tell the user — they need to land a version bump on staging first (recent precedent: `chore: Bump package version to X.Y.Z` PRs into staging) before this release PR can pass CI. Don't open the PR; don't bump for them.

**Watch for pre-release tags.** Staging sometimes carries something like `8.1.7-beta.2` mid-cycle. That string is rejected by `version-check.yml` outright (it's not plain `x.y.z`), so even if it's numerically greater than main, the workflow will fail. Flag this to the user — they need a plain `x.y.z` bump on staging first.

If the bump looks right, note which kind it is (major/minor/patch) — you'll tick the matching box in the body's Semantic Versioning section.

### 3. Gather the commits

```bash
git log origin/main..origin/staging --pretty=format:'%H%x09%s%x09%b%x1e'
```

The `%x1e` (ASCII record separator) lets you split multi-line commit bodies cleanly. You want the subject AND the body — Linear references like `closes ENG-1901` usually live in the body, not the subject.

Skip merge commits whose subject starts with `Merge branch 'staging'` — they're noise from local merges, not a unit of work.

### 4. Resolve sub-PRs referenced in commit subjects

Squash-merged PRs leave a trail like `feat(activations): expose imageUpload flag and completion image fields (#561)`. The `(#NNNN)` is a real PR with its own body that often holds the Linear reference. Pull each one:

```bash
gh api repos/connectedxm/client-sdk/pulls/<NNNN> --jq '{title, body}'
```

Do this for every `(#NNNN)` you find in the commit subjects in step 3. These bodies feed into the Linear extraction below — and sometimes into the PR description summary, when the squashed commit message is terse.

### 5. Extract Linear ticket references

Linear refs in this repo look like `[A-Z]{2,5}-\d+` — both `ENG` and `CXM` show up regularly (the repo's PR template even defaults to `closes CXM-[Linear Ticket Number]`). They appear as:

- `closes ENG-1234`
- `ref CXM-1901`
- bare `ENG-1804` inside a Linear Issues bullet

**Important: don't confuse `(#561)` (a GitHub PR number) with `ENG-1234` (a Linear ticket).** Only the latter goes in the Linear Issues section.

**`linear-check.yml` is a hard gate.** It runs on every PR to `main` and requires at least one literal `ENG-\d+` somewhere in the PR body. The template's default `closes CXM-…` placeholder does **not** satisfy it. If you can only find `CXM-…` refs in the commits/sub-PRs, the workflow will fail — flag this to the user before opening so they can decide whether to add an `ENG-…` ref or update the workflow.

Collect refs from:

- the body of every commit in step 3
- the title and body of every sub-PR resolved in step 4

**Only include refs you actually saw in those sources for this PR.** Don't carry refs over from prior staging→main PRs, recent conversation context, or memory of past releases — even if a ticket "feels relevant," it doesn't go in the list unless it's literally present in the commits/PRs you just gathered. Re-listing a ticket that was already shipped in a previous release is a real failure mode and confuses Linear's auto-close on merge.

Dedupe. Preserve the verb the user wrote when possible — if a sub-PR said `closes ENG-1901`, your output should say `closes ENG-1901`, not `ref`. Only fall back to `ref` if the original said `ref` or no verb at all.

### 6. Pick reviewers

There's no CODEOWNERS file in this repo. Build the candidate list at runtime:

```bash
gh api repos/connectedxm/client-sdk/collaborators \
  --jq '[.[] | select(.permissions.push == true) | .login]'
gh api user --jq '.login'   # you, the PR author — exclude from candidates
```

Use the unfiltered `collaborators` endpoint — do **not** add `?affiliation=direct`, because that excludes org admins (e.g., `swiftoO` is an admin and won't appear with the direct filter). The unfiltered endpoint plus a `permissions.push == true` jq filter gives you the right candidate set.

Take everyone with push permission, drop the author. Default to requesting all of them. If the user said something specific about reviewers in their prompt ("just Tyler", "skip Spencer"), honor that and don't ask.

If only one candidate remains, just use them — don't bother the user about it.

### 7. Write the title

Look at what's actually in the diff before reaching for a template. The right title depends on the shape of the changes.

**One dominant change:** copy the conventional-commit subject from the main commit/PR. Example: `feat(EventConfig): add BUILD_MODE flag`.

**Several unrelated changes:** use a short generic title like `Staging Fixes` or a noun phrase that captures the theme. Look at recent staging→main PRs (`gh pr list --base main --head staging --state merged --limit 10`) to match the house style — they oscillate between conventional-commit subjects (`feat(EventConfig): add BUILD_MODE flag`) and short noun phrases (`Image upload on activation`), both are fine.

**Version-bump-only releases.** When the only thing in the diff is `chore: Bump package version to X.Y.Z`, a short title like `Release X.Y.Z` is fine.

Keep it under ~70 characters.

### 8. Write the body

Use this exact template — it matches `.github/pull_request_template.md`:

```markdown
### Description

<2-4 sentence summary of what's shipping. Group by theme if there are several unrelated changes — bullet list is fine when that's clearer than prose. Lead with SDK-visible changes (new hooks, new fields on response/params types, new error codes, new interface members, new provider callbacks), since this PR triggers an npm publish of `@connectedxm/client` and the change will land in `client-web`, `client-mobile`, and any other consumer on next install.>

### Linear Issues

- closes ENG-1234
- ref CXM-1901
  <one line per ticket; use the verb the source used. Must include at least one ENG-#### or linear-check.yml will fail.>

### Testing

<Generated testing plan — see "Writing the testing plan" below. Do NOT use the template's default `I have manually tested the changes / New integration tests have been added` checkboxes; replace them with concrete steps grounded in the actual diff.>

### Semantic Versioning

Indicate the appropriate version bump for this PR:

- [ ] Breaking changes - Major version bump
- [ ] New features / improvements - Minor version bump
- [ ] Bug fixes - Patch version bump
```

**Tick the Semantic Versioning box** that matches the actual version delta you noted in step 2 (`X.Y.0` → minor, `X.Y.Z` patch bump only → patch, major version bump → major). If multiple things shipped, tick the highest-impact box (one breaking change makes the whole release major).

**Writing the testing plan.** Replace the template's default Testing checkboxes with a per-PR plan derived from what actually changed. The reviewer should be able to read the plan and know exactly what to verify before merging triggers the npm publish. Aim for 3–7 concrete checkbox items.

Walk the file diff (`git diff --name-only origin/main..origin/staging`) and turn it into specific verification steps. This is a TypeScript React-hooks SDK consumed by other apps (notably `client-web` and `client-mobile`), so most verification happens via type-check + a smoke pass from a consumer mounting `ConnectedProvider`.

- **Query files** (`src/queries/<resource>/use*.ts`) → "Confirm `useGet*` returns the new field/shape; spot-check the `*_QUERY_KEY` helper and that 401/403/404 plus custom codes 453–467 route through `onNotAuthorized` / `onNotFound` / `onModuleForbidden` as expected (the custom codes must be in `CUSTOM_ERROR_CODES` in `utilities/GetErrorMessage.ts` or they'll silently retry 3×)."
- **Mutation files** (`src/mutations/<resource>/use*.ts`) → "Run the mutation from a consumer app and confirm the listed query keys invalidate / `SET_*_QUERY_DATA` updates as expected; on failure confirm `onMutationError` fires."
- **Interface changes** (`src/interfaces.ts`) → "Run `npm run lint` (which runs `tsc` + ESLint) and `npm run build`; `npm pack` the SDK and install into `client-web` (and `client-mobile` if relevant) — confirm the new fields surface in IDE completions and `tsc` is clean on the consumer side."
- **Param/input shape changes** → "Confirm callers in `client-web` / `client-mobile` still type-check against the new params; if a field became required, the consumer-side update needs to land before publish."
- **`ConnectedProvider` / context changes** (`src/ConnectedProvider.tsx`, `src/hooks/useConnected.ts`) → "Mount a consumer with the updated provider and confirm `clientApiParams`, `organizationId`, `getToken`, `getExecuteAs`, `locale`, and the `onNotAuthorized` / `onModuleForbidden` / `onNotFound` / `onMutationError` callbacks still wire through. Remember `react-use-websocket` is passed in as a prop (optional peer dep) — don't add a hard import."
- **`ClientAPI` / axios changes** (`src/ClientAPI.ts`) → "Confirm `GetClientAPI(params)` returns an axios instance with the expected `baseURL`, `organization`, `authorization`, `api-key`, and `executeAs` headers (when set)."
- **Query wrapper changes** (`src/queries/useConnectedSingleQuery.ts`, `useConnectedInfiniteQuery.ts`, `useConnectedCursorQuery.ts`, `src/mutations/useConnectedMutation.ts`) → "Confirm the wrapper still injects `clientApiParams` from context, prepends the locale (and `search` for infinite/cursor) to the query key, and routes 401/403/404 plus 453–467 to the right context callbacks without retrying."
- **WebSocket pipeline changes** (`src/websockets/useConnectedWebsocket.tsx`, `src/websockets/{chat,threads,stream}/`) → "From a consumer, open a socket and confirm incoming `chat.message.*` / `thread.message.*` / `stream.chat.*` / `stream.connected` / `stream.disconnected` / `pulse` events route to the right handler and mutate the React Query cache as expected. New event types must be wired up in **both** the `useConnectedWebsocket` switch and a new handler file — verify both."
- **Custom error code changes** (`src/utilities/GetErrorMessage.ts`) → "Confirm any new status added in the 453–467 range is included in `CUSTOM_ERROR_CODES` so the query wrappers treat it like 403 (calls `onModuleForbidden`, does not retry). A missing entry causes a silent 3× retry and surfaces the wrong handler."
- **Index/barrel changes** (`src/index.ts`, per-folder `index.ts`) → "Run `npm run build` and inspect `dist/index.d.ts` to confirm new symbols are exported. The single import surface is `src/index.ts` (re-exports `hooks`, `interfaces`, `utilities`, `queries`, `mutations`, `ClientAPI`, `ConnectedProvider`) — keep that shape."
- **CI workflow changes** (`.github/workflows/`) → "Confirm `tests.yml`, `linear-check.yml`, `version-check.yml`, `publish.yml`, or `approve.yml` pass on this branch."
- **Publish gate** → "After merge, confirm `publish.yml` runs cleanly on `main` and `@connectedxm/client@X.Y.Z` is live on npm."

Group related items where it tightens the plan. If a single domain dominates the diff (e.g., the whole PR is interface additions for activations), it's fine to have all 3–7 items in that domain. If you genuinely cannot derive a plan from the diff (rare — usually means something's wrong with how you read the commits), fall back to the original checkbox pair, but flag this to the user when presenting the draft.

Format as a markdown checklist:

```markdown
### Testing

- [ ] Run `npm run lint` and `npm run build` and confirm both pass cleanly.
- [ ] `npm pack` the SDK and install into a `client-web` checkout — confirm `tsc` passes on the consumer with the new types and the new fields surface in IDE completions.
- [ ] On a staging consumer, mount `ConnectedProvider` and exercise the affected mutation/query — confirm the new fields land in the cache and the relevant `*_QUERY_KEY` invalidates correctly.
- [ ] Open a WebSocket from a consumer (if the diff touches `src/websockets/`) and confirm the new/changed event type routes to the right handler.
- [ ] After merge, confirm `publish.yml` succeeds and `@connectedxm/client@X.Y.Z` appears on npm.
```

If there are zero Linear references, omit the bullet list and write `- (none)` under the Linear Issues heading rather than deleting the section — keeps the template recognizable. (But: `linear-check.yml` requires at least one `ENG-####` in the body, so this case will fail CI. Flag it to the user before opening.)

### 9. Show the draft and wait

Print the title, body, reviewer list, AND the version delta from step 2 back to the user, clearly labelled. Ask whether to create the PR as drafted, modify, or cancel. Don't run `gh pr create` until they've said yes.

The reason for confirming: the title and body are interpretive — you're summarizing several commits' worth of work. The user knows things you don't (which change is the headline feature, which is incidental cleanup, whether the Semantic Versioning box is right, whether something is already covered by another ticket). Five seconds of their attention up front beats editing the PR after the fact — especially since merging this PR triggers an npm publish.

### 10. Create the PR

After confirmation, use a HEREDOC for the body so newlines and markdown survive:

```bash
gh pr create \
  --base main \
  --head staging \
  --title "<title>" \
  --reviewer "<comma,separated,logins>" \
  --body "$(cat <<'EOF'
<body here>
EOF
)"
```

Return the PR URL from the command output so the user can click straight to it.

## Things to watch out for

- **`main`, not `prod`.** This repo's production branch is `main` (the backend repo uses `prod`). Don't paste backend instincts here — `gh pr create --base prod` will fail.
- **Merging this PR publishes `@connectedxm/client` to npm.** `publish.yml` runs on push to `main` and publishes the package directly. There is no manual gate. Take the testing plan seriously — the change lands in `client-web`, `client-mobile`, and any other consumer on next install.
- **The version bump is a hard gate.** If staging's `package.json` version isn't strictly greater than main's in plain `x.y.z` semver, `version-check.yml` will fail. Pre-release tags like `8.1.7-beta.2` are explicitly rejected. Don't open the PR until the bump is on staging in plain semver.
- **`linear-check.yml` requires `ENG-####` in the body.** A `CXM-####`-only body will fail CI — and the repo's PR template defaults to `closes CXM-[Linear Ticket Number]`, which is a known footgun. If you only found `CXM` refs in the source commits/PRs, surface that to the user before opening.
- **Don't paste `<!-- CURSOR_SUMMARY -->` blocks** from sub-PR bodies into the new PR body. Those are auto-generated by the Cursor Bugbot reviewer and re-including them looks weird.
- **Don't include the HTML comment placeholders** from the PR template (`<!-- A brief description -->`) in your output — replace them with real content.
- **Keep the Semantic Versioning section.** Don't drop it from the body — the template explicitly includes it. Tick the box that matches the actual version bump.
- **`closes` vs `ref`**: `closes` auto-closes the Linear ticket on merge to `main`. `ref` just links it. Preserve whichever the source commit/PR used. When in doubt, `ref` is the safer default — it doesn't change ticket state.
- **Bot reviews are not human reviews.** Don't infer reviewer preferences from `github-actions` or `cursor` reviews on past PRs — those are automated. Look at human reviewers (`authorAssociation: MEMBER`) only.
- **The author isn't a reviewer.** GitHub will reject `--reviewer <self>`. Always exclude `gh api user --jq '.login'` from the list.
- **No second SDK to publish.** Unlike `admin-sdk`, this repo publishes exactly one package (`@connectedxm/client`). There is no generated `openapi.json` and no `sdks/typescript/` output — don't mention them in the body or testing plan.

## Why this exists

Opening these PRs by hand consistently misses Linear references buried in sub-PR bodies, drops the Semantic Versioning section, and either skips the version-bump check or has to back-patch it after CI fails. Because merging this PR auto-publishes the SDK to npm, the cost of a botched release is higher than for an app deploy — there's no easy "revert" once a version is live. Hitting the gh API once per sub-PR, comparing versions up front, and templating the body is mechanical work that's easy to get wrong when done manually but easy to get right in a script-shaped flow.
