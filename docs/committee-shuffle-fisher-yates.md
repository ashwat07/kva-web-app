# Committee Shuffle: Fisher–Yates Algorithm & Stagger Animation

This document explains how the **Youth Wing** and **Ladies Wing** member lists are shuffled on the Committee page, and how the reveal animation works. It is intended as a reference for maintainers.

---

## 1. Why shuffle?

Committee members with the role **"Member"** are many; office bearers (Chairperson, Vice Chairperson, Convenor, etc.) are few and stay in a fixed order. If we always show members in the same order, the same people appear at the top every time. Shuffling **only** the "Member" entries gives everyone a fair chance to appear near the top across visits, while keeping the leadership order consistent.

---

## 2. Fisher–Yates shuffle (what we use)

We use the **Fisher–Yates shuffle** (also called Knuth shuffle) to randomize the "Member" list. It is:

- **Unbiased**: every permutation of the array is equally likely.
- **In-place style**: we work on a copy so we don’t mutate the original list.
- **O(n)**: one pass over the array.

### 2.1 Algorithm (modern “swap from end” form)

Conceptually:

1. Start with the last index `i = length - 1`.
2. Pick a random index `j` in `[0, i]` (inclusive).
3. Swap the elements at `i` and `j`.
4. Decrease `i` by 1 and repeat until `i === 0`.

After one pass, the array is uniformly random.

### 2.2 Code in this repo

Location: `src/app/committee/ShuffledWingSection.tsx`

```ts
function shuffleMembers<T>(array: T[]): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
```

- `out` is a **copy** of the input, so the original list is never mutated.
- Loop runs from last index down to `1` (when `i === 0`, nothing left to swap).
- `j` is random in `[0, i]` because `Math.random()` is in `[0, 1)` and `Math.floor(Math.random() * (i + 1))` gives integers `0 .. i`.
- Swap uses destructuring: `[out[i], out[j]] = [out[j], out[i]]`.

### 2.3 Why not other shuffles?

- **Sort with random comparator** (e.g. `array.sort(() => Math.random() - 0.5)`): not uniformly random; some permutations are more likely than others. Avoid for “fair” shuffle.
- **Pick random index, splice, push**: correct but O(n²) and more code. Fisher–Yates is simpler and O(n).

So we use Fisher–Yates for a correct, efficient, and simple shuffle.

---

## 3. How we apply it: officers vs members

We do **not** shuffle the full list. We keep office bearers in order and shuffle only "Member" entries.

```ts
function splitAndShuffle(members: CommitteeMember[]): CommitteeMember[] {
  const officers = members.filter((m) => m.role !== "Member");
  const membersOnly = members.filter((m) => m.role === "Member");
  const shuffledMembers = shuffleMembers(membersOnly);
  return [...officers, ...shuffledMembers];
}
```

- **Officers**: Chairperson, Vice Chairperson, Convenor, Joint Convenor, etc. Stay in the same order at the top.
- **Members**: everyone with `role === "Member"`. Only this slice is shuffled with Fisher–Yates.
- **Result**: `[ ...officers, ...shuffledMembers ]` — fixed hierarchy, then random member order.

This is called once per wing when the component mounts (see below).

---

## 4. When the shuffle runs (React lifecycle)

- **Where**: `ShuffledWingSection` is a client component; the list is stored in state `shuffled`.
- **When**: Inside a `useEffect` with an empty dependency array, so it runs **once after the first paint** (after mount).
- **Why in effect**: Shuffle uses `Math.random()`. If we shuffled during render, we’d get a different order on the server and the client, which can cause hydration mismatches. Doing it only on the client, in an effect, avoids that and keeps the order stable for the rest of the session.

So: first render shows a skeleton (or empty); effect runs → `splitAndShuffle(members)` → `setShuffled(...)`; next render shows the shuffled list with animation.

---

## 5. Stagger animation

After the shuffled list is set, each card is rendered with a **staggered** “slide up and fade in” so they don’t all appear at once.

- **Mechanism**: Each card wrapper has the class `animate-slide-up-stagger` and an inline `animationDelay` based on index: `index * STAGGER_MS` (e.g. 45 ms between cards).
- **Keyframes**: In `src/app/globals.css`, the animation goes from `translateY(20px); opacity: 0` to `translateY(0); opacity: 1`, so cards move up and fade in.
- **Effect**: Card 0 animates immediately, card 1 after 45 ms, card 2 after 90 ms, etc., giving a quick wave of reveals.

So:

1. **Shuffle** (Fisher–Yates on "Member" only) decides **order**.
2. **Stagger** (CSS animation + delay) decides **how** that order appears on screen.

---

## 6. File and flow summary

| Item | Location / detail |
|------|--------------------|
| Shuffle algorithm | `ShuffledWingSection.tsx`: `shuffleMembers<T>()` |
| Split + shuffle | `ShuffledWingSection.tsx`: `splitAndShuffle()` |
| When it runs | `useEffect` with `[]` in `ShuffledWingSection` |
| Stagger class | `globals.css`: `.animate-slide-up-stagger` |
| Keyframes | `globals.css`: `@keyframes slideUp` |
| Usage | Committee page: Ladies Wing and Youth Wing sections |

---

## 7. References

- [Fisher–Yates shuffle (Wikipedia)](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
- React: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) (for when to run “run once on mount” logic)
