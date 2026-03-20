# CI Native Binaries: Why Builds Failed on Linux and How We Fixed It

This document explains why the build failed on **GitHub Actions** (Linux) with errors about **sharp**, **@tailwindcss/oxide**, and **lightningcss**, and why we run a single extra command in CI to fix it. It is written so that beginners can follow the full story.

---

## 1. Beginner concepts you need first

### 1.1 What is “CI”?

**CI** (Continuous Integration) means “run checks automatically when someone pushes code or opens a pull request.” In this repo, we use **GitHub Actions**: when you push or open a PR, a job runs on GitHub’s servers that installs dependencies, runs lint, typecheck, and **build**. That runner is always **Linux** (Ubuntu, x64). Your laptop might be **macOS** or Windows. So “your machine” and “CI” are **different operating systems**.

### 1.2 What is a “native” Node.js package?

Most npm packages are **pure JavaScript**: the same code runs on Windows, Mac, and Linux. Some packages use **native code** (C, C++, Rust, etc.) for speed. Those ship a small **binary** (a compiled file like `something.node`) that is **different for each OS and CPU**:

- On **macOS (Apple Silicon)** you need the `darwin-arm64` binary.
- On **macOS (Intel)** you need the `darwin-x64` binary.
- On **Linux (most servers and GitHub Actions)** you need the `linux-x64` binary.
- On **Windows** you need a `win32-...` binary.

If the right binary for the current platform isn’t there, Node.js throws an error like “Cannot find module” or “Could not load the … module using the … runtime.”

### 1.3 What are “optional dependencies”?

To avoid installing every platform’s binary (which would make the install huge), some packages put these platform-specific binaries in **optional dependencies**. So the main package (e.g. `sharp`) is always installed, but npm only installs **one** of the optional packages—the one that matches the **machine where you run `npm install`**. So:

- When **you** run `npm install` on your **Mac**, npm installs the **Mac** optional (e.g. `@img/sharp-darwin-arm64`).
- When **CI** runs `npm ci` on **Linux**, it uses the **same** lockfile. Because of how the lockfile was generated (usually on your Mac), npm might **not** install the **Linux** optional. So on CI you end up with the JavaScript code but **no Linux binary** → error.

### 1.4 What is the lockfile?

**package-lock.json** (the “lockfile”) records the exact versions and optional dependencies that were resolved the last time someone ran `npm install` (often on a Mac). **`npm ci`** in CI installs **exactly** what the lockfile says. So if the lockfile was created on macOS, it can “lock in” only the macOS optionals, and on Linux the Linux optionals never get installed. That’s the root cause of our CI failures.

---

## 2. The three packages that failed (and why we need them)

Our build uses three packages that ship **platform-specific native binaries**. Each one failed once on CI until we fixed it.

| Package | What it does | Where it’s used in this repo |
|--------|----------------|------------------------------|
| **sharp** | Image processing (resize, crop, read dimensions). Uses native code (libvips). | `scripts/generate-thumbnails.mjs` (gallery thumbnails). Runs in **prebuild** before every build. |
| **@tailwindcss/oxide** | Tailwind CSS v4’s Rust engine (parsing, compiling CSS). | Used by `@tailwindcss/postcss` and Tailwind. Loaded when Next.js compiles CSS. |
| **lightningcss** | Very fast CSS parser/transformer (minify, vendor prefixes, etc.). | Used by Tailwind/Next for CSS. Error was: “Cannot find module '../lightningcss.linux-x64-gnu.node'”. |

So:

- **sharp** → needed for the thumbnail script during build.
- **@tailwindcss/oxide** and **lightningcss** → needed when Next.js compiles your CSS (e.g. in `layout.tsx` and all Tailwind styles).

If **any** of these is missing its Linux binary on the CI runner, the build fails with a “native binding” or “Cannot find module … .node” error.

---

## 3. The errors we saw (in order)

### 3.1 Sharp

```text
Error: Could not load the "sharp" module using the linux-x64 runtime
```

- **Meaning:** The sharp **JavaScript** was there, but the **linux-x64** native binary was not.
- **When:** During build, when the prebuild script ran `generate-thumbnails.mjs` and it tried to load sharp.

### 3.2 @tailwindcss/oxide

```text
Error: Cannot find native binding. npm has a bug related to optional dependencies ...
    at ... node_modules/@tailwindcss/oxide/index.js
```

- **Meaning:** The Tailwind/Oxide **JavaScript** was there, but the **Linux native binary** for Oxide was not.
- **When:** During build, when Next.js/Tailwind tried to compile CSS (e.g. from `layout.tsx` or Tailwind).

### 3.3 Lightningcss

```text
Error: Cannot find module '../lightningcss.linux-x64-gnu.node'
Require stack:
  ... node_modules/lightningcss/node/index.js
  ... node_modules/@tailwindcss/node/dist/index.js
  ...
```

- **Meaning:** The lightningcss **JavaScript** was there, but the **Linux x64** native binary (`lightningcss.linux-x64-gnu.node`) was not.
- **When:** During build, when Tailwind/Next tried to use lightningcss for CSS.

All three errors have the same **underlying cause**: on the CI runner (Linux), npm did not install the **Linux** optional dependency for these packages, so the native `.node` file was missing.

---

## 4. Why did the Linux binaries end up missing?

Short version:

1. **package-lock.json** was almost certainly generated on **your machine** (e.g. macOS) when you ran `npm install`.
2. On that machine, npm installed only the **macOS** optional dependencies (e.g. `sharp-darwin-arm64`, Oxide for darwin, lightningcss for darwin).
3. In **CI**, GitHub Actions runs on **Linux**. When the workflow runs **`npm ci`**, it uses the **same** lockfile. Because of how npm resolves optionals and the lockfile contents, npm often **does not** install the **Linux** optionals in this situation. So you get the JS code but not the `.node` files for Linux.
4. When the build then runs on the Linux runner, each of these packages tries to load its native binary for **linux-x64** and fails.

