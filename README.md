# Waterdropping Log

Simple client-side app to record water dips and drops with a map, offline caching, and Excel export.

Files included
- `Waterdropping-Log.html` — main single-file app (HTML + JS).
- `sw.js` — optional service worker to cache the app shell and OSM tiles.

Quick deploy to GitHub Pages (from the folder containing these files):

```bash
# initialize and push (replace REPO_NAME)
cd ~/Desktop
git init
git checkout -b main
git add Waterdropping-Log.html sw.js README.md
git commit -m "Add waterdropping app and service worker"
gh repo create REPO_NAME --public --source=. --remote=origin --push
# enable Pages (publish from main branch root)
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
gh api --method PUT repos/$REPO/pages -f source='{"branch":"main","path":"/"}'
# open the Pages URL
gh api repos/$REPO/pages --jq .html_url | xargs open
```

Testing and notes
- Service workers require HTTPS or `localhost` for registration. GitHub Pages serves HTTPS, so `sw.js` will register when served from Pages.
- Test steps:
  - Open the Pages URL and confirm UI loads.
  - Log a `Dip` and a `Drop`. Refresh the page — entries persist via `localStorage`.
  - Move the browser offline (Network -> Offline) and reload pages/tiles you previously viewed — cached tiles should render.
  - Click `Download Excel`, enter a helicopter number (optional) — exported filename will include that and date in MMDDYYYY.
- If you want to test locally before pushing, run:

```bash
# from the same folder
python3 -m http.server 8000
# then open http://localhost:8000/Waterdropping-Log.html
```

Troubleshooting
- If the service worker does not register, open devtools -> Application -> Service Workers to inspect errors.
- GitHub Pages may take 1–2 minutes to publish after pushing.

If you want, I can also create the repo for you (I cannot push from here), or generate a ZIP with the files for upload.
