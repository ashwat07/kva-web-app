# CI/CD Pipelines & Versioning

## GitHub Workflows (current)

| Workflow        | File                    | Trigger              | What it does                          |
|----------------|-------------------------|----------------------|----------------------------------------|
| **PR checks**  | `.github/workflows/pr-checks.yml` | Push/PR to `main` | Lint, typecheck, build                 |

### PR checks details

- **Lint**: `npm run lint` (ESLint)
- **Typecheck**: `npm run typecheck` (`tsc --noEmit`)
- **Build**: `npm run build` (Next.js build; runs `generate-thumbs` via prebuild)

Runs on **ubuntu-latest** with Node 20 and `npm ci` for installs.

---

## Versioning: standard-version (in use)

This repo uses **standard-version** for releases. It bumps `package.json`, updates `CHANGELOG.md`, and creates a git commit + tag.

### How to release

1. **First release only** (no existing tag yet):
   ```bash
   npm run release:first
   ```

2. **Later releases** (bump from last tag using conventional commits since that tag):
   ```bash
   npm run release
   ```
   - **Patch** (0.0.x): use default, or `npm run release -- --release-as patch`
   - **Minor** (0.x.0): `npm run release -- --release-as minor`
   - **Major** (x.0.0): `npm run release -- --release-as major`

3. **Push the new commit and tag:**
   ```bash
   git push --follow-tags origin main
   ```

4. **(Optional)** Create a GitHub Release from the new tag in the repo’s Releases page.

### Commit messages (recommended)

Use [Conventional Commits](https://www.conventionalcommits.org/) so the changelog is meaningful:

- `feat: add committee shuffle` → goes under “Features”
- `fix: logo clipping on gallery` → goes under “Bug Fixes”
- `docs: update README` → goes under “Documentation”

Config is in **`.versionrc.json`** (changelog sections and which types to show).

---

## Optional workflows you can add

| Workflow           | When to use                         | Notes |
|--------------------|-------------------------------------|--------|
| **Deploy preview** | Deploy every PR to a preview URL     | Vercel/Netlify do this automatically if connected to the repo. |
| **Release / publish** | Build and publish on tag or release | For versioned releases or publishing to a registry. |
| **Dependency audit** | Weekly or on PR                     | `npm audit` or Dependabot (enable in repo Security tab). |
| **E2E / Playwright** | On PR or nightly                   | Add when you add Playwright (or similar) tests. |

---

## Other versioning options (not in use)

- **semantic-release**: Fully automated from conventional commits; good for “merge → release” pipelines.
- **Release Please**: Release PR that updates version + changelog; good for teams that want review.
- **Manual**: `npm version patch/minor/major` then push the tag; no changelog automation.