So the issue is **cross-platform**: “works on my machine” (Mac) but “fails in CI” (Linux) because the lockfile and install behavior are tied to the platform where dependencies were last installed.

---

## 5. The fix: one extra step in CI

We did **not** change the lockfile or remove any package. We added **one step** in the GitHub Actions workflow that runs **after** `npm ci` and **before** lint/build. That step tells npm: “on this Linux runner, install the Linux x64 binaries for these three packages.”

### 5.1 The exact command

In **`.github/workflows/pr-checks.yml`** we have:

```yaml
# Native binaries (sharp, tailwindcss, lightningcss) are platform-specific;
# lockfile generated on macOS may lack the Linux variants.
- name: Install platform-specific binaries for Linux (CI)
  run: npm install --os=linux --cpu=x64 sharp @tailwindcss/oxide lightningcss
```

So the **command** is:

```bash
npm install --os=linux --cpu=x64 sharp @tailwindcss/oxide lightningcss
```

### 5.2 What each part means (beginner-friendly)

- **`npm install`**  
  “Install (or fix) some packages.” We already ran `npm ci` in the step before; this second install only adds/repairs the **native** parts for the packages we list.

- **`--os=linux`**  
  “Pretend the current platform is **Linux** when choosing which optional dependency to install.” So npm will pick the **Linux** variant of each package’s optional binary, not the Mac or Windows one.

- **`--cpu=x64`**  
  “Use the **x86_64** (64-bit Intel/AMD) variant.” GitHub Actions runners are `linux-x64`, so we need the `linux-x64` (or `linux-x64-gnu`) binaries. This flag ensures that.

- **`sharp`**  
  The image library. This makes sure the **linux-x64** optional (e.g. `@img/sharp-linux-x64`) is installed so `generate-thumbnails.mjs` can load sharp on the runner.

- **`@tailwindcss/oxide`**  
  Tailwind’s Rust engine. This makes sure its **linux-x64** native binary is present so CSS compilation works on the runner.

- **`lightningcss`**  
  The CSS tool used by Tailwind/Next. This makes sure **lightningcss.linux-x64-gnu.node** (or the right Linux x64 binary) is present so the “Cannot find module … lightningcss.linux-x64-gnu.node” error goes away.

So in one line we say: “On this Linux x64 machine, ensure the Linux x64 native binaries for **sharp**, **@tailwindcss/oxide**, and **lightningcss** are installed.”

### 5.3 Order of steps in the workflow

1. **Checkout** – get the repo code.
2. **Setup Node.js** – install Node 20 and use npm cache.
3. **Install dependencies** – run **`npm ci`** (install from lockfile; may still miss Linux optionals).
4. **Install platform-specific binaries for Linux (CI)** – run **`npm install --os=linux --cpu=x64 sharp @tailwindcss/oxide lightningcss`** so the Linux binaries are there.
5. **Lint** – run ESLint.
6. **Typecheck** – run TypeScript check.
7. **Build** – run **`npm run build`** (prebuild runs thumbnails → sharp; Next compiles CSS → Oxide and lightningcss). All three can now load their Linux binaries, so the build succeeds.

### 5.4 Why this is safe

- We still use **`npm ci`** for the main install, so the rest of the dependency tree stays exactly as in the lockfile.
- This step only **adds or repairs** the Linux binaries for these three packages. It doesn’t change your `package.json` or your app code.
- It runs **only in CI** (on the Linux runner). On your Mac, you keep using the Mac binaries; nothing changes locally.

---

## 6. If you see another “Cannot find … .node” or “native binding” error

If in the future the build fails with a similar error for **another** package (e.g. another native addon), you can:

1. Read the error: it usually says which **package** and which **platform** (e.g. `linux-x64`) are missing.
2. Add that **package name** to the same install command in the workflow, e.g.:
   ```yaml
   run: npm install --os=linux --cpu=x64 sharp @tailwindcss/oxide lightningcss THE_NEW_PACKAGE
   ```
3. Commit, push, and re-run the workflow.

You still use the **same** flags: `--os=linux --cpu=x64` for GitHub Actions’ Linux x64 runners.

---

## 7. Summary table

| What | Detail |
|------|--------|
| **Problem** | Build failed on CI (Linux) with “Could not load sharp”, “Cannot find native binding” (Oxide), or “Cannot find module … lightningcss.linux-x64-gnu.node”. |
| **Cause** | Lockfile was generated on macOS; on Linux, npm didn’t install the **Linux x64** optional dependencies for sharp, @tailwindcss/oxide, and lightningcss, so their native binaries were missing. |
| **Fix** | After `npm ci`, run: `npm install --os=linux --cpu=x64 sharp @tailwindcss/oxide lightningcss` so the Linux x64 binaries are present on the runner. |
| **Where** | `.github/workflows/pr-checks.yml` – one step: “Install platform-specific binaries for Linux (CI)”. |
| **Why one command?** | All three packages have the same kind of issue (missing Linux optional). One install with `--os=linux --cpu=x64` and all three package names fixes them in a single step. |

---

## 8. References

- [sharp – Install (cross-platform)](https://sharp.pixelplumbing.com/install#cross-platform)
- [npm optional dependencies](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#optionaldependencies)
- [GitHub Actions – Ubuntu runner](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners) (Linux x64)

This doc is the single place to look when someone asks: “Why does CI need that `npm install --os=linux --cpu=x64 ...` step?” or “Why did the build fail with sharp / Oxide / lightningcss on Linux?”
