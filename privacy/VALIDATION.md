# Validation — 17 September 2026

Passed locally in headless Microsoft Edge using Playwright:

- No third-party requests before consent, after rejection, or with unconfigured production IDs.
- Both optional services load after acceptance; each category can be enabled separately.
- Google denied defaults precede configuration; advertising remains denied.
- Withdrawal unloads SDKs through reload; rejection survives reload; another tab's withdrawal is respected.
- Global Privacy Control overrides stored opt-ins.
- Invalid, expired and unavailable storage do not authorize tracking.
- Explicit page-view payloads exclude URL queries, fragments and referrer.
- Consent dialog contains keyboard focus; Escape closes it and returns focus.
- All three HTML pages include one consent banner; 375px viewport has no horizontal overflow.
- No page JavaScript errors in the checked production-disabled session and accept/withdraw flow.

Vendor SDK requests were intercepted with test responses and synthetic IDs. These checks validate gating and queued commands, not real vendor SDK behaviour, cookie deletion by vendor SDKs, provider receipt or legal compliance. Published-domain tests, valid account IDs, actual recording masking/retention and verification success remain pending.

`node --check` passed for the consent and browser-test scripts. The empty verification configuration generates no proof files.

To rerun: install Playwright in a development environment, then `node privacy/test-consent.mjs`. It defaults to installed Microsoft Edge. Set `PLAYWRIGHT_CHANNEL=chrome` for Chrome; if Playwright is installed elsewhere, set `PLAYWRIGHT_MODULE` to its absolute `index.mjs` path. Screenshots are written beside the checkout in `privacy-evidence/`.
