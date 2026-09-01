# GitHub Workflow Templates

Canonical semantic release workflows for Tenna projects.

## Overview

This repo contains reusable GitHub Actions workflows for semantic versioning with build numbers:
- `create-release-branch.yml` — Create a new release branch (bumps MAJOR on main)
- `bump-version.yml` — Manually bump MINOR (interim) or PATCH (hotfix) versions
- `auto-tag.yml` — Auto-tag on commits (future enhancement)

It also contains an independent, opt-in code review workflow:
- `claude-code-review.yml` — Team-lead-triggered Claude review of a specific PR

## Quick Start

### For Repository Owners

1. Copy workflow files to your repo:
   ```bash
   cp -r .github/workflows/ your-repo/.github/
   ```

2. Configure secrets (see [SETUP.md](SETUP.md)):
   - `JIRA_API_TOKEN`
   - `JIRA_EMAIL`
   - `TEAMS_WEBHOOK_URL`

   `claude-code-review.yml` additionally requires `ANTHROPIC_API_KEY` and
   `ORG_READ_TOKEN`, both configured once at the org level — see
   [SETUP.md](SETUP.md) for what they're for. No per-repo action needed unless
   an org secret is scoped to "selected repositories."

3. Create VERSION.md and VERSIONING.md in your repo (templates provided in SETUP.md)

4. Commit and test (see Testing section below)

## Workflows

### create-release-branch.yml

**Trigger:** Manual dispatch (GitHub Actions UI)

**What it does:**
- Creates a new release branch (e.g., `release/2026.04`)
- Bumps MAJOR version on main, resets build to 0
- Freezes release branch at main's pre-bump version
- Creates GitHub release notes
- Sends Teams notification

**Example:**
```
Before: main @ 3.5.0-build.99
After:  main @ 4.0.0-build.0
        release/2026.04 @ 3.5.0-build.99 (frozen)
```

### bump-version.yml

**Trigger:** Manual dispatch (GitHub Actions UI)

**What it does:**
- Validates JIRA ticket exists (TS-XXXX format)
- Validates bump type matches branch strategy
- Displays summary of changes
- On confirmation: bumps version, creates tag, updates VERSION.md
- Sends Teams notification with version details

**Supported bumps:**
- Patch (hotfix): Increment PATCH, reset build to 0
- Minor (interim): Increment MINOR, reset build to 0

**Restrictions:**
- release/* branches: patch and minor only
- main branch: auto-driven (no manual bumps)
- feature branches: no bumps allowed

### auto-tag.yml (Future)

Automatically tags based on conventional commits. Not yet implemented.

### claude-code-review.yml

**Trigger:** Manual dispatch only (GitHub Actions UI or `gh workflow run`),
restricted to members of the `team-leads` org team. Never runs automatically
on PR open/push.

**What it does:**
- Checks out the PR at `pr_number` and runs a Claude Code review against it
- Focuses on four things only — not a generic style/lint pass:
  1. Logic correctness — traces the actual execution path against the PR's
     stated purpose, with particular attention to whether a retry/replay of
     any loop could re-emit a side effect (queue publish, DB write, webhook)
     that already happened once
  2. Repo-local consistency — flags places the PR solves a problem already
     solved elsewhere in the same repo, in a different way, with no stated reason
  3. Org-wide consistency — checks the diff against `STANDARDS.md` in this
     repo, citing the specific section on any deviation
  4. Unnecessary changes — calls out anything in the diff not required for
     the PR's stated purpose (unrelated refactors, premature abstractions,
     dead code, scope creep)
- Posts a single advisory PR comment. Never submits a formal review, never
  requests changes, never fails the workflow based on findings — **it cannot
  block a PR** unless you separately add it as a required status check
  (don't).

**Restrictions:**
- Only `team-leads` team members can trigger it (enforced by an API
  membership check in the workflow, not just GitHub's default write-access
  gate on `workflow_dispatch`)
- Runs against same-repo PRs only

**How to run it:**
```bash
gh workflow run claude-code-review.yml -f pr_number=125
```
or from the Actions tab: select "Claude PR Review (manual)" → "Run workflow" → enter the PR number.

## Setup Instructions

See [SETUP.md](SETUP.md) for:
- Secrets configuration
- JIRA API token creation
- Teams webhook setup
- Per-repo documentation templates

## Testing

Each repo should test the workflows before rolling out to production:

1. Create a test branch
2. Run `bump-version` workflow in dry-run mode
3. Verify VERSION.md was updated correctly
4. Verify Teams notification was sent
5. Delete test tags/commits

## Contributing

To update these workflows:
1. Make changes in this repo
2. Test thoroughly in a pilot repo
3. Document changes
4. Notify all consuming repos to sync

## Troubleshooting

### Workflow fails with "JIRA token invalid"
- Check JIRA_API_TOKEN secret is set correctly
- Verify token hasn't expired (regenerate if needed)

### "Cannot bump MAJOR on release branch" error
- This is intentional — major bumps only when creating new release branch from main
- Use `create-release-branch` workflow instead

### Version format validation fails
- Ensure VERSION.md contains valid format: X.Y.Z-build.N
- Example: `1.2.3-build.5`

### claude-code-review.yml fails with "is not an active member of the team-leads team"
- This is intentional — only `team-leads` members can trigger this workflow
- Ask an org admin to add you to `team-leads` if you should have access, or
  ask a current team lead to trigger it for you

### claude-code-review.yml fails before the review step runs
- Check that the org-level `ORG_READ_TOKEN` secret is set and hasn't expired
  (it needs `read:org` scope to check team membership)
- Check that `ANTHROPIC_API_KEY` is set at the org level

## References

- [Development Workflow (Wiki)](https://tenna.atlassian.net/wiki/spaces/SE/pages/4620301/Development+Workflow)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Pilot & Rollout Status

- [fe-parts Pilot Results](https://github.com/tenna-llc/fe-parts/blob/main/PILOT_RESULTS.md) ✓ SUCCESSFUL
- Ready for wider frontend repo rollout
- `claude-code-review.yml` piloting on `hapi-plugin-aemp-reader`, prompted by
  a duplicate-event-publish bug caught in manual review on
  [PR #125](https://github.com/tenna-llc/hapi-plugin-aemp-reader/pull/125) that
  this workflow is designed to catch automatically
