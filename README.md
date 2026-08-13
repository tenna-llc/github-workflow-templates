# GitHub Workflow Templates

Canonical semantic release workflows for Tenna projects.

## Overview

This repo contains reusable GitHub Actions workflows for semantic versioning with build numbers:
- `create-release-branch.yml` — Create a new release branch (bumps MAJOR on main)
- `bump-version.yml` — Manually bump MINOR (interim) or PATCH (hotfix) versions
- `auto-tag.yml` — Auto-tag on commits (future enhancement)

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

## References

- [Development Workflow (Wiki)](https://tenna.atlassian.net/wiki/spaces/SE/pages/4620301/Development+Workflow)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Pilot & Rollout Status

- [fe-parts Pilot Results](https://github.com/tenna-llc/fe-parts/blob/main/PILOT_RESULTS.md) ✓ SUCCESSFUL
- Ready for wider frontend repo rollout
