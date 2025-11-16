# SEO Metrics Dashboard & Measurement Plan
**Múza Hair E-Commerce | Performance Tracking & KPI Framework**

---

## ČÁST 1: DASHBOARD OVERVIEW

### Primary KPIs (Watch Daily)

```
┌─────────────────────────────────────────────────────────────┐
│ ORGANIC TRAFFIC DASHBOARD                                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Sessions This Week: _____ (↑↓ ___% vs. Last Week)           │
│  Users This Week: _____ (↑↓ ___% vs. Last Week)              │
│  Organic Conversions: _____ (Target: 0 → 5 by Week 4)        │
│  Organic Revenue: _____ CZK (Target: 0 → 100K by Week 6)     │
│  Avg. Session Duration: _____ min (Target: 2+ min)           │
│  Bounce Rate: ____% (Target: < 50%)                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SEO HEALTH DASHBOARD                                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Indexed Pages: _____ (Target: 50 → 250)                    │
│  Crawl Errors: _____ (Target: 0)                            │
│  Core Web Vitals: [ Green ] [ Yellow ] [ Red ]              │
│  Lighthouse Score: _____ (Target: 85 → 95)                  │
│  Top 10 Keywords: _____ (Target: 0 → 30)                    │
│  Top 50 Keywords: _____ (Target: 0 → 100)                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CONTENT & AUTHORITY DASHBOARD                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Blog Posts Published: _____ (Target: 0 → 20)                │
│  Avg. Blog Pageviews: _____ (Target: 10 → 200+)              │
│  Backlinks Acquired: _____ (Target: 0 → 75)                  │
│  Referring Domains: _____ (Target: 0 → 50)                   │
│  Social Media Followers: _____ (Target: 0 → 5,000)           │
│  Email Subscribers: _____ (Target: 0 → 2,000)                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ČÁST 2: DETAILED KPI DEFINITIONS & TARGETS

### A. Traffic KPIs

#### Metrika 1: Organic Sessions

**Definice:** Počet unikátních session ze search engines (Google, Bing, etc.)

**Kde sledovat:** Google Analytics 4 → Acquisition → Traffic source

**Formula:** Sessions = unique visits to site from organic

**Baseline:** 0 (before launch)
**Week 2 Target:** 50-100 sessions
**Week 4 Target:** 500-1,000 sessions
**Week 6 Target:** 1,500-2,500 sessions
**Week 10 Target:** 5,000-8,000 sessions
**Month 6 Target:** 15,000+ sessions/month

**Why it matters:** Primary indicator of SEO effectiveness. Growth = better search visibility.

**Actions if low:**
- Check GSC for crawl errors
- Verify content is indexed
- Check keyword rankings (may be too low)
- Increase content volume

**Actions if high:**
- Congratulations! Maintain momentum
- Analyze which content drives traffic
- Optimize underperforming pages

---

#### Metrika 2: Organic Users

**Definice:** Počet unikátních uživatelů přicházejících z organic search

**Kde sledovat:** GA4 → Acquisition → Traffic source

**Baseline:** 0
**Week 4 Target:** 300-500 users
**Week 6 Target:** 1,000-1,500 users
**Week 10 Target:** 4,000-6,000 users
**Month 6 Target:** 12,000+ users/month

**Importance:** Secondary to sessions. Tells you about repeat visitors.

**Repeat Visitor Rate (Key Insight):**
- Formula: Users ÷ Sessions
- Target: 20-30% repeat visitor rate
- Example: 1,000 sessions, 250 users = 25% repeat rate

---

#### Metrika 3: Avg. Session Duration

**Definice:** Průměrná doba na webu per session

**Kde sledovat:** GA4 → Engagement → Overview

**Baseline:** ~1 minute (current - placeholder pages)
**Week 2 Target:** 1.5 minutes
**Week 4 Target:** 2.5 minutes
**Week 6 Target:** 3.5+ minutes
**Month 6 Target:** 4+ minutes

**Why it matters:** Indicates content quality. Google uses dwell time as ranking signal.

**Actions if low (< 1.5 min):**
- Content not engaging enough
- Poor page layout
- Slow loading
- Fix: Improve readability, add visuals, optimize speed

**Actions if high (> 4 min):**
- Great content engagement!
- Users finding value
- Continue this type of content

---

#### Metrika 4: Bounce Rate

**Definice:** % sessions s jednou stránkou (bez další interakce)

**Kde sledovat:** GA4 → Engagement → Overview

**Baseline:** ~70% (before optimization)
**Week 4 Target:** 50-60%
**Week 6 Target:** 40-50%
**Month 6 Target:** 30-40%

**Why it matters:** High bounce = users not finding value. Low bounce = engagement.

**Bounce Rate by Page:**
- Homepage: Target < 40% (many exit points OK)
- Category pages: Target < 50% (product discovery)
- Blog posts: Target < 35% (content consumption)
- PDP: Target < 45% (product interest)

**Actions if high (> 60%):**
- Homepage: Add clearer CTAs, better product showcase
- Category: Improve filtering, add breadcrumbs
- Blog: Better headlines, visual breaks
- PDP: Faster loading, better product images

---

#### Metrika 5: Pages per Session

**Definice:** Průměrný počet stránek navštívených per session

**Kde sledovat:** GA4 → Engagement → Overview

**Baseline:** ~1.2 pages
**Week 2 Target:** 1.5 pages
**Week 4 Target:** 2.5 pages
**Week 6 Target:** 3+ pages
**Month 6 Target:** 3.5-4+ pages

**Why it matters:** Users exploring more pages = better engagement, higher conversion probability.

**How to improve:**
- [ ] Internal linking (2-5 per page)
- [ ] Related products (PDP bottom)
- [ ] Related blog articles (blog post bottom)
- [ ] Category recommendations (category page)
- [ ] "You may also like" widget (cart page)

---

### B. Conversion KPIs

#### Metrika 6: Organic Conversion Rate

**Definice:** % organic visitors who complete purchase

**Kde sledovat:** GA4 → Conversions → Purchase goal

**Formula:** Conversions ÷ Sessions × 100

**Baseline:** 0% (no conversions yet)
**Week 4 Target:** 0.2-0.5% (early purchases)
**Week 6 Target:** 0.5-1% (ramping up)
**Week 10 Target:** 1-1.5%
**Month 6 Target:** 1.5-2%+

**Why it matters:** Measures SEO ROI. Every 0.1% increase = significant revenue.

**Benchmark:**
- E-commerce average: 1-2%
- Premium/niche products: 2-5%
- Hair extensions: Target 2-3% (premium market)

**Actions if low (< 0.5%):**
- Check product pages (slow loading?)
- Check checkout flow (too complex?)
- Check pricing (competitive?)
- Analyze which products convert (optimize others)

**Actions if high (> 1.5%):**
- Excellent! Document what's working
- Scale content in high-converting topics
- Consider paid ads in similar areas

---

#### Metrika 7: Organic Revenue

**Definice:** Celkový obrat z organic search

**Kde sledovat:** GA4 → Conversions → Purchase goal + Revenue

**Formula:** Total purchase value from organic traffic

**Baseline:** 0 CZK
**Week 4 Target:** 10K-20K CZK
**Week 6 Target:** 50K-100K CZK
**Week 10 Target:** 150K-250K CZK
**Month 6 Target:** 500K-1M+ CZK

**Why it matters:** Ultimate ROI metric. Answers "Is SEO paying off?"

**Revenue per Session (RPS):**
- Formula: Total Revenue ÷ Sessions
- Week 4 Target: 200-500 CZK/session
- Week 6 Target: 100-250 CZK/session (cheaper bulk products)
- Month 6 Target: 150-300 CZK/session

**Actions if low:**
- Increase session volume (content/backlinks)
- Increase conversion rate (UX/pricing)
- Increase AOV (add-ons, bundles)

---

#### Metrika 8: Customer Acquisition Cost (CAC)

**Definice:** Cost to acquire 1 customer from organic

**Formula:** Total SEO costs ÷ Customers acquired

**Example:**
- Month 2 costs: $500 (tools)
- Month 2 customers from organic: 5
- CAC = $500 ÷ 5 = $100/customer

**Why it matters:** Is organic profitable vs. paid ads?

**Benchmark:**
- CAC via Paid Ads: 500-2000 CZK/customer (expensive)
- CAC via Organic: 100-500 CZK/customer (much cheaper, long-term)

---

### C. SEO Health KPIs

#### Metrika 9: Indexed Pages

**Definice:** Počet stránek indexovaných Google

**Kde sledovat:** Google Search Console → Coverage

**Baseline:** 5-10 (homepage + main pages)
**Week 2 Target:** 30-50
**Week 4 Target:** 100-150
**Week 6 Target:** 200-250
**Week 10 Target:** 300+
**Month 6 Target:** 500+

**Why it matters:** More indexed pages = more search visibility.

**Breakdown by type:**
- Product pages: Target 150-200 (one per unique variant)
- Blog posts: Target 50+ (one per article)
- Category pages: Target 10-15 (parent + subcategories)
- Static pages: Target 10-15 (homepage, about, FAQ, etc.)

**Actions if lower than target:**
- Check GSC Coverage tab (any errors?)
- Verify sitemap.xml is submitted
- Check robots.txt (are we blocking pages?)
- Request crawl of main pages (GSC)

---

#### Metrika 10: Crawl Errors

**Definice:** Počet chyb při crawlování webu Google botem

**Kde sledovat:** Google Search Console → Coverage → Errors

**Baseline:** 0-5 (might have some 404s)
**Target:** 0 (critical - fix immediately)

**Error Types:**
- 404 (Not Found): Fix by creating page or 301 redirect
- 503 (Service Unavailable): Check server status
- Timeout: Check site speed, increase server resources
- Blocked: Check robots.txt, allow bots

**Response Time:** Fix within 24 hours of error detection

**Escalation:**
1. Error found → Alert to dev team (same day)
2. Dev fixes → SEO verifies (24h)
3. Request recrawl in GSC
4. Monitor for recurrence

---

#### Metrika 11: Core Web Vitals

**Definice:** 3 Google metriky měřící page experience

**Kde sledovat:** Google Search Console → Enhancements → Core Web Vitals

**3 Metriky:**

1. **LCP (Largest Contentful Paint)**
   - What: Time until largest content element loads
   - Target: < 2.5 seconds (Green)
   - Bad: > 4 seconds (Red)
   - How to improve: Optimize images, minimize JavaScript, use CDN

2. **FID (First Input Delay)**
   - What: Time from user interaction to browser response
   - Target: < 100ms (Green)
   - Bad: > 300ms (Red)
   - How to improve: Minimize JavaScript, reduce main thread work

3. **CLS (Cumulative Layout Shift)**
   - What: Visual stability during page load
   - Target: < 0.1 (Green)
   - Bad: > 0.25 (Red)
   - How to improve: Reserve space for images, fonts, ads

**Where to check:** PageSpeed Insights (free tool by Google)

**Action if failing:**
1. Run PageSpeed Insights on main pages
2. Identify issue (image, JavaScript, layout)
3. Pass to dev team with priority
4. Re-test after fix
5. Monitor in GSC (weekly)

---

#### Metrika 12: Lighthouse Score

**Definice:** Overall page quality score (0-100)

**Kde sledovat:** Chrome DevTools → Lighthouse (or PageSpeed Insights)

**Components:**
- Performance: 30%
- Accessibility: 15%
- Best Practices: 15%
- SEO: 40%

**Targets by Phase:**
- Week 1: 75+ (starting point)
- Week 2: 80+
- Week 4: 85+
- Week 6: 90+
- Week 10: 95+

**Minimum per component:**
- Performance: 85+
- Accessibility: 90+
- Best Practices: 85+
- SEO: 100 (we control this)

**What to audit:**
- [ ] Main pages (10+)
- [ ] Top blog posts (5+)
- [ ] PDP samples (3+)
- [ ] Category pages (3+)

**Common issues & fixes:**
| Issue | Impact | Fix |
|-------|--------|-----|
| Unoptimized images | Performance | Use Next.js Image |
| JavaScript slow | Performance | Code splitting + lazy loading |
| Cumulative Layout Shift | Performance | Reserve space for images |
| Low contrast text | Accessibility | Darken text or lighten background |
| Missing alt text | SEO + Accessibility | Add descriptive alt to images |
| No meta description | SEO | Add to all pages |

---

### D. Keyword Ranking KPIs

#### Metrika 13: Top 10 Keyword Rankings

**Definice:** Počet target keywords na pozici 1-10 v Google

**Kde sledovat:** Semrush Rank Tracker (nebo Ahrefs, Moz)

**Targets:**
- Week 2: 0 (too early)
- Week 4: 2-5 keywords
- Week 6: 10-15 keywords
- Week 10: 30+ keywords
- Month 6: 50+ keywords

**Top target keywords (should rank early):**
1. "múza hair" (brand)
2. "vlasy k prodloužení" (main)
3. "panenské vlasy" (category)
4. "nebarvené vlasy" (sub-category)
5. "produkty jak koupit" (intent)
6. "jak dlouho vydrží" (FAQ)
7. "standard vs luxe" (comparison)
8. "prodloužené vlasy cena" (buyer)
9. "aplikace prodloužení" (how-to)
10. "česká vlasy" (brand/quality)

**Tracking process:**
1. Day 1: Add top 50 keywords to tracker
2. Weekly: Monitor rank changes
3. Identify:
   - Keywords moving up (double down on content)
   - Keywords stagnating (needs optimization)
   - Keywords ranking but not driving traffic (rewrite for clicks)

---

#### Metrika 14: Top 50 Keyword Rankings

**Definice:** Počet target keywords na pozici 1-50 v Google

**Targets:**
- Week 4: 10-20 keywords
- Week 6: 40-50 keywords
- Week 10: 100+ keywords
- Month 6: 150+ keywords

**Why broader range:** Builds momentum toward top 10. Position 11-50 still drives traffic (CTR ~10%).

**Optimization for position 11-50:**
- Rewrite title/description (improve CTR)
- Add more internal links (boost authority)
- Improve content (add depth, examples)
- Reduce bounce rate (more content links)

**Movement patterns:**
```
Healthy: Gradual climb over weeks
├─ Week 1: Position 45
├─ Week 2: Position 38
├─ Week 3: Position 32
├─ Week 4: Position 25
├─ Week 5: Position 18
└─ Week 6: Position 12

