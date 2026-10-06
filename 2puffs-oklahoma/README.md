# 2Puffs Oklahoma — brand site

Static site (HTML/CSS/JS, no build step) for Netlify.

## Deploy (one time)
1. Netlify > Add new site > Import from GitHub > pick this repo.
2. **Base directory:** `2puffs-oklahoma` · **Build command:** blank · **Publish directory:** `2puffs-oklahoma` (netlify.toml sets `publish = "."` relative to base).
3. Branch: `main` (or whichever branch you merge into). Every push auto-deploys.
4. Domain: add your domain in Netlify > Domain management. `2puffsok.com` is a placeholder in `robots.txt`, `sitemap.xml`, `netlify.toml` and the footer email; find-and-replace it.
5. Forms: Netlify > Forms > enable form detection. `drop-alerts` and `wholesale` show up after the first deploy.

## Updating content (no code)
- **Strains:** `data/strains.json` (name, type, lineage, notes, thc from COA, swatch color, status).
- **Dispensaries:** `data/dispensaries.json`. While it's empty, the "Find" section shows a "landing soon" message.
- **OMMA license:** footer shows Banger Willis, LLC processor license PAAA-RAQC-XGCM (expires 01/16/2027). Renew/update before then.
- **Social:** footer links to instagram.com/2puffsok. Claim the handle or change it.

## Automation hooks
- Netlify Forms > Settings > notifications: email + Slack on `wholesale`.
- Zapier: "New Netlify form submission" > Google Sheet (lead log) + CRM.
- Drop alerts: route to a cannabis-compliant ESP/SMS (Alpine IQ, Springbig, Fyllo). Klaviyo and Mailchimp restrict THC marketing, so check their policies before using them.

## Compliance notes
- The age/patient gate stores consent in local or session storage for 30 days.
- The footer carries OMMA-style warnings. Have counsel confirm them against current OMMA advertising rules (OAC 442:10) before launch.
- No e-commerce. Nothing is sold or shipped through the site.
