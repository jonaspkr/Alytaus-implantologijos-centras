# Project: Alytaus Implantologijos Centras — Website

## Working with Samanta
- Samanta is a non-technical collaborator. Avoid asking her to change developer settings (e.g. Safari developer options).
- To refresh the browser, just re-open the file with `open -a Safari <file>` instead of using AppleScript.
- When Samanta reports an issue or is confused about something, **keep detailed notes** of what was changed, what the issue likely is, and what was done to fix it — so Jonas can be briefed properly later.

## Tech stack
- Static HTML/CSS website (no build tools)
- Files in `website/` directory
- Shared `styles.css` for all pages
- Navigation with mega dropdown under "Paslaugos" is duplicated across all 11 HTML pages — update all when changing nav.
