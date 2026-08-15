# WIHAR FC — wiharfc.hu

Static merch store for Wihar FC. One product (the official jersey), Hungarian only,
Stripe Payment Link checkout, no backend, no database, no monthly hosting fee.

---

## 1. Put it online (10 minutes, free)

Pick **one**:

**Cloudflare Pages (recommended — free, fast, free SSL)**
1. Go to `dash.cloudflare.com` → Workers & Pages → Create → Pages → *Upload assets*
2. Drag this whole folder in. Deploy.
3. Custom domains → add `wiharfc.hu` and `www.wiharfc.hu` → follow the DNS steps.

**Netlify**
1. `app.netlify.com` → *Add new site* → *Deploy manually* → drag this folder in.
2. Domain settings → Add custom domain → `wiharfc.hu`.

**Any normal web host / cPanel**
Upload the contents of this folder into `public_html/`. That's it — no build step,
no Node, no npm. It is plain HTML/CSS/JS.

---

## 2. How ordering works right now — Vinted

`ORDER_MODE: 'vinted'` in `js/app.js`. The **Megrendelem** button sends the customer to
`rendeles.html`, carrying their choice in the URL:

```
rendeles.html?meret=L&mod=custom&nev=CSONGI&szam=7&ar=13499&ref=WIHAR-L-CSONGI-7-K4P2
```

That page shows the order, a live picture of the shirt back with their name on it, a
copy-to-clipboard block, and a button to the Vinted profile. The customer pastes the
block into a Vinted message so you know exactly which shirt they want.

Change the Vinted link in `CONFIG.VINTED_URL`.

To switch to card payment later: set `ORDER_MODE: 'stripe'` and fill in `STRIPE_LINK`.
Nothing else changes — the Stripe code is still there.

## 2b. Wire up payment (Stripe) — for later

1. Stripe Dashboard → **Product catalog** → New → `Wihar FC hivatalos mez`, price `13499 HUF`.
2. **Payment links** → New → pick that product.
3. In the payment link settings turn ON:
   - *Collect customer addresses* → shipping address
   - *Collect phone numbers*
   - **Custom fields** → add three:
     - `Méret` — dropdown: XS, S, M, L, XL, 2XL
     - `Felirat a mez hátára` — text, optional
     - `Szám a mez hátára` — numeric, optional
   - *After payment* → Redirect → `https://wiharfc.hu/koszonjuk.html`
4. Copy the link (`https://buy.stripe.com/...`).
5. Open `js/app.js` and paste it into `STRIPE_LINK` at the top.

**Why the custom fields on Stripe's side too?**
The website already collects size/name/number and passes them to Stripe as the
`client_reference_id` (you see it on the payment in the dashboard, e.g.
`WIHAR-L-CSONGI-7-K4P2`). The Stripe custom fields are a second copy the customer
confirms themselves. Belt and braces — you never guess what someone ordered.

### Per-size links (optional but better)
If you want Stripe to track stock per size, make 6 payment links (one per size, each
with `inventory limit = N`) and fill in `STRIPE_LINK_BY_SIZE` instead of `STRIPE_LINK`.
Stripe then closes a size automatically when it sells out.

### Before Stripe is ready
Leave `STRIPE_LINK` empty. The order button opens a pre-filled email to
`info@wiharfc.hu` with size, name, number and an order code. The site works from
day one; you just take the money by transfer.

---

## 3. Everyday edits — all in `js/app.js`, top 60 lines

| What | Where |
|---|---|
| Price | `PRICE: 13499` |
| Stock counter shown on the page | `STOCK_LEFT: 20` |
| Mark it sold out | `SOLD_OUT: true` |
| Stripe link(s) | `STRIPE_LINK` / `STRIPE_LINK_BY_SIZE` |
| Email + Instagram | `EMAIL`, `INSTAGRAM` |
| Squad list (name + number) | `PLAYERS` |
| Sizes offered | `SIZES` |

Drop headline (`ÚJ DROP` / `ne késd le!`) is in `index.html`, in the `<section class="hero">` block.

---

## 4. Swapping images

Everything lives in `assets/`. Keep the **same filenames** and it just works.

| File | What it is |
|---|---|
| `hero.jpg` / `hero-sm.jpg` | Hero photo (rendered black & white by CSS) |
| `jersey-front.png` / `.webp` | Jersey front, transparent background |
| `jersey-back.png` / `.webp` | Jersey back, **blank** — the name/number are drawn live on top |
| `photo-1.jpg`, `photo-2.jpg` | Real product photos |
| `team.jpg` / `team-sm.jpg` | Footer "join the club" photo |
| `portrait.jpg` | Photo in the personalisation section |
| `meret.jpg` | Size chart image shown in the popup |
| `bolt.mp4` | Lightning loop behind the personalisation section |
| `logo.png`, `icon-*.png` | Crest / app icons |

⚠️ If you replace `jersey-back.png`, the live name and number will be in the wrong
place. They are positioned in `index.html` on the two `<text>` lines inside
`<svg class="print">` (and the small mobile copy just below). Values are in a
`0 0 1100 1213` coordinate system: name baseline `y=315`, number baseline `y=703`.

---

## 5. Before you take real money — legal (Hungary)

`aszf.html`, `adatkezeles.html` and `elallas.html` are **skeletons with
[SQUARE BRACKET] gaps**. Fill them in. You need:

- A real seller entity (egyéni vállalkozó / Bt. / Kft. / bejegyzett egyesület).
  You cannot legally sell repeatedly as a private individual.
- Tax number + address on the ÁSZF page.
- NAV Online Számla registration and invoices for every sale
  (`szamlazz.hu` or `billingo.hu` can automate this from Stripe).
- The hosting provider's name and address in the ÁSZF.

The site itself is already GDPR-clean: no analytics, no Facebook pixel, no cookies,
and the fonts are served from your own server — not Google's CDN. If you later add
analytics or a pixel, you must add a cookie banner and update `adatkezeles.html`.

---

## 6. What's inside

```
index.html          the whole store
koszonjuk.html      thank-you page (Stripe redirects here after payment)
aszf.html           terms — FILL IN
adatkezeles.html    privacy — FILL IN
elallas.html        returns — FILL IN
404.html
css/style.css       all styling
js/app.js           config + all behaviour (no frameworks, no dependencies)
assets/             images, video, self-hosted fonts
site.webmanifest, robots.txt, sitemap.xml
```

No build step. No npm install. Open `index.html` in a browser and it runs.
