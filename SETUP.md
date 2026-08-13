# Setup Guide: Adding Semantic Release Workflows to Your Repo

## Prerequisites

- GitHub repo with write access
- JIRA account with API token access
- Teams channel for notifications
- Node.js and jq installed locally (optional, for testing)

## Step 1: Copy Workflow Files

```bash
cd your-repo
mkdir -p .github/workflows
cp -r /path/to/github-workflow-templates/.github/workflows/* .github/workflows/
git add .github/workflows/
git commit -m "chore: add semantic release workflows from canonical template"
```

## Step 2: Create JIRA API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a name: "GitHub Actions - [Your Repo Name]"
4. Copy the token (you won't see it again)

## Step 3: Create Teams Webhook

1. Open your Teams channel where notifications should be sent
2. Click "..." (More options) → "Connectors"
3. Search for "Incoming Webhook"
4. Configure it:
   - Name: "GitHub - [Your Repo Name]"
   - Image (optional): GitHub logo
5. Copy the webhook URL

## Step 4: Add GitHub Secrets

In your GitHub repo settings:

1. Go to Settings → Secrets and variables → Actions
2. Add these secrets:
   - **JIRA_API_TOKEN:** Paste the token from Step 2
   - **JIRA_EMAIL:** Your Tenna email (e.g., firstname.lastname@tenna.com)
   - **TEAMS_WEBHOOK_URL:** Paste the webhook URL from Step 3

## Step 5: Create VERSION.md

Create file: `VERSION.md`

```markdown
# Version Info

**Current Version:** `1.0.0-build.0`
**Release Target:** `2026.04`
**Branch Type:** `main`
**Status:** Development branch

See [VERSIONING.md](VERSIONING.md) for how versioning works.
```

Update the version and release target to match your current state.

## Step 6: Create VERSIONING.md

Create file: `VERSIONING.md`

```markdown
# Versioning Guide for [Your Repo Name]

> **This repository uses semantic versioning with build numbers: MAJOR.MINOR.PATCH-build.BUILD**

## Quick Reference

- Current version: See [VERSION.md](VERSION.md)
- Canonical template: [tenna-llc/github-workflow-templates](https://github.com/tenna-llc/github-workflow-templates)

## Semantic Versioning: MAJOR.MINOR.PATCH-build.BUILD

- **MAJOR:** Bumped when creating new release branch off main
- **MINOR:** Bumped for interim releases or special deployments
- **PATCH:** Bumped for hotfixes on release branches
- **BUILD:** Auto-increments on each commit; resets to 0 on MAJOR/MINOR/PATCH bumps

## How to Bump Version

### For Hotfixes (on release/YYYY.MM branch)

1. Go to GitHub Actions → "Bump Version" workflow
2. Click "Run workflow"
3. Select:
   - Branch: `release/2026.04` (or your current release)
   - Bump type: `patch (hotfix)`
4. Click "Run"
5. Workflow will:
   - Validate your JIRA ticket (extract from branch name or recent commits)
   - Confirm bump is allowed on this branch
   - Display new version
   - Create tag and update VERSION.md
   - Send Teams notification

### For Interim Releases (on release/YYYY.MM branch)

Same as above, but select `minor (interim)` as bump type.

Example: `1.2.3-build.1` → `1.3.0-build.0`

### For Creating New Release Branch (from main)

1. Go to GitHub Actions → "Create Release Branch" workflow
2. Click "Run workflow"
3. Enter new release name: `2026.05` (format: YYYY.MM)
4. Click "Run"
5. Workflow will:
   - Bump main's MAJOR version
   - Create frozen release/2026.05 branch
   - Notify Teams when complete

## Examples

### Scenario 1: Merge feature to main

1. Create feature branch: `feat/yourname.TS-1234.my-feature`
2. Work on feature
3. Squash commits locally
4. Push to GitHub
5. Create PR targeting main
6. Merge when approved
7. Build number auto-increments on main (no manual action needed)

### Scenario 2: Create hotfix on release branch

1. Create bugfix branch: `bugfix/yourname.TS-5678.release.my-fix`
2. Work on fix
3. Push and create PR targeting release/2026.04
4. Merge when approved
5. Go to GitHub Actions → "Bump Version"
6. Select "patch (hotfix)" and run
7. Version bumps from 1.2.3-build.5 → 1.2.4-build.0
8. Deploy the new version

## Troubleshooting

### "JIRA ticket not found"
- Ensure ticket ID is in branch name (e.g., `bugfix/yourname.TS-1234.fix-name`)
- Or include it in your last commit message

### "Cannot bump MAJOR on release branch"
- Major bumps only allowed when creating new release branch
- Use "Create Release Branch" workflow instead

### VERSION.md not updated after bump
- Check workflow logs (GitHub Actions tab)
- May need to refresh the page or run `git pull`

## Need Help?

See [canonical template docs](https://github.com/tenna-llc/github-workflow-templates) or contact your engineering lead.
```

Commit these files:

```bash
git add VERSION.md VERSIONING.md
git commit -m "docs: add version tracking and versioning guide"
```

---

## Complete Setup Checklist

- [ ] Copied .github/workflows/ to your repo
- [ ] Created JIRA API token
- [ ] Created Teams webhook
- [ ] Added JIRA_API_TOKEN secret in GitHub
- [ ] Added JIRA_EMAIL secret in GitHub
- [ ] Added TEAMS_WEBHOOK_URL secret in GitHub
- [ ] Created VERSION.md in repo root
- [ ] Created VERSIONING.md in repo root
- [ ] Committed all changes to main
- [ ] Tested bump-version workflow with test branch

## Next Steps

1. Verify all secrets are configured
2. Create a test release branch
3. Test bump-version workflow (see README Testing section)
4. Share VERSIONING.md with your team
5. Include link to canonical template in team docs
