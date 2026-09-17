# Seska answer architecture

## Audit and implementation

The starting site had three static pages, nine service descriptions and eight FAQs concentrated on the homepage. It had no canonical links, JSON-LD, sitemap or robots.txt. About and Privacy had no H1. Useful order information competed with portfolio visuals and broad promotional headings.

The implementation keeps the visual site and existing brief tool, then adds three substantial guides. Every answer is ordinary, visible HTML. No JavaScript fetch, consent, login, special user agent or hidden text is needed to read it.

| Visitor intent | Primary destination | Structured entities |
| --- | --- | --- |
| What does Seska do, and where? | `/` and `/about.html#business-details` | LocalBusiness, WebSite, WebPage, AboutPage |
| Which service fits my job? | `/services.html` with nine service anchors | CollectionPage, ItemList, nine Service nodes |
| What should I prepare and approve? | `/ordering-guide.html` with six step anchors | WebPage, ordered ItemList |
| Pricing, timing, artwork, delivery and brief questions | `/answers.html` with 14 answer anchors | FAQPage, Question, Answer |
| Cookie choices and privacy requests | `/privacy.html` | WebPage |

All non-home pages have visible breadcrumbs and matching BreadcrumbList markup. Canonical and Open Graph URLs use `https://www.seskainvestments.com/`; the `index.html` variant canonicalizes to `/`. The sitemap lists only the six primary HTML pages. Hosting must enforce the chosen canonical domain and serve these files before discovery is possible.

## Content model and maintenance

Edit `content/answers.json`, then run `node scripts/build-aeo.mjs`. Commit both the source and generated HTML; no build service is required on the static host. The content model contains business facts, service summaries and requirements, independent question/answer records, source pointers and ordering steps. The build generates visible guide content and matching JSON-LD from the same records. It is tested for repeatable output.

Each service section identifies the service, describes its use, lists the information needed for a brief and links to the existing form. Each answer names the relevant business or subject and states qualifications in the answer itself. No arbitrary word-count target or keyword-variant pages are used. Anchors make sections independently linkable while preserving useful surrounding context.

Identity is shared through the stable `/#business` identifier and the `/#website` identifier. Service nodes reference the same provider. About provides the business fact sheet. The user confirmed `info@seskainvestments.com` for privacy requests; it is labelled as a privacy contact rather than an unconfirmed sales channel.

## Evidence limits

Service scope, listed hours, Nasser Road address and Uganda delivery statements are retained from the existing repository, not independently certified business records. The exact workshop pin, direct phone, social profile URLs, founding date, fixed prices, minimum quantities and guaranteed turnaround remain unverified and are not invented in schema. Visual concepts remain labelled illustrative. The brief form still does not transmit an order or artwork.

No review stars, AggregateRating, unsupported Product/Offer inventory, fabricated geographic coordinates, SearchAction for a nonexistent search feature, or news-only Speakable markup are added. FAQPage describes real FAQs; it is not a promise of Google FAQ rich results. Google retired that feature in May 2026. No claim is made that schema or answer formatting guarantees ranking, a voice answer, zero-click placement or an LLM citation.

## Release and measurement

This change builds on the consent integration in PR #2. Keep its IDs disabled until the account and privacy setup is complete. New routes join the existing sanitized GA path allowlist without enabling tracking.

Before launch, verify the domain/hosting relationship, HTTP 200 responses, HTTPS, canonical host redirects, social image rendering and any host-level crawler restrictions. Use `X-Robots-Tag: noindex` or access protection on preview hosts; do not publish an indexable duplicate preview. Run Google's Rich Results Test where supported and Schema.org Validator on the final HTML; local tests validate parsing and content consistency but do not substitute for those tools.

After launch, submit the sitemap in Search Console and Bing Webmaster Tools. Confirm ownership and business details in Google Business Profile and Bing Places. Retain the same name, address and relevant contact information across verified profiles; add `sameAs` only for confirmed profile URLs.

Record a baseline and compare equivalent periods after indexing: indexed URLs, query impressions/clicks, actual enquiries, and available AI citation reports. Track examples such as "Seska printing Kampala", artwork formats, delivery outside Kampala and quote requirements as hypotheses, not verified keyword-volume claims. Bing's AI Performance report can show cited pages and grounding queries; availability and permissions must be checked in the owner's account. Zero-click impressions alone do not demonstrate leads or business value.

## Validation

Local validation passed on 17 September 2026 in headless Microsoft Edge: all checks below, plus the existing consent regression suite. Desktop and mobile screenshots were inspected. Vendor requests in the consent tests were intercepted, and no real analytics receipt or public search appearance is claimed.

Run `node scripts/test-aeo.mjs` with Playwright available. It defaults to installed Microsoft Edge; set `PLAYWRIGHT_CHANNEL` or `PLAYWRIGHT_MODULE` as documented by the privacy test. Checks cover build idempotence, metadata uniqueness, canonical consistency, graph references, visible/schema parity, internal links, sitemap entries, page headings, mobile width, keyboard focus, mobile navigation, no-JavaScript content and third-party request blocking. Run `node privacy/test-consent.mjs` to verify consent regression behaviour.

## Primary references checked 17 September 2026

- [Google guidance for generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): useful original information, clear technical structure and regular SEO remain relevant; there is no special AI schema requirement or benefit guaranteed by content chunking or llms.txt.
- [Google search documentation updates](https://developers.google.com/search/updates): FAQ rich results retired in May 2026; documentation removed in June.
- [Schema.org Service](https://schema.org/Service), [LocalBusiness](https://schema.org/LocalBusiness) and [FAQPage](https://schema.org/FAQPage): semantic vocabulary used in the graph.
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a) and [AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c): crawl/content quality and citation measurement.
