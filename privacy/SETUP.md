# Seska analytics and verification setup

Status: consent integration implemented; tracking intentionally disabled. No account ownership has been verified. This is not a legal compliance certification.

## Find the account values

1. **Google Analytics:** sign in at https://analytics.google.com/. Select the Seska property, then Admin > Data streams > the website stream. Copy the Measurement ID starting `G-`. If no property exists, create an account/property for Seska and a Web stream for `https://www.seskainvestments.com/`. [Google instructions](https://support.google.com/analytics/answer/12270356?hl=en).
2. **Google Search Console:** at https://search.google.com/search-console add the exact HTTPS URL-prefix property. Select HTML file verification and download the issued file. Prefer preserving the downloaded file unchanged at the website root. Alternatively, put its exact filename in `googleHtmlFile` in a copy of `verification.example.json` and run `node privacy/build-verification.mjs path-to-config.json`. Domain properties require DNS verification instead. [Google instructions](https://support.google.com/webmasters/answer/9008080?hl=en).
3. **Google Business Profile:** sign in at https://business.google.com/ and select the business. Complete the available Get verified method. Google chooses the available methods; adding a website file does not itself verify a Business Profile. After verification, set the website link to the canonical site URL. [Google instructions](https://support.google.com/business/answer/7107242).
4. **Bing Webmaster Tools:** at https://www.bing.com/webmasters add the website. Import an already verified Search Console property or download `BingSiteAuth.xml` and place it unchanged at the site root. Alternatively, put the issued 32-character code in `bingVerificationCode` and run the generator above. [Bing instructions](https://www2.bing.com/webmasters/help/add-and-verify-site-12184f8b).
5. **Microsoft Clarity (optional):** at https://clarity.microsoft.com/ select/create the Seska project and open Settings > Setup to get the project ID from its tracking snippet. Configure strict masking and require consent; verify the form and generated brief are unreadable in test recordings. [Consent API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2).

Microsoft Ads UET and Microsoft 365 domain verification are not enabled. Confirm scope before adding them; Microsoft 365 typically requires DNS records, not an analytics script.

## Activate only after completing the policy and account settings

- Put public IDs in `privacy/config.js`; never add passwords, private API keys, or login codes.
- Review `privacy.html`: verify that info@seskainvestments.com receives privacy requests, confirm controller details, hosting provider and log retention, lawful basis for hosting/security, international transfers, processor agreements, applicable local law, California applicability and actual sale/sharing practices, and rights-request procedures. Disclose actual provider retention/cookie durations. Confirm whether children's information is processed and any required representative/DPO details. The policy currently labels unconfirmed items rather than inventing them.
- In GA4 disable enhanced measurement (including automatic page views, form interactions, outbound clicks and downloads), Google Signals, user-provided data collection, ad personalization and advertising links. Set approved retention (prefer the shortest useful period) and accept appropriate processing terms. The integration sends explicit sanitized page views only; property-side automatic collection must not add extra events.
- In Clarity verify strict masking, retention, consent and privacy terms. Do not enable Clarity until query-string/referrer handling and a real sample recording are reviewed; script-level form masking alone cannot prove all provider-side collection is appropriate.
- Change `enabled` to `true` only once those items are resolved. Blank IDs remain disabled independently. Update the policy's current-disabled notice when activating.
- Remove any duplicate analytics snippets or host-injected trackers. Verification files are static and must remain accessible regardless of cookie choice. Host-level analytics, logs and injection settings need their own audit.
- Upload the whole static site to its established hosting destination. Verify each proof URL returns HTTP 200 with the issued content, then press Verify in each account. A successful upload is not proof of account verification.
- Use Tag Assistant/GA4 Realtime and Clarity diagnostics with your own consenting session to confirm receipt. Reject and GPC sessions must produce no analytics or Clarity requests. Test withdrawal, reload, another tab, expired preferences and blocked storage on the published domain.

## Implemented controls

Three static pages load a shared consent UI. Optional services load only after explicit category consent (Google basic Consent Mode v2, Clarity consentv2). Advertising consent stays denied. Accept and Reject have equal prominence; separate categories and footer controls allow changes. GPC conservatively disables both optional services. Valid consent lasts 180 days; malformed/expired storage fails closed. Withdrawal clears accessible first-party analytics cookies and reloads to unload SDKs; it cannot erase historical provider data.

The project brief is still local-only and is masked for Clarity together with its dialog. Google Fonts requests were removed; existing local font fallback stacks are used, so typography may differ slightly. No remote map iframe loads automatically.

Sources: [GDPR text](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng), [California privacy rights/GPC](https://oag.ca.gov/privacy/ccpa), [consent implementation](https://developers.google.com/tag-platform/security/guides/consent), [consent choice and withdrawal](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/).