Unhealthy: No movement for 2+ weeks
├─ Week 1: Position 42
├─ Week 2: Position 40
├─ Week 3: Position 41
├─ Week 4: Position 42
└─ Week 5: Position 43 ← STAGNANT

Action: Rewrite content, add backlinks, improve UX
```

---

### E. Content & Authority KPIs

#### Metrika 15: Blog Posts Published

**Definice:** Počet publikovaných blog articles (cumulativní)

**Targets:**
- Week 2: 3 articles
- Week 4: 7 articles
- Week 6: 11 articles
- Week 10: 20+ articles
- Month 6: 50+ articles

**Content quality metrics (not just quantity):**
- Avg word count: 1500+ (vs. minimum 1000)
- Internal links: 5+ per article
- Bounce rate: < 40% on blog
- Avg time on page: 3+ minutes
- Conversion rate: 0.1-0.5% (lead/signup)

**Content audit (monthly):**
```
Article Title | Published | Pageviews | Bounce % | Time | Conversions |
Jak Vybrat    | Week 2    | 250      | 35%     | 4m   | 1
Péče o Vlasy  | Week 2    | 180      | 42%     | 3.5m | 0
Standard vs   | Week 2    | 150      | 48%     | 2.8m | 0
Jak Dlouho    | Week 3    | 120      | 55%     | 2.2m | 0

