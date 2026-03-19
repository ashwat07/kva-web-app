# Sharp on CI: Why It Failed and How We Fixed It

This document explains why the **sharp** module failed to load on GitHub Actions (Linux) and how we fixed it. It is a reference for maintainers and for future CI or cross-platform issues.

---

## 1. What is sharp?

**sharp** is a Node.js library for high-performance image processing (resize, crop, format conversion, etc.). It is built on **libvips**, a native C library. Unlike pure JavaScript libraries, sharp ships **platform-specific native binaries** (`.node` files) for different operating systems and CPU architectures.

In this repo, sharp is used by:

- **`scripts/generate-thumbnails.mjs`** – generates resized gallery thumbnails and reads image dimensions.
- The **build** step – because `package.json` has a `prebuild` script that runs `generate-thumbnails`, so every `npm run build` runs the thumbnail script, which `require()`s or `import`s sharp.

So when CI runs `npm run build`, it eventually loads sharp. If the correct native binary for the CI runner’s platform is missing, the process throws and the build fails.

---

## 2. The error we saw

On GitHub Actions (Ubuntu Linux, x64), the build failed with:

```text
Error: Could not load the "sharp" module using the linux-x64 runtime
Possible solutions:
- Ensure optional dependencies can be installed:
    npm install --include=optional sharp
- Ensure your package manager supports multi-platform installation:
    See https://sharp.pixelplumbing.com/install#cross-platform
- Add platform-specific dependencies:
    npm install --os=linux --cpu=x64 sharp
...
    at Object.<anonymous> (.../node_modules/sharp/lib/sharp.js:120:9)
```

So:

- The **JavaScript** part of sharp was present (the code in `node_modules/sharp`).
- The **native binary** for **linux-x64** was missing or not loadable.
- Sharp then threw and the build stopped.

---

## 3. Why did the linux-x64 binary end up missing?

### 3.1 How sharp is installed

The main package `sharp` declares many **optionalDependencies**: one (or more) per platform, e.g.:

- `@img/sharp-darwin-arm64` (macOS, Apple Silicon)
- `@img/sharp-darwin-x64` (macOS, Intel)
- `@img/sharp-linux-x64` (Linux, x86_64)
- `@img/sharp-win32-x64` (Windows, x64)
- etc.

When you run `npm install` or `npm ci`, npm:

- Always installs the main `sharp` package.
- For **optionalDependencies**, it typically installs only the one that matches the **current** platform (the machine where you run the install). That keeps installs fast and avoids pulling in binaries for every OS.

So:

- On a **Mac** (e.g. your laptop), `npm install` or `npm ci` tends to install the **darwin** optional dependency (e.g. `@img/sharp-darwin-arm64` or `sharp-darwin-x64`), and the lockfile records that.
- On **GitHub Actions** the runner is **Linux x64**. When CI runs `npm ci`, it uses the **same** lockfile. Depending on npm version and how the lockfile was generated, npm may:
  - Only install the optional dependency that was resolved when the lockfile was last updated (e.g. on your Mac, so only darwin), or
  - Skip or fail to install the linux-x64 optional dependency in this environment.

So in CI we end up with the sharp **JS** code but not the **linux-x64** native binary. When the script runs and sharp tries to load the native addon for the current platform (linux-x64), it fails and throws the error above.

### 3.2 Summary

| Where        | Platform   | What gets installed / used                    |
|-------------|------------|-----------------------------------------------|
| Your machine| macOS      | `sharp` + darwin optional (e.g. darwin-arm64)|
| GitHub Actions | Linux x64 | `sharp` + lockfile may only reference darwin → **linux-x64 binary missing** |

So the issue is **cross-platform**: lockfile and install behavior are tied to the platform where dependencies were last installed, and CI runs on a different platform.

---

## 4. How we fixed it

We did **not** change the lockfile or remove sharp. We added an extra step in CI so that on the **runner’s** platform the correct sharp binary is present.

