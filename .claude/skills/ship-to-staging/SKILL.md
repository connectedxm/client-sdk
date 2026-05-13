---
name: ship-to-staging
description: Open a feature PR from the current branch into `staging` in this repo. Handles the full flow — detects the current branch, gathers commits, extracts the Linear ticket reference from the branch name and commit messages, drafts a title and body that match the repo's PR template, picks reviewers, pushes the branch if needed, and (after the user confirms) creates the PR with `gh pr create`. Use this whenever the user says anything along the lines of "open a PR to staging", "ship this branch", "PR this feature", "submit this", "merge this into staging", "open a feature PR", "create the staging PR for this", or any variant of opening a PR from a feature branch into staging. Prefer this skill over running `gh pr create` directly — the manual flow misses Linear references and reviewer conventions.
---

# Feature → Staging PR

Use this when the user wants to open a PR from a feature branch into `staging` in the `connectedxm/client-sdk` repo (npm package `@connectedxm/client`). Typical case: one Linear ticket per branch, branch named like `ENG-1804` or `feat/eng-1234-cool-thing`.

For the staging→main release flow, use `ship-to-prod` instead. (Production is `main` in this repo, not `prod`.)

## What you're producing

A PR (after confirmation) with:

1. **Base/head**: base `staging`, head is the current feature branch — never `staging` or `main`
2. **Title** that reflects the work in the diff (usually the dominant commit's conventional-commit subject)
3. **Body** matching `.github/pull_request_template.md`, with the Linear ref harvested from the branch name and commit messages
4. **Reviewers** drawn from the repo's collaborators (excluding the PR author)

The user has asked to **always confirm before creating** the PR. Show the draft, wait for the go-ahead, then push (if needed) and call `gh pr create`.

## Workflow

### 1. Identify the branch and check there's something to ship

```bash
git rev-parse --abbrev-ref HEAD
git fetch origin staging
```

If the current branch is `staging` or `main`, stop and tell the user — they probably wanted `ship-to-prod`, or they need to check out the feature branch first.

```bash
git log --oneline origin/staging..HEAD
```

If the log is empty, tell the user the current branch has nothing ahead of `staging` — there's no PR to open. Stop.

If the branch already has an open PR against staging, mention it (`gh pr list --head <branch> --base staging --state open`) and ask whether to add commits to that one or close it first. Don't open a duplicate.

### 2. Check push state

```bash
git rev-parse --verify --quiet "origin/<branch>" && \
  git log --oneline "origin/<branch>..HEAD" || echo "branch not on origin"
```

Three possible states — note which applies:

- **Branch not on origin** — needs `git push -u origin <branch>` before `gh pr create` will work.
- **Local commits ahead of `origin/<branch>`** — needs `git push` so the PR includes them.
- **Up to date** — nothing to push.

Don't push yet. Bundle the push with the PR-create step after the user confirms the draft (step 8).

### 3. Gather the commits

```bash
git log origin/staging..HEAD --pretty=format:'%H%x09%s%x09%b%x1e'
```

The `%x1e` (ASCII record separator) lets you split multi-line commit bodies cleanly. You want the subject AND the body — Linear refs like `closes ENG-1901` typically live in the body.

Skip merge commits (`Merge branch 'staging'`, `Merge pull request #...`) — they're noise on a feature branch.

Feature branches generally don't have squashed sub-PRs (they ARE the sub-PR), so you can skip the sub-PR resolution step that `ship-to-prod` uses.

### 4. Extract the Linear ticket reference

Linear refs in this repo look like `[A-Z]{2,5}-\d+` — the dominant prefix is `ENG`. The PR template still shows `closes CXM-…` as a placeholder, but recent merged PRs and the `linear-check.yml` workflow both expect `ENG-\d+`. `CXM` and other prefixes appear occasionally; preserve whatever the source actually used. Note that branches in this repo are often named just by ticket ID (e.g. `ENG-1804`). Look in this order:

1. **Branch name** — `ENG-1804`, `fix/eng-1886-deletion`, or `feat/cxm-1234-cool-thing` → extract `ENG-1804` / `ENG-1886` / `CXM-1234`. Pattern: `([a-zA-Z]{2,5}-\d+)` (case-insensitive — uppercase it).
2. **Commit subjects and bodies** — `closes ENG-1886`, `ref CXM-1234`, or bare ticket IDs.

For the verb:

- If a commit explicitly used `closes ENG-XXXX` or `ref ENG-XXXX`, preserve that verb.
- If the ref came only from the branch name, default to `closes` — a feature PR is the canonical place to close its ticket.
- When in real doubt, `ref` is safer (doesn't change ticket state on merge).

Dedupe. The common case is a single ticket; if you find more than one, list each on its own line.

If you find zero refs, ask the user before proceeding — feature branches almost always have a ticket, and a missing ref usually means the branch was named differently than usual or the ticket was forgotten. Don't fabricate one.

Note: `linear-check.yml` only runs on PRs targeting `main`, so a missing Linear ref won't block a staging PR from opening. Still ask — the ref needs to land somewhere on the branch before the staging→main release PR is opened.

### 5. Pick reviewers

Same logic as `ship-to-prod` — there's no CODEOWNERS file:

```bash
gh api repos/connectedxm/client-sdk/collaborators \
  --jq '[.[] | select(.permissions.push == true) | .login]'
gh api user --jq '.login'   # exclude self
```

Use the unfiltered `collaborators` endpoint (NOT `?affiliation=direct`, which excludes org admins like `swiftoO`). Filter by `permissions.push == true`, drop the author.

Default to requesting all of them. If the user said something specific in their prompt ("just Tyler", "skip Spencer"), honor that. If only one candidate remains, just use them.

### 6. Write the title

For a feature branch, the title is usually obvious — copy the dominant commit's conventional-commit subject. Examples that work well:

- `feat(activations): expose imageUpload flag and completion image fields`
- `fix(websockets): route stream.chat.* events through the right handler`
- `feat(EventConfig): add BUILD_MODE flag`

If the branch has many small commits with no clear headline, fall back to a noun phrase that captures the change (`Image upload on activation`, `Activity hook cleanup`). Keep it under ~70 characters.

Don't include the Linear ticket in the title — it goes in the body.

### 7. Write the body

Use this exact template — it matches `.github/pull_request_template.md`:

```markdown
### Description

<2-4 sentence summary of what's shipping and why. Pull from the dominant commit body where it's well-written; otherwise synthesize from the diff. Lead with the SDK-visible behavior change (new hook, new field on a response/params type, new query key, etc.), then root cause / approach if relevant.>

### Linear Issues

- closes ENG-1886
  <one line per ticket; preserve the verb from the source (or default to `closes` for branch-only refs)>

### Testing

<Generated testing plan — see "Writing the testing plan" below. Do NOT use the template's default `I have manually tested the changes / New integration tests have been added` checkboxes; replace them with concrete steps grounded in the actual diff.>

### Semantic Versioning

Indicate the appropriate version bump for this PR:

- [ ] Breaking changes - Major version bump
- [ ] New features / improvements - Minor version bump
- [ ] Bug fixes - Patch version bump
```

**The Semantic Versioning section.** Keep this section in the body — the staging→main release PR re-uses the bumped version. Tick the box that matches the diff:

- New required fields, removed/renamed exports, changed function signatures → **major**.
- New optional fields on response/params interfaces, new hooks/queries/mutations, new WS event handlers → **minor**.
- Bug fixes, internal refactors, validation tightening that doesn't break callers → **patch**.

If the user has already bumped `package.json` on this branch, that decides it — match the box to the bump that's actually in the diff. The version itself is enforced on the staging→main PR by `version-check.yml`, not here.

**Writing the testing plan.** A feature PR's testing plan is tighter than a release's — usually 2–5 specific items. Walk the file diff (`git diff --name-only origin/staging..HEAD`) and turn it into concrete verification steps. This is a TypeScript SDK consumed by other apps (notably `client-web`), so most verification happens via type-check + a smoke pass from a consumer.

- **Query files** (`src/queries/<resource>/use*.ts`) → "Confirm `useGet*` returns the new field/shape; spot-check the query key (locale-prefixed) and that 401/404/45x routes through the right `onNotAuthorized` / `onNotFound` / `onModuleForbidden` handler."
- **Mutation files** (`src/mutations/<resource>/use*.ts`) → "Run the mutation from a consumer app and confirm the listed query keys invalidate / `SET_*_QUERY_DATA` updates as expected."
- **Interface changes** (`src/interfaces.ts`) → "Run `npm run lint` (which runs `tsc --noEmit` first) on the SDK; then `npm pack` and install the tarball into a consumer (`client-web`) — confirm the new fields surface in IDE completions and `tsc` is clean."
- **Param/input shape changes** → "Confirm callers in `client-web` still type-check against the new params; if a field became required, flag the consumer-side update needed."
- **WebSocket handler changes** (`src/websockets/{chat,threads,stream}/`, `useConnectedWebsocket.tsx`) → "Trigger a `<event-type>` over the staging WS feed and confirm the React Query cache mutates as expected (the new handler fires; existing handlers still route correctly)."
- **Custom error code changes** (`src/utilities/GetErrorMessage.ts`, `CUSTOM_ERROR_CODES`) → "Hit an endpoint that returns `<status-code>` and confirm the wrapper invokes `onModuleForbidden` (or the appropriate callback) without retrying."
- **`ConnectedProvider` / context changes** (`src/ConnectedProvider.tsx`, `src/hooks/useConnected.ts`) → "Mount a consumer with the updated provider and confirm `clientApiParams`, `getToken`, `getExecuteAs`, and the WS factory all still wire through."
- **`ClientAPI` / axios changes** (`src/ClientAPI.ts`) → "Confirm `GetClientAPI(params)` returns an axios instance with the expected `baseURL`, `Authorization`, and `x-execute-as` (when set)."
- **Index/barrel changes** (`src/index.ts`, per-folder `index.ts`) → "Run `npm run build` and inspect `dist/index.d.ts` to confirm the new symbols are exported."
- **CI workflow changes** (`.github/workflows/`) → "Confirm `tests.yml` / `linear-check.yml` / `version-check.yml` / `publish.yml` / `approve.yml` pass on this branch."
- **Local smoke** (when changes affect runtime, not just types) → "Run `npm run local` to produce a `.tgz`, install into `client-web` (or another consumer), and walk the affected screen."

Format as a markdown checklist:

```markdown
### Testing

- [ ] Run `npm run lint` and confirm `tsc --noEmit` + ESLint pass cleanly.
- [ ] `npm pack` the SDK, install the tarball into `client-web`, and confirm the new `imageUpload` field surfaces on `useGetEventActivation` / `useUpdateEventActivation` types.
- [ ] On a staging consumer, walk an activation completion with `imageUpload=true` — confirm the mutation succeeds and the cache update reflects the new fields.
- [ ] Confirm `tests.yml` passes on the next push.
```

If there are zero Linear references (you flagged this in step 4 and the user proceeded anyway), write `- (none)` under the Linear Issues heading rather than deleting the section.

### 8. Show the draft and wait

Print the title, body, reviewer list, AND the push state from step 2 back to the user, clearly labelled. If a push is needed, state explicitly that creating the PR will push first. Ask whether to proceed, modify, or cancel. Don't run `git push` or `gh pr create` until they've said yes.

The reason for confirming: the title and body are interpretive — you're summarizing the work. The user knows things you don't (whether the description undersells the change, whether the testing plan is missing a non-obvious manual step, which Semantic Versioning box is right). Five seconds of their attention up front beats editing the PR after the fact.

### 9. Push the branch (if needed) and create the PR

After confirmation:

```bash
# Only if step 2 said the branch needed pushing:
git push -u origin <branch>   # first push
# OR
git push                      # subsequent push

# Then:
gh pr create \
  --base staging \
  --head <branch> \
  --title "<title>" \
  --reviewer "<comma,separated,logins>" \
  --body "$(cat <<'EOF'
<body here>
EOF
)"
```

`gh pr create` picks up the current branch as `--head` automatically when you're on it, but pass `--head` explicitly to be safe (avoids surprises if HEAD has moved).

Return the PR URL from the command output so the user can click straight to it.

## Things to watch out for

- **Don't paste `<!-- CURSOR_SUMMARY -->` blocks** from anywhere into the new PR body. Auto-generated by the Cursor Bugbot reviewer — re-including them looks weird.
- **Don't include the HTML comment placeholders** from the PR template (`<!-- A brief description -->`) in your output — replace them with real content.
- **Keep the Semantic Versioning section.** This repo's PR template has it for a reason — the staging→main release PR re-uses the bump that landed on staging. Don't drop it from the body.
- **Don't bump `package.json` automatically.** Version bumps are landed deliberately (sometimes in their own PR, sometimes alongside a feature). If the user hasn't bumped, don't do it for them — flag it in the draft and let them decide. `version-check.yml` enforces the bump on the staging→main PR, not here.
- **`closes` vs `ref`**: `closes` auto-closes the Linear ticket on merge. For a feature → staging PR, `closes` is usually correct since this branch IS the work that closes the ticket. Preserve whichever the source commit used; default to `closes` only when the ref came from the branch name alone.
- **Don't fabricate Linear refs.** If the branch name and commits genuinely have no ticket, ask the user — don't guess from conversation context or memory of past tickets.
- **The author isn't a reviewer.** GitHub will reject `--reviewer <self>`. Always exclude `gh api user --jq '.login'` from the list.
- **Don't push without confirmation.** Pushing exposes work to the team and triggers CI (`tests.yml`). Bundle it with PR creation behind the user's go-ahead.

## Why this exists

Feature → staging PRs follow the same template as release PRs but with a much simpler input — a single branch, usually a single ticket. Doing it by hand consistently misses the Linear ref (especially when it lives in the branch name only), the testing plan defaults to the empty template checkboxes, the Semantic Versioning section gets dropped, and reviewers get inconsistent. Templating the body and harvesting refs from the branch name is mechanical work that's easy to get right in a script-shaped flow.
