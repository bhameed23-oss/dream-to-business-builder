# Technical Pitfall Checklist (for custom-built or AI-assisted software)

The other modules in this folder are written for a non-technical business owner. This one is for the moment a business has (or is getting) actual custom software built — a website with a login, an app, an internal tool — especially when it was built quickly with AI assistance ("vibe-coded"). It's a checklist of specific, common bugs, not general advice.

**Credit:** this list is adapted from Matt Murphy / The Faction Group LLC's public research and short-video series on security gaps that show up repeatedly in AI-built software (Facebook page "The Faction Group LLC," mattmurphy.ai). The descriptions and fixes below are written independently, following standard, widely published security practice (OWASP Top 10, OWASP LLM Top 10) — nothing from his paid courses, exams, or audit product is reproduced here. This is general education, not a substitute for an actual security review of custom software.

## How to use this

Give this list to whoever built (or is building) your software — yourself, a contractor, or an AI assistant — and ask them to walk through it and report back plainly: which items apply, which don't (and why not), and which need fixing before real customers use the system. If nobody can answer these questions about your software, that's itself a signal to get an independent review before launch.

## The checklist

**Secrets and keys**
- Are any API keys, passwords, or tokens written directly into the code, rather than kept as environment variables or in a secret manager?
- Do any of those "public" environment variables (ones with prefixes like `NEXT_PUBLIC_`, `VITE_`) accidentally contain something that should be private?
- Is a `.env` file (which usually holds secrets) accidentally saved into the code's version history?

**Logins and sessions**
- Are login tokens stored in a place any script on the page could read (like browser local storage), or in a safer, code-inaccessible cookie?
- Is there a limit on how many times someone can guess a password before something slows them down?
- Are passwords run through a deliberately slow, one-way process (bcrypt, Argon2, or PBKDF2) rather than a fast hash or, worse, stored in plain text?
- Does a password reset respond the same way whether or not the email address actually exists in the system? (If it doesn't, that's a way to check who has an account.)

**Money**
- Does the price a customer pays ever come from something the customer's own browser sent, rather than being looked up on the server from a fixed price list? (If so, a customer could change the price before paying.)

**Data and databases**
- If the database supports row-level security (a way to make sure one customer's data can never accidentally be shown to another), is it actually turned on for every table with customer data?
- Is any part of a database query built by directly pasting in text someone typed, rather than using safe, parameterized queries? (This is the classic "SQL injection" bug.)
- Does an admin-only or app-only database key ever get used inside code that responds to regular customer requests? That kind of key usually bypasses all the safety rules above.

**Talking to the outside world**
- Does the server ever fetch a URL that a user supplied, with no restriction on where that URL can point? (This can be tricked into reaching internal systems that were never meant to be public.)
- Does a "redirect" or "return to this page after login" feature accept any address a user gives it, rather than only the business's own pages?
- Are automated/scheduled tasks (cron jobs) and payment/notification webhooks protected by a secret or signature check, so a stranger who finds the URL can't trigger them?

**Showing information back to users**
- Does an error message ever show the customer a technical detail (a database error, a file path, a stack trace) rather than a plain "something went wrong"?
- Is text a user typed (a name, a comment, a review) ever placed directly onto a page without being safely escaped first? (This is the classic "cross-site scripting" bug — see the real example in lessons-from-real-projects.md.)
- If the system sends emails that include a customer's own text, is that text kept out of the email's formatting so it can't be used to fake the look of official communication?

**Access control**
- For any page or feature reached by an ID in the address (like `/orders/1042`), does the system check that the *current* logged-in person actually owns that specific record — or would changing the number in the address show someone else's data?
- Are admin-only pages and their underlying actions actually protected by a real permission check, not just hidden from the menu?

**The basics**
- Is the whole site served over HTTPS, with no leftover plain `http://` links?
- Are security headers set (a Content-Security-Policy, and a couple of others) so a browser knows what the page should and shouldn't be allowed to do?
- Is there any kind of automated testing or review process before changes go live, or does everything go straight from "written" to "live"?

## What to do with the answers

- Anything found already broken and reachable by a stranger today (secrets, payments, data access) — fix before anyone else uses the system.
- Anything that's a real gap but needs the business to run and confirmed working (backups, monitoring, an incident plan) — schedule it, don't skip it.
- Anything unclear — get a second, independent look. As Matt Murphy's own material puts it in different words: the same AI (or the same person) that built something rarely catches its own mistakes reviewing it a second time.

## Related docs

- [security/lessons-from-real-projects.md](./lessons-from-real-projects.md)
- [security/security-training.md](./security-training.md)
- [security/incident-response.md](./incident-response.md)