Insights:
- "Jak Vybrat" = best performer (strong intent?)
- "Jak Dlouho" = high bounce (low quality? confusing?)
- Action: Rewrite "Jak Dlouho" with better structure
```

---

#### Metrika 16: Blog Pageviews

**Definice:** Počet návštěv blog articles (sum of all)

**Targets:**
- Week 2: 50-100 pageviews (minimal)
- Week 4: 400-600 pageviews
- Week 6: 1500-2500 pageviews
- Week 10: 5000-8000 pageviews
- Month 6: 15,000+ pageviews/month

**Pageviews per article (mature):**
- High performer: 50-200 views/week
- Medium performer: 20-50 views/week
- Low performer: 5-20 views/week
- Underperformer: < 5 views/week (rewrite or delete)

**Actions if low:**
- Check keyword rankings (too low in rankings?)
- Check blog SEO (is it optimized?)
- Check content quality (engaging enough?)
- Increase promotion (email, social)

---

#### Metrika 17: Backlinks Acquired

**Definice:** Počet nových doménám odkazujících na náš web

**Targets:**
- Week 4: 5-10 backlinks
- Week 6: 20-30 backlinks
- Week 10: 50-75 backlinks
- Month 6: 100+ backlinks

**Quality metrics:**
- Domain Authority: Target 30+ (ahrefs)
- Relevance: Hair/beauty/Czech sites preferred
- Anchor text: Diverse (natural mix of brand + keywords)
- Spam score: < 10% (avoid bad neighborhoods)

**Backlink audit (monthly):**
```
Source | Domain | Authority | Anchor Text | Relevance | Status
beautygirl.cz | 45 | "vlasy k prodloužení" | High | ✓ Keep
blog.cz | 15 | "muza hair" | Low | ✗ Disavow
spamsite.ru | 5 | "buy hair cheap" | SPAM | ✗ Disavow
```

**Disavow process (if spam found):**
1. Identify bad backlinks
2. Attempt to contact & remove (email)
3. If no response → Disavow in GSC
4. Re-scan (GSC takes 2-4 weeks to reprocess)

---

#### Metrika 18: Referring Domains

**Definice:** Počet unikátních domén s backlinky na nás

**Targets:**
- Week 4: 3-5 domains
- Week 6: 15-20 domains
- Week 10: 40-50 domains
- Month 6: 75+ domains

**Why separate from backlinks:**
- 10 backlinks from 1 site = 1 referring domain (less powerful)
- 10 backlinks from 10 sites = 10 referring domains (more powerful)

**Target: More domains than backlinks** (diverse sources)

---

### F. Brand & Awareness KPIs

#### Metrika 19: Brand Search Volume

**Definice:** Počet searches pro "múza hair" / "muzaready" keywords

**Targets:**
- Week 2: 10-20 searches/month
- Week 4: 30-50 searches/month
- Week 6: 100+ searches/month
- Week 10: 200+ searches/month
- Month 6: 500+ searches/month

**Where to check:** GSC → Queries (filter for brand keywords)

**Why it matters:** Brand searches = awareness + authority

**Actions to increase:**
- Mention in articles (by-line: "Múza Hair")
- Press coverage (target 1-2 press releases/month)
- Social media (post 3x/week)
- Email signature + footer links
- Influencer collaborations (natural mentions)

---

#### Metrika 20: Social Media Followers

**Definice:** Kombinovaný počet followers (Instagram + Facebook)

**Targets:**
- Week 4: 100-200 followers
- Week 6: 500-1000 followers
- Week 10: 2000-3000 followers
- Month 6: 5000+ followers

**Content strategy:**
- Instagram: 3-4 posts/week (visual, story-driven)
- Facebook: 2-3 posts/week (blog teasers, announcements)
- Share strategy: Repurpose blog content → graphics
- Engagement: Respond to comments within 24h

**Metrics to track:**
- Follower growth rate: Target 10-20% month
- Engagement rate: Target 3-5%
- Click-through rate: Target 0.5-2% to site

---

#### Metrika 21: Email Subscribers

**Definice:** Počet subscribers na email list

**Targets:**
- Week 4: 50-100 subscribers
- Week 6: 200-300 subscribers
- Week 10: 1000-1500 subscribers
- Month 6: 2000+ subscribers

**Email strategy:**
- Newsletter: 1-2x/week (new articles + product highlights)
- Welcome series: 5 emails over 14 days (onboarding)
- Abandoned cart: 2-3 emails per abandoned cart
- Post-purchase: 3 emails (care tips, reviews, re-purchase)

**Metrics:**
- Open rate: Target 25%+ (vs. 15% industry average)
- Click rate: Target 3%+ (vs. 2.5% industry average)
- Unsubscribe rate: Target < 0.5%

---

## ČÁST 3: WEEKLY REPORTING TEMPLATE

### Daily Standup (5 min check)

```
DATE: Nov 16, 2025

