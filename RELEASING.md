# Releasing Strand

Strand publishes every consumer package atomically on push to the `main` branch. There is no local `npm publish` and no per-package release process. Lockstep across all publishable packages is mechanically enforced.

## The release flow

1. **Bump the root version.** Edit `package.json` at the repository root and set `"version"` to the new value following semver.
2. **Sync sub-package versions.** Run `pnpm sync-versions`. This updates every publishable package in `consumers.json` to match the root version, and updates `parity-manifest.json#/version` too.
3. **Commit.** Stage the modified files and commit with a conventional commit subject describing what is changing in this release.
4. **Push to main.** The `.github/workflows/publish.yml` workflow picks up the push and handles everything else.

```bash
# Example: releasing 0.15.0
vim package.json                      # edit "version" to "0.15.0"
pnpm sync-versions                    # propagate to all packages and manifest
git add package.json packages/*/package.json parity-manifest.json
git commit -m "release: v0.15.0"
git push origin main                  # workflow takes over
```

## What the publish workflow does

On every push to `main`:

1. Checkout, install pnpm, install node, install deps
2. `pnpm build` (all packages)
3. `pnpm test` (all packages)
4. `pnpm test:parity` (cross-consumer API surface parity + lockstep version check)
5. For each publishable consumer package in order:
   - Read local version, compare against the version published on npm
   - If local > published, run `npm publish` via OIDC trusted publishing
   - If local == published, skip (already out)
6. Create a GitHub release with auto-generated notes if any package was published

If any step fails, the workflow halts. Packages that already published in this run stay published on npm; packages that did not publish in this run will be retried on the next successful push.

## The parity gate

Before any publish step runs, the workflow runs `pnpm test:parity`. This is the gate that enforces the Strand promise to external consumers: every consumer type is at API parity with every other consumer type, at the same version, in the same release. If drift is detected (a component exists in one framework package but not another, or version numbers do not match), the gate fails and no publishes happen. Fix the drift, push again.

Current parity assertions:
- Every publishable package in `consumers.json` has the same `version`
- Every framework consumer package has a directory under `src/components/` for every component listed in `parity-manifest.json#/components`
- Every package path declared in `consumers.json` exists in the repo

Future parity assertions will extend to prop shapes, CSS class names, token presence, and migration guide staleness. Extending the parity contract does not change this release flow.

## Adding a new consumer type

When a new consumer type is added to `consumers.json` and the new package is built, it joins the release flow automatically. On the next push to main, the workflow will attempt to publish the new package alongside all others. Make sure:

- The new package's `package.json` has the correct `"name"`, `"version"` (matching root), `"publishConfig.access": "public"`, and OIDC trusted publisher set up on npm
- The new package is added to `consumers.json` with `"publishable": true`
- The new package builds under `pnpm -r build`
- The new package tests under `pnpm -r test`
- The new package passes `pnpm test:parity`

No changes to the publish workflow are needed to add a new publishable consumer type. The workflow currently hardcodes four publishable packages (tokens, strand-ui, strand-vue, strand-svelte) plus the CLI. When a seventh consumer type is added, the workflow will need a new step to publish it, and that step should follow the existing pattern (version check, npm publish via OIDC).

## OIDC trusted publishing

Every publishable Strand package uses npm's OIDC trusted publishing. No tokens are stored. Configuration is at the npm registry level under the `@dillingerstaffing` organization settings. Adding a new publishable package requires adding it to the trusted publisher list on npm before the first publish can succeed.

## What not to do

- Do not run `npm publish` locally for any Strand package. Ever.
- Do not modify `package.json` versions by hand in sub-packages. Use `pnpm sync-versions`.
- Do not bump one package's version without the root. The parity check catches this and the workflow will refuse to publish.
- Do not skip the parity check locally. `pnpm test:parity` before every commit that touches package structure.