### 4.1 Change in the workflow

File: **`.github/workflows/pr-checks.yml`**

After the normal dependency install, we added:

```yaml
# sharp has platform-specific native binaries; lockfile may have been generated on macOS
- name: Install sharp for Linux (CI)
  run: npm install --os=linux --cpu=x64 sharp
```

So the sequence is:

1. **Install dependencies** – `npm ci` (from lockfile; may not install linux-x64 optional).
2. **Install sharp for Linux (CI)** – `npm install --os=linux --cpu=x64 sharp` forces npm to install sharp (and its optional dependency) for **linux-x64**, so the binary is present on the runner.
3. **Lint / typecheck / build** – build runs, prebuild runs `generate-thumbnails.mjs`, sharp loads the linux-x64 binary and succeeds.

The flags:

- `--os=linux` – treat the environment as Linux for optional dependency resolution.
- `--cpu=x64` – use the x86_64 variant.

So we are explicitly asking for the **linux-x64** sharp binary on the GitHub Actions runner. We do this only in CI; locally you keep using your own platform’s binary (e.g. darwin).

### 4.2 Why this step is safe

- **Does not replace `npm ci`** – We still install from the lockfile first. The sharp step only adds/ensures the correct native binary for the current (Linux) platform.
- **Minimal change** – No changes to `package.json` or to the thumbnail script; only the workflow file is updated.
- **Documented** – The comment in the workflow explains why the step exists, so future maintainers understand the cross-platform issue.

---

## 5. Other options (for reference)

Sharp’s error message and docs suggest alternatives. We did not use them as the primary fix, but they are useful to know:

| Approach | Command / idea | Note |
|----------|----------------|------|
| **Optional deps** | `npm install --include=optional sharp` | Ensures optional dependencies are installed; may still depend on lockfile/platform. |
| **Platform flags** | `npm install --os=linux --cpu=x64 sharp` | **What we use** – explicitly request the Linux x64 binary in CI. |
| **Rebuild** | `npm rebuild sharp` | Rebuilds native addons for current platform; can work if the right optional dep is already in the tree. |
| **Generate lockfile on Linux** | Run `npm install` once in a Linux environment and commit the new lockfile | Can help npm resolve linux optionals in CI; more invasive and can change lockfile a lot. |

If in the future the current step ever fails (e.g. npm changes behavior), trying `npm install --include=optional sharp` or `npm rebuild sharp` in CI is a reasonable next step.

---

## 6. Where sharp is used in this repo

| Location | Purpose |
|----------|--------|
| `package.json` | `devDependencies.sharp` and `prebuild` script that runs thumbnail generation. |
| `scripts/generate-thumbnails.mjs` | Imports sharp; resizes images, writes thumbnails, updates `gallery-manifest.json`. |
| `npm run build` | Runs `prebuild` → `generate-thumbnails` → sharp is loaded; CI runs this on Linux. |

So any CI job that runs `npm run build` (or runs the thumbnail script directly) on a Linux runner needs the linux-x64 sharp binary, which is why the workflow step is required.

---

## 7. Summary

| What | Detail |
|------|--------|
| **Problem** | sharp failed in CI with “Could not load the sharp module using the linux-x64 runtime” because the Linux x64 native binary was not installed. |
| **Cause** | sharp uses platform-specific optional dependencies; the lockfile was likely generated on macOS, so in CI (Linux) the linux-x64 optional wasn’t installed. |
| **Fix** | After `npm ci`, add a step: `npm install --os=linux --cpu=x64 sharp` so the Linux x64 binary is present on the runner. |
| **File changed** | `.github/workflows/pr-checks.yml` (one extra step). |
| **References** | [sharp install docs](https://sharp.pixelplumbing.com/install), especially [cross-platform](https://sharp.pixelplumbing.com/install#cross-platform). |

This gives a single place to look when someone asks “why does CI need that sharp step?” or “why did sharp fail on Linux?”