ORGANIC TRAFFIC (Yesterday):
Sessions: 5 (Week: 35)
Users: 3 (Week: 28)
Conversions: 0 (Week: 0)
Revenue: 0 CZK (Week: 0)

CONTENT:
Articles published: 0 (Week: 1)
Blog pageviews: 12 (Week: 75)

SEO HEALTH:
Crawl errors: 0
Indexed pages: 10
Lighthouse score: 82

ISSUES:
- None

NEXT:
- Publish Article #2 tomorrow at 10:00
```

---

### Weekly Report (Friday, 2-3 hours compile time)

```markdown
# Weekly SEO Report
**Week of:** Nov 16-22, 2025

## Executive Summary
Organic traffic ramping up slowly (expected at this stage). Content publishing on schedule.
No major technical issues. Ready for Priority 2 implementation.

## Traffic Metrics

| Metric | This Week | Last Week | Change | Target |
|--------|-----------|-----------|--------|--------|
| Sessions | 35 | N/A | N/A | 50-100 |
| Users | 28 | N/A | N/A | 40-75 |
| Bounce Rate | 68% | N/A | N/A | < 60% |
| Pages/Session | 1.3 | N/A | N/A | 1.5+ |
| Avg Duration | 1.5m | N/A | N/A | 2+ min |

