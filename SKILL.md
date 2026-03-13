# Portfolio Deployment Workflow
## VS Code → GitHub → Cloudflare Pages

---

## 1. One-Time Setup

### 1.1 VS Code Extensions
Install these extensions before starting:
- **Live Server** (`ritwickdey.liveserver`) — preview site locally without a build step
- **GitLens** (optional) — enhanced Git history view

### 1.2 Create GitHub Repository
1. Go to [github.com](https://github.com) → **New repository**
2. Name: `nguyenvuquochung-portfolio` (match folder name to avoid confusion)
3. Visibility: **Public** (required for free Cloudflare Pages)
4. Do **not** add README/gitignore (you already have files locally)

### 1.3 Initialize Git Locally
Open the VS Code terminal (`Ctrl+`` `) and run:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nguyenvuquochung-portfolio.git
git push -u origin main
```

A `.gitattributes` file with `* text=auto eol=lf` is already present — this ensures consistent Unix line endings across all platforms.

---

## 2. Cloudflare Pages — First Deploy

### 2.1 Connect Repository
1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Authorize GitHub and select the `nguyenvuquochung-portfolio` repository

### 2.2 Build Settings
This is a static site with no build step:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | *(leave empty)* |
| Build output directory | `/` |
| Root directory | *(leave empty)* |

Click **Save and Deploy**. Your site will be live at `https://nguyenvuquochung-portfolio.pages.dev` within ~30 seconds.

### 2.3 Custom Domain via Cloudflare DNS
1. In the Pages project → **Custom domains** → **Set up a custom domain**
2. Enter your domain (e.g. `nguyenvuquochung.com`)
3. Cloudflare will automatically add the DNS records (CNAME pointing to `nguyenvuquochung-portfolio.pages.dev`)
4. SSL certificate is provisioned automatically — no configuration needed

> **If your domain was registered outside Cloudflare:** Update the nameservers at your registrar to Cloudflare's nameservers first, then the DNS auto-setup will work.

---

## 3. Daily Workflow

Every time you update content or code:

```bash
# 1. Save your changes in VS Code
# 2. Stage, commit, and push
git add .
git commit -m "Update: describe what changed"
git push
```

Cloudflare Pages detects the push and redeploys automatically. Live in ~30 seconds.

---

## 4. Project Structure

```
nguyenvuquochung-portfolio/
├── index.html          ← HTML skeleton (7 virtual pages, all layout)
├── style.css           ← All CSS (variables, animations, page system)
├── js/
│   ├── content.js      ← Bilingual text data (const C = {en, vi})
│   ├── about.js        ← renderP2() — About Me page renderer
│   ├── contact.js      ← goToPage7 / goToPage1FromP7
│   ├── production.js   ← P3_PROJECTS array + render/nav (green)
│   ├── director.js     ← P4_PROJECTS array + render/nav (blue)
│   ├── assistant.js    ← P5_PROJECTS array + render/nav (red)
│   ├── editor.js       ← P6_PROJECTS array + render/nav (yellow)
│   └── main.js         ← Core engine: cursor, physics, transitions, nav, loader
├── .gitattributes      ← Enforce LF line endings
└── SKILL.md            ← This file
```

### Script Load Order
Scripts must load in this order (already set in `index.html`):
```
content.js → about.js → contact.js → production.js → director.js → assistant.js → editor.js → main.js
```
`main.js` is last because it calls functions defined in all other files.

---

## 5. Updating Content

### Change biography / quote / filmography
Edit `js/content.js` — the `C` object holds all bilingual text:
```js
const C = {
  en: { sub: "...", about: [...], films: [...], ... },
  vi: { sub: "...", about: [...], films: [...], ... }
};
```

### Add a project card to a role page
Edit the relevant `js/*.js` file. Example for a Director project (`js/director.js`):
```js
const P4_PROJECTS = [
  {
    id: 'my-new-film',
    title: 'Tên Phim',
    en: 'Film Title',
    year: '2025',
    desc: 'Short description of the project.',
    img: ''           // leave empty or add a URL
  },
  // ... existing entries
];
```

### Change accent colors
Edit `style.css`, `:root` block:
```css
:root {
  --green:  #00e676;   /* Production */
  --blue:   #1a6fff;   /* Director */
  --red:    #ff1a1a;   /* Assistant Director */
  --yellow: #ffe000;   /* Editor */
}
```

---

## 6. Cloudflare Content Loader (Optional)

`main.js` includes a GitHub-raw content loader. If you want to update content without redeploying, host a `content.json` on GitHub and configure these constants at the top of `main.js`:

```js
const GITHUB_OWNER  = 'your-username';
const GITHUB_REPO   = 'nguyenvuquochung-portfolio';
const GITHUB_BRANCH = 'main';
const GITHUB_PATH   = 'content.json';
```

When set, the site will fetch updated content on each load. Leave empty to disable.

---

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| Site shows old version | Hard refresh: `Ctrl+Shift+R`. Cloudflare cache purge: Pages → Caching → Purge cache |
| Custom domain not working | Check Cloudflare DNS has the CNAME record; wait up to 5 min for propagation |
| JS error `X is not defined` | Check script load order in `index.html`; `main.js` must be last |
| Portrait image resets on reload | Expected — portrait is stored in memory only. Use the GitHub content loader for persistence |
| Cloudflare injects email-decode script | Normal behavior; it wraps your `<script>` tag automatically for email obfuscation |
