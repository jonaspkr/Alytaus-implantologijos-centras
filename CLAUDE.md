# Project: Alytaus Implantologijos Centras — Website

## Working with Samanta
- Samanta is a non-technical collaborator. Avoid asking her to change developer settings (e.g. Safari developer options).
- To refresh the browser, just re-open the file with `open -a Safari <file>` instead of using AppleScript.
- When Samanta reports an issue or is confused about something, **keep detailed notes** of what was changed, what the issue likely is, and what was done to fix it — so Jonas can be briefed properly later.

## Tech stack
- Static HTML/CSS website (no build tools)
- Files in `website/` directory
- Shared `styles.css` for all pages
- Navigation with mega dropdown under "Paslaugos" is duplicated across all 33+ HTML pages (two formats: pretty-printed and minified) — update all when changing nav.

## Hosting & Deployment
- **Host:** Hostinger shared hosting
- **Domain:** alytausortodontai.lt
- **FTP IP:** 46.17.175.227
- **Deploy path:** `/domains/alytausortodontai.lt/public_html/`
- **Credentials:** stored in `.ftp-credentials` (gitignored)
- **Deploy command:**
  ```bash
  # Ensure all files are world-readable before upload — scripted edits on
  # macOS sometimes write files with mode 600, which causes the web server
  # to return 403. lftp over plain FTP does not transmit Unix permissions,
  # and `mirror` skips re-upload when size+mtime match, so a server-side
  # 600 file will silently stay broken across deploys.
  chmod -R a+rX website/

  source .ftp-credentials
  lftp -u "$FTP_USER,$FTP_PASS" ftp://$FTP_HOST -e "
    set ftp:ssl-allow no;
    set mirror:parallel-transfer-count 5;
    mirror --reverse --verbose --delete \
      website/ /domains/alytausortodontai.lt/public_html/ \
      --exclude Dockerfile --exclude fly.toml --exclude nginx.conf \
      --exclude preview-A.html --exclude preview-B.html --exclude preview-C.html;
    quit"
  ```
- **Note:** Excludes Docker/Fly.io files and preview drafts from deployment.
- **If deploy resulted in 403s:** the local chmod won't fix files already
  on the server with mode 600. Fix them in place via lftp:
  ```bash
  source .ftp-credentials
  lftp -u "$FTP_USER,$FTP_PASS" ftp://$FTP_HOST -e "
    set ftp:ssl-allow no;
    cd /domains/alytausortodontai.lt/public_html/;
    chmod 644 <each-affected-file>;
    quit"
  ```
  (lftp's `chmod` does not accept globs — list each file individually.)