## Content Performance

| Article | Views | Bounce % | Time | Conversions |
|---------|-------|----------|------|-------------|
| Jak Vybrat Délku | 15 | 40% | 3.5m | 0 |
| Péče o Vlasy | 8 | 50% | 2.8m | 0 |
| Standard vs LUXE | 4 | 60% | 1.5m | 0 |

**Insights:** "Jak Vybrat" getting most engagement (good title + content quality)

## SEO Health

| Metric | Status | Notes |
|--------|--------|-------|
| Indexed Pages | 10 | Only homepage + 3 blog posts so far |
| Crawl Errors | 0 ✓ | All good |
| Core Web Vitals | Green ✓ | Strong performance |
| Lighthouse Score | 82 | Target 85 by Week 2 |

## Backlinks

| Source | Authority | Status |
|--------|-----------|--------|
| (None yet) | - | - |

**Actions:** Begin outreach week 4 (after Pillar Page publication)

## Blockers

- GSC verification: Complete ✓
- GA4 setup: Complete ✓
- Content pipeline: On schedule

## Next Week

- [ ] Publish Articles #2 & #3
- [ ] Publish FAQ page
- [ ] Begin Article #4 draft
- [ ] Monitor for any GSC errors (daily)
- [ ] Lighthouse audit (target 85+)

