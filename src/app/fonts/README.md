# Self-hosted fonts

These are the latin-subset WOFF2 files used by `next/font/local` in
`src/app/layout.tsx` and `src/app/sprout-baby-tracker/layout.tsx`.

They are committed on purpose: `next/font/google` downloads font CSS and files
from `fonts.googleapis.com` at build time, and Google intermittently returns
extensionless `/l/font?kit=...` URLs that break the build
(vercel/next.js#99114). Self-hosting removes that network dependency entirely.

All families are licensed under the SIL Open Font License 1.1.

| File | Family | Weights | Source |
| --- | --- | --- | --- |
| `fraunces-latin.woff2` | Fraunces | 400–600 | https://fonts.google.com/specimen/Fraunces |
| `schibsted-grotesk-latin.woff2` | Schibsted Grotesk | 400–600 | https://fonts.google.com/specimen/Schibsted+Grotesk |
| `ibm-plex-mono-400-latin.woff2` | IBM Plex Mono | 400 | https://fonts.google.com/specimen/IBM+Plex+Mono |
| `ibm-plex-mono-500-latin.woff2` | IBM Plex Mono | 500 | https://fonts.google.com/specimen/IBM+Plex+Mono |
| `playfair-display-latin.woff2` | Playfair Display | 400–900 | https://fonts.google.com/specimen/Playfair+Display |
| `plus-jakarta-sans-latin.woff2` | Plus Jakarta Sans | 200–800 | https://fonts.google.com/specimen/Plus+Jakarta+Sans |
