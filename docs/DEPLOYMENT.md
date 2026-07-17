# Deployment

## Overview
- Project: svlab-online-web (SV Lab marketing site)
- Environments: production
- Deploy branch: `main`
- Deploy trigger: CI on push to `main` (also `workflow_dispatch`)

## Platforms / targets
| Env | Platform | App / service | Region | Notes |
|-----|----------|---------------|--------|-------|
| production | GitHub Pages | `ssheleg/svlab-online-web` | — | Apex `svlab.online` via `public/CNAME`; DNS on Cloudflare |

## Pre-deploy gate
Commands that must pass before deploying:
- Type check + build: `npm run build` (runs `astro check` then `astro build`; `prebuild` regenerates OG PNGs)
- Lint: none configured
- Tests: none configured

## Deploy steps
1. Ensure working tree is clean on `main` with all release commits.
2. `git push origin main`
3. GitHub Actions workflow `.github/workflows/deploy.yml` runs:
   - `build` — `withastro/action@v3` (Node 22, npm)
   - `deploy` — `actions/deploy-pages@v4` to the `github-pages` environment
4. Wait for the workflow to finish green (`gh run watch`).

## Environment variables / secrets
- Stored in: none required for the static build
- GitHub Pages / Actions use built-in `pages: write` and `id-token: write` permissions from the workflow

## Migrations / release-phase commands
- None (static site)

## Post-deploy verification
- Health check URL: `https://svlab.online/` → expected HTTP 200 and updated footer/content
- CI: workflow name `Deploy site to GitHub Pages` — `gh run list --workflow=deploy.yml --limit 3`
- Custom domain: GitHub Pages settings should show published at `https://svlab.online`

## Rollback
1. `git revert <bad-sha>` on `main` (or reset only if the bad commit was never pushed and user explicitly allows)
2. `git push origin main`
3. Wait for the deploy workflow to republish the previous site

## Contacts / ownership
- Owner: Siarhei Sheleh (`contact@svlab.online`)