## KPI Status

| KPI | Target | Actual | Status |
|-----|--------|--------|--------|
| Sessions (Week 2) | 50-100 | 35 | ⚠️ Track |
| Indexed (Week 2) | 30-50 | 10 | ⚠️ Behind |
| Blog posts | 3 | 3 | ✓ On track |

**Next Review:** Nov 23, 2025
```

---

### Monthly Report (End of Month - 4-5 hours compile time)

```markdown
# Monthly SEO Report
**Month:** November 2025

## Executive Summary
Month 1 focus: Foundation setup and initial content publishing. Organic traffic ramping as expected.
All technical foundations in place. Ready to scale content in Month 2.

## Traffic Overview

| Metric | Actual | Target | Status |
|--------|--------|--------|--------|
| Total Sessions | 250 | 500-1000 | ⚠️ Building |
| Total Users | 200 | 400-750 | ⚠️ Building |
| Avg Bounce Rate | 62% | < 50% | ✓ Acceptable |
| Avg Pages/Session | 1.5 | 2.5+ | ⚠️ Improving |
| Conversions | 0 | 2-5 | ⚠️ Too early |
| Organic Revenue | 0 CZK | 10K-50K | ⚠️ Too early |

**Analysis:** On track for early-stage metrics. Expect acceleration in Month 2 with Pillar Page.

## Content Published

| # | Title | Date | Views | Bounce % | Conversions |
|---|-------|------|-------|----------|-------------|
| 1 | Jak Vybrat Délku | Nov 10 | 45 | 38% | 0 |
| 2 | Péče o Vlasy | Nov 11 | 28 | 44% | 0 |
| 3 | Standard vs LUXE | Nov 13 | 18 | 52% | 0 |
| 4 | FAQ Page | Nov 15 | 12 | 65% | 0 |

**Top Performer:** Article #1 (best engagement, lowest bounce)
**Underperformer:** FAQ (high bounce, needs restructuring)

**Action:** Rewrite FAQ with better structure (Q&A format, table of contents)

## Technical SEO

| Check | Result | Status |
|-------|--------|--------|
| Indexed Pages | 15 | ✓ Growing |
| Crawl Errors | 0 | ✓ Good |
| Core Web Vitals | All Green | ✓ Excellent |
| Lighthouse | 84 | ⚠️ Target 85 |
| Duplicate Content | 0 | ✓ Clean |

**Lighthouse breakdown:**
- Performance: 82 (target: 90)
- Accessibility: 95 (target: 90) ✓
- Best Practices: 88 (target: 85) ✓
- SEO: 100 (target: 100) ✓

**Action:** Optimize images for performance (currently largest issue)

## Backlinks

| Status | Count |
|--------|-------|
| Backlinks Acquired | 0 |
| Referring Domains | 0 |
| Outreach Sent | 0 |

**Note:** Outreach planned for Week 4 (after Pillar Page)

## Keyword Rankings

| Rank Range | Count | Target | Status |
|-----------|-------|--------|--------|
| Top 3 | 0 | 0 | ✓ Expected |
| Top 10 | 0 | 0 | ✓ Expected |
| Top 50 | 2 | 10-20 | ⚠️ Building |
| Unranked | ~300 | < 100 | ⚠️ Expected |

**Early Rankings:**
- "panenské vlasy" = Position 48
- "péče prodloužené vlasy" = Position 35

**Analysis:** Normal for month 1. Articles too new to rank well yet (2-4 week delay typical).

## Email & Social

| Channel | Subscribers | Growth | Target |
|---------|-------------|--------|--------|
| Email | 28 | +28 | 50-100 |
| Instagram | 0 | N/A | 100-200 |
| Facebook | 0 | N/A | 100-200 |

**Action:** Setup social accounts (not prioritized in Month 1)

## Recommendations for Month 2

1. **Content:** Increase to 2 articles/week (4-5 total in Month 2)
2. **Technical:** Optimize images for Lighthouse 90+
3. **Backlinks:** Begin outreach to 10-15 Czech beauty sites
4. **Social:** Setup Instagram + Facebook, cross-promote blog
5. **Email:** Build list to 500+ via popup + call-to-action

## Budget Spent (Month 1)

