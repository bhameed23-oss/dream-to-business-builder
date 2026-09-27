# Lessons From Real Projects

The other security modules in this folder (security-training.md, compliance-checklist.md, incident-response.md) explain security ideas in general terms. This module is different: it's a set of concrete, plain-language lessons pulled from an actual, live, previously-audited project in this account's own portfolio (the "ChaiBoy Command Center" dashboard), so a reader can see what these ideas look like when they're actually built and fixed, not just described.

Every pattern below was a real fix to a real, found problem — not a hypothetical. Where useful, the "what went wrong first" is included, because seeing the mistake makes the fix easier to remember.

## Passwords: don't store them, store a puzzle only the real password solves

**What went wrong first (elsewhere, common mistake):** storing a password in plain text, or "encrypting" it with something reversible. If the storage is ever read by the wrong person, every password in it is exposed immediately.

**The real pattern:** run each password through PBKDF2-SHA256 — a deliberately slow, one-way scrambling function — 100,000 times, with a random "salt" (extra random data) mixed in separately for every single password. What gets stored looks like `pbkdf2$sha256$100000$<salt>$<hash>` — not the password, and not anything that can be reversed back into it. Checking a login means running the same slow scramble on what was just typed and comparing results, never "decrypting" anything.

**Why the slowness is the point:** a fast hash (plain SHA-256, MD5) can be guessed millions of times a second on stolen data. A deliberately slow one (PBKDF2, or the similar bcrypt/Argon2) makes guessing a stored password impractically slow, even if the stored data leaks.

**Plain-language takeaway:** if your business software ever stores passwords for people to log in, it should never be able to show anyone (even you) what the original password was — only whether a guess was right.

## Locking accounts after repeated wrong guesses

**What went wrong first:** a login page with no limit lets an attacker try thousands of password guesses per minute, forever, with no one noticing.

**The real pattern:** after 5 wrong password attempts on the same account from the same location within 15 minutes, sign-in pauses for that combination until the 15 minutes pass. The count is stored with a built-in expiration, so it clears itself — no manual cleanup needed.

**Plain-language takeaway:** a login form needs a reason to eventually say "slow down," not just "wrong password," or it's an open invitation to guess forever.

## A "read-only" account should genuinely be unable to change anything

**What went wrong first:** it's common to build a "viewer" or "reviewer" role by just hiding buttons in the interface — but hiding a button doesn't stop someone from calling the underlying action directly.

**The real pattern:** every single action that changes something (adds, deletes, saves) checks, at the very start, in the actual server code (not just the visible screen), whether the signed-in person is allowed to make changes. A read-only reviewer gets a clear "read-only" response from the server itself, every time, regardless of what buttons the interface shows them.

**Plain-language takeaway:** if you ever give someone limited access to a system (an employee, a contractor, an auditor), the limit has to be enforced on the server, not just by hiding options on the screen — anyone who can see the option can often trigger it directly.

## Being able to cut someone off instantly

**What went wrong first:** access that's granted by adding someone's name to a shared list, config file, or spreadsheet is often just as slow to revoke — someone has to remember to go find and remove that one entry.

**The real pattern:** an account's very existence was made to depend on one single stored value (a secret). Deleting that one value turns the account off immediately, everywhere, including for anyone already signed in with an active session — there's no separate "remove access" step to forget.

**Plain-language takeaway:** design access so that revoking it is one clear action you can actually find again in a hurry (revoke this one key/password/entry) — not a hunt through several systems to remember everywhere someone might still have access.

## Never show fake success

**What went wrong first:** a few buttons in an early version of the dashboard said "Saved!" or "Created!" when the feature behind them hadn't actually been built yet — nothing was saved at all. The interface lied by accident, and the person using it had no way to know until something didn't show up later.

**The real pattern:** every action either genuinely works, or clearly says what to do instead ("this isn't wired up yet — do X manually") — never a success message for something that didn't happen.

**Plain-language takeaway:** a confident-looking "success" message is worse than an honest error, because it teaches people to trust something that isn't actually working. If a feature isn't finished, say so plainly instead of faking the happy path.

## Escaping every piece of text before it's shown on a page

**What went wrong first:** building a webpage by directly inserting text someone typed (a name, a note, a project description) straight into the page's HTML. If that text contains something that looks like an HTML tag or a script, the browser can be tricked into running it — this is called a cross-site scripting (XSS) vulnerability, and it's one of the most common ways a small business's own website ends up attacking its own visitors.

**The real pattern:** every single piece of text that came from a person (not written by the developer) gets passed through a small "escaping" step before being placed on the page, so that any HTML-looking characters are shown as plain text instead of being treated as real HTML.

**Plain-language takeaway:** anything a customer, client, or visitor typed should always be *displayed*, never *executed*, when it's shown back on a page — this applies to reviews, comments, form submissions, profile names, anything.

## Only your own front door may call your back door

**What went wrong first:** a local helper program (running on a business owner's own computer) initially accepted requests from *any* website the owner happened to have open in a browser tab — meaning any site they visited could, in theory, quietly ask that local program to do something on their behalf.

**The real pattern:** the local program checks exactly which website is allowed to talk to it (an explicit list of one or two trusted addresses) and refuses everyone else, including a plain "Origin not allowed" response instead of proceeding.

**Plain-language takeaway:** if any tool you build has one piece that talks to another piece behind the scenes, that back-and-forth should only ever be answered when it's genuinely coming from the place you expect — never "anyone who asks."

---

## Applying these lessons to whatever you build with this framework

None of the above requires the reader to build their own login system from scratch — most small businesses are better served using an established platform (Squarespace, Shopify, a CRM, a booking tool) that already handles this correctly. These lessons matter most when:
- something is being custom-built (an app, an internal tool, a customer portal) rather than bought off the shelf, or
- evaluating whether a developer, contractor, or AI-assisted build actually did this work, rather than skipped it

See also `security/technical-pitfall-checklist.md` for a more technical, code-level version of this same idea, built from outside research rather than this account's own projects.

## Related docs

- [security/README.md](./README.md)
- [security/security-training.md](./security-training.md)
- [security/technical-pitfall-checklist.md](./technical-pitfall-checklist.md)
- [security/incident-response.md](./incident-response.md)
