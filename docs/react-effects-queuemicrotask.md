# React Effects and queueMicrotask: Avoiding Synchronous setState in useEffect

This document explains **why** we avoid calling `setState` directly in the body of a `useEffect`, and **how** we use `queueMicrotask()` (and similar patterns) to satisfy the React lint rule while keeping behavior correct. It is a reference for maintainers.

---

## 1. The rule: no synchronous setState in effect body

Many React setups (including the one in this repo) use a rule that flags code like this:

```ts
useEffect(() => {
  const value = computeFromEnvironment();
  setState(value);  // ❌ Lint error: setState called synchronously in effect
}, []);
```

The rule is usually named something like **`react-hooks/set-state-in-effect`**. The idea is:

- **Effects are for**:
  - Syncing with **external systems** (DOM, subscriptions, timers, browser APIs).
  - Updating those systems from React state, or **subscribing** to them and calling `setState` **in a callback** when the external system changes.
- **Effects are not for**:
  - Doing a one-off “read something and put it in state” in a way that runs **synchronously** in the effect body. That can cause an extra render right after the effect and can be replaced by other patterns (initial state, or deferring the update).

So the linter wants:

- Either **no** `setState` in the effect body at all, or  
- `setState` only inside a **callback** (e.g. event handler, `setTimeout`, `queueMicrotask`, subscription callback), not “immediately” in the effect.

---

## 2. Why it matters (cascading renders)

If you write:

```ts
useEffect(() => {
  setState(someValue);
}, []);
```

then:

1. Component mounts and renders.
2. Effect runs.
3. `setState(someValue)` runs **synchronously**.
4. React schedules a re-render.
5. You get a second render right away.

So you get two renders in quick succession. For “read once from environment and store in state,” that’s usually unnecessary. The rule encourages either:

- Deriving the value during render (or from initial state), or  
- Deferring the update so it happens in a **callback** (e.g. after the current effect and render cycle), which the linter accepts.

---

## 3. Fix: defer setState with queueMicrotask

Instead of:

```ts
useEffect(() => {
  const value = getValue();
  setState(value);
}, []);
```

we do:

```ts
useEffect(() => {
  const value = getValue();
  queueMicrotask(() => setState(value));
}, []);
```

So we still run the effect once, read from the environment once, but we **don’t** call `setState` in the same synchronous “effect run” — we call it in a **microtask callback**. That satisfies the rule and avoids the synchronous cascading render.

---

## 4. What is queueMicrotask?

- **`queueMicrotask(callback)`** is a browser (and Node) API that schedules `callback` to run in the **microtask queue**.
- Microtasks run after the current JavaScript task (including the current effect) finishes and before the next task (e.g. paint, I/O). So:
  1. Effect runs to completion (no `setState` in the body).
  2. Effect returns (cleanup if any is registered).
  3. When the current task ends, the microtask runs: `setState(value)`.
  4. React re-renders from that state update.

So we still get exactly one extra render from “read and set state,” but the update is no longer **synchronous** inside the effect body, so the linter is happy and the pattern is clear: “after this effect, update state.”

---

## 5. Where we use it in this repo

### 5.1 InstallPrompt.tsx

We need to set several pieces of state after reading from the environment (standalone PWA, iOS, etc.). Doing that synchronously in the effect triggered the rule. So we defer those updates with `queueMicrotask`:

```ts
useEffect(() => {
  const standalone = window.matchMedia("(display-mode: standalone)").matches || ...;

  if (standalone) {
    queueMicrotask(() => setIsStandalone(true));
    return;
  }

  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || ...;

  queueMicrotask(() => {
    setIsStandalone(false);
    setIsIOS(ios);
    if (ios) {
      const dismissed = sessionStorage.getItem(DISMISS_KEY);
      if (!dismissed) setVisible(true);
    }
  });

  if (ios) return;

  // Rest of effect: e.g. addEventListener('beforeinstallprompt', ...)
}, []);
```

- All “read from environment and update state” is done inside microtask callbacks.
- Event listeners and other external sync are still set up in the effect; only the state updates are deferred.

### 5.2 NotificationManager.tsx (alternative pattern)

Here we didn’t need to store “permission” in state at all (it was unused). For “show banner after a delay,” we already call `setState` inside a **callback** (the `setTimeout` callback), which is allowed:

```ts
useEffect(() => {
  if (Notification.permission === "default" && !sessionStorage.getItem(...)) {
    const timer = setTimeout(() => setShowBanner(true), 3000);
    return () => clearTimeout(timer);
  }
}, []);
```

So: no synchronous `setState` in the effect body; `setState` runs in the timer callback. No `queueMicrotask` needed.

---

## 6. queueMicrotask vs setTimeout(fn, 0)

Both defer work to “after the current work,” but:

- **queueMicrotask(callback)**  
  - Runs in the **microtask** queue.  
  - Runs before the next task (e.g. before paint).  
  - No minimum delay; very soon after the current task.

- **setTimeout(callback, 0)**  
  - Runs in the **task** queue.  
  - Runs after the current task and after any microtasks; may run after the next paint.  
  - Has a minimum delay (often 4 ms in browsers).

For “run setState right after this effect, but not inside the effect body,” `queueMicrotask` is a good fit: minimal delay and clear intent. Use `setTimeout` when you actually want a time delay (like in NotificationManager) or when you explicitly want to yield to the event loop and paint.

---

## 7. When not to use queueMicrotask for this

- **Subscription / event-driven updates**  
  If you’re subscribing to an external system (e.g. `window.addEventListener`) and want to call `setState` when something happens, call `setState` **inside the event/subscription callback**. That’s exactly what the rule allows; no need for `queueMicrotask`.

- **Initial state from a function**  
  If the value is known at first render and doesn’t depend on `window` or other browser APIs, you can use lazy initial state: `useState(() => computeInitial())`. No effect needed.

- **SSR / hydration**  
  If you read from `window` or `document`, that only exists on the client. So we either run in an effect (and then defer the `setState` with `queueMicrotask`) or use a pattern that doesn’t render the dependent UI until after mount. The current InstallPrompt pattern does the former.

---

## 8. Summary

| Goal | Approach |
|------|----------|
| Satisfy “no synchronous setState in effect” | Call `setState` inside a callback, e.g. `queueMicrotask(() => setState(...))`. |
| “Read once from environment, store in state” | In effect: compute value, then `queueMicrotask(() => setState(value))`. |
| “React to external events” | In effect: subscribe; in the **subscription/event callback**: call `setState`. |
| “Run after a delay” | Use `setTimeout(() => setState(...), ms)`; the rule allows setState in that callback. |

The **queueMicrotask** pattern is used in **InstallPrompt.tsx** so we can read browser environment once on mount and update state without triggering the React lint rule, while keeping a single, predictable update right after the effect.