| Item | Cost |
|------|------|
| Semrush | $120 |
| Hotjar | $0 (waiting to activate) |
| Tools | $50 (Canva, Grammarly) |
| **Total** | **$170** |

**ROI:** $0 CZK revenue (expected - too early)

## Forecast for Month 2

```
Traffic Growth:
- Sessions: 250 → 800 (+220%)
- Users: 200 → 600 (+200%)

Content:
- Articles: 3 → 8
- Indexed pages: 15 → 50

Authority:
- Backlinks: 0 → 10-15
- Referring domains: 0 → 5-8

Conversions:
- Expected: 1-3 orders from organic
- Expected revenue: 10K-30K CZK
```

## Approval & Sign-off

SEO Specialist: _________________ Date: _________
Product Owner: _________________ Date: _________
```

---

## ČÁST 4: MONTHLY KPI TRACKING SHEET

Vytvořit jednoduchou tabulku pro sledování měsíců:

```
MÚZA HAIR - 6 MONTH SEO TRACKING

┌──────────┬────────┬────────┬────────┬────────┬────────┬────────┐
│ Metrika  │ Měsíc1 │ Měsíc2 │ Měsíc3 │ Měsíc4 │ Měsíc5 │ Měsíc6 │
├──────────┼────────┼────────┼────────┼────────┼────────┼────────┤
│ Sessions │ 250    │ 800    │ 3,000  │ 6,000  │ 12,000 │ 18,000 │
│ Users    │ 200    │ 600    │ 2,500  │ 5,000  │ 10,000 │ 15,000 │
│ Conv.    │ 0      │ 2      │ 30     │ 60     │ 100    │ 150    │
│ Revenue  │ 0      │ 20K    │ 300K   │ 600K   │ 1,000K │ 1,500K │
│ Top 10   │ 0      │ 2      │ 10     │ 20     │ 40     │ 60     │
│ Blog Post│ 3      │ 8      │ 15     │ 25     │ 40     │ 50     │
│ Backlink │ 0      │ 5      │ 25     │ 50     │ 75     │ 100    │
│ LH Score │ 84     │ 87     │ 90     │ 92     │ 94     │ 95     │
└──────────┴────────┴────────┴────────┴────────┴────────┴────────┘
```

---

## ČÁST 5: RED FLAGS & ESCALATION PROCESS

### Critical Issues (Escalate Immediately)

```
RED FLAG #1: Sudden Traffic Drop
├─ If sessions drop > 30% in one day:
│  1. Check GSC for crawl errors (might be blocking)
│  2. Check site status (server down?)
│  3. Check for Google penalty (unnatural links?)
│  4. Check for manual action (GSC notifications)
│  5. If found: Contact Google support or fix issue
│
└─ Timeline: Fix within 24 hours

RED FLAG #2: Crawl Errors Spike
├─ If new crawl errors appear:
│  1. Check what changed (latest deploy?)
│  2. Are pages blocked in robots.txt?
│  3. Are URLs returning 404/503?
│  4. Fix root cause (revert deploy? Check server?)
│
└─ Timeline: Fix within 6 hours

RED FLAG #3: Core Web Vitals Fail
├─ If any metric turns Red:
│  1. Run PageSpeed Insights
│  2. Identify culprit (image? JavaScript? Layout shift?)
│  3. Pass to dev team with priority
│  4. Track in issue tracker
│  5. Re-test after fix
│
└─ Timeline: Fix within 48 hours

RED FLAG #4: Rankings Drop (Top 10)
├─ If a top-10 keyword drops 5+ positions:
│  1. Check if page quality changed
│  2. Check if competitors improved
│  3. Check if search intent shifted
│  4. Update content (freshen, add depth)
│  5. Monitor for 2 weeks
│  6. If persists: Consider new strategy
│
└─ Timeline: Investigate within 3 days
```

### Escalation Chart

```
ISSUE          │ DETECT         │ OWNER      │ ESCALATE TO      │ TIMELINE
───────────────┼────────────────┼────────────┼──────────────────┼──────────
Server Error   │ Lighthouse     │ SEO → Dev  │ DevOps           │ 30 min
Page 404       │ GSC            │ SEO → Dev  │ Dev               │ 6 hours
Crawl Error    │ GSC Alert      │ SEO → Dev  │ Dev               │ 6 hours
Core Web Vitals│ PageSpeed      │ SEO → Dev  │ Dev               │ 24 hours
Rank Drop      │ Rank Tracker   │ SEO        │ Product Owner     │ 48 hours
Traffic Drop   │ GA4            │ SEO        │ Product Owner     │ 2 hours
Manual Action  │ GSC            │ SEO        │ Product Owner     │ 1 hour
```

---

## ČÁST 6: QUARTERLY BUSINESS REVIEW (QBR)

### Q1 Review Template (After Month 3)

```markdown
# Q1 SEO Business Review
**Muzaready Hair | January-March 2026**

## Performance vs. Plan

| Goal | Plan | Actual | Achievement |
|------|------|--------|-------------|
| Organic Sessions | 5,000 | 3,200 | 64% ⚠️ |
| Organic Revenue | 500K CZK | 320K CZK | 64% ⚠️ |
| Blog Posts | 15 | 15 | 100% ✓ |
| Backlinks | 30 | 28 | 93% ✓ |
| Top 10 Rankings | 15 | 10 | 67% ⚠️ |

## Highlights

1. **Content Wins:**
   - Article on "Jak Vybrat Délku" = 500+ views (4x expected)
   - Pillar page "Průvodce" getting 50+ monthly views
   - Newsletter growing to 800+ subscribers

2. **Technical Wins:**
   - Lighthouse score 90+ on all main pages
   - Core Web Vitals green across board
   - 0 crawl errors in production

3. **Authority Wins:**
   - 28 backlinks from 18 referring domains
   - 5 guest posts placed (Czech beauty sites)
   - 2,000+ social followers

## Misses & Learnings

1. **Traffic underperformance (64% vs. 100%)**
   - Root cause: Slower keyword ranking than expected
   - Learning: Niche market = longer ranking timeline
   - Fix: Increase backlink focus in Q2

2. **Ranking underperformance (67% vs. 100%)**
   - Root cause: Competition heating up
   - Learning: Competitors are optimizing too
   - Fix: More aggressive content strategy (3+ articles/week)

## Budget Utilization

| Budget | Planned | Spent | Notes |
|--------|---------|-------|-------|
| Tools | $500 | $450 | Good cost control |
| Content | $3,000 | $3,200 | Slight overage |
| Outreach | $500 | $600 | More pitches than planned |
| **Total** | **$4,000** | **$4,250** | 6% over |

## ROI Calculation

```
Revenue from organic: 320K CZK
Cost of SEO: 4,250 CZK
ROI: (320,000 / 4,250) = 75.3x

Payback period: 2 days (EXCELLENT)
```

## Q2 Strategy Adjustments

1. **Content:** Increase to 3-4 articles/week (up from 2-3)
2. **Backlinks:** Focus on high-authority (DA 40+) sites
3. **Video:** Produce 1 video/week (new format)
4. **Local:** Expand to city-specific landing pages (Prague, Brno)

## Approval & Sign-off

CEO/Founder: _________________ Date: _________
SEO Specialist: _________________ Date: _________
```

---

## CZĘŚĆ 7: DASHBOARD TOOLS RECOMMENDATIONS

### Free Tools (Recommended for Budget)

```
Google Search Console (Free)
├─ What: See how Google sees your site
├─ Use: Monitor crawl errors, indexed pages, rankings
└─ Time to setup: 15 minutes

Google Analytics 4 (Free)
├─ What: Track all visitor metrics
├─ Use: Sessions, users, conversions, revenue
└─ Time to setup: 30 minutes

PageSpeed Insights (Free)
├─ What: Check Core Web Vitals
├─ Use: LCP, FID, CLS assessment
└─ Time to setup: 5 minutes

Chrome Lighthouse (Free)
├─ What: Comprehensive SEO audit
├─ Use: Performance, accessibility, SEO scores
└─ Time to setup: Built-in, 0 minutes

Screaming Frog (Free version)
├─ What: Crawl your own website
├─ Use: Find broken links, duplicates, missing meta
└─ Time to setup: 10 minutes
```

### Paid Tools (Worth Investment)

```
Semrush ($120/month)
├─ Best for: Keyword research + rank tracking
├─ Why: Czech language support, competitor analysis
└─ Alternative: Ahrefs ($99) or Moz ($99)

Hotjar ($39+/month)
├─ Best for: User behavior, heatmaps, session recordings
├─ Why: See exactly how users interact with pages
└─ Alternative: Microsoft Clarity (free) or Lucky Orange

Grammarly ($12/month)
├─ Best for: Czech content proofreading
├─ Why: Catches grammar, spelling, style issues
└─ Alternative: Hemingway Editor (free)

Canva Pro ($10/month)
├─ Best for: Create graphics (OG images, social)
├─ Why: Drag-and-drop, templates, easy to use
└─ Alternative: Adobe Express (free)
```

---

**Dashboard Version:** 1.0
**Last Updated:** Nov 16, 2025
**Status:** ✅ Ready for Implementation
