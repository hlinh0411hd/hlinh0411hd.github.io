# Rikerat Studio — Official Website

A responsive, English-language static website for Rikerat Studio. Built with plain HTML, CSS and JavaScript — **no build process required**.

## Pages

- `index.html` — Home
- `games/index.html` — Games directory
- `games/tenvader.html` — Tenvader + two YouTube videos
- `games/a-cats-little-pond.html` — A Cat's Little Pond + YouTube trailer
- `about.html` — Studio and solo-developer story
- `press.html` — Press kit, downloadable logos and videos
- `contact.html` — Partnerships and contact information

## Preview locally

Open `index.html` in a browser. For a local HTTP server (recommended), run `python -m http.server 8000` in this folder, then open `http://localhost:8000`.

## Deploy to Cloudflare Pages

1. Extract this ZIP.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Upload assets.
3. Upload the **contents** of `rikerat-website` (or the whole folder if accepted).
4. Deploy. The site will receive a `*.pages.dev` URL.
5. Add a custom domain later in the Pages project settings.

Alternative: push the folder to a GitHub repository and connect it to Cloudflare Pages. Use `None` as the framework preset, leave build command blank, and use `/` as the output directory.

## Before publishing

- Add your real studio email to `contact.html` (no address has been invented).
- Replace the Tenvader Steam **search** URL with its exact store URL when available.
- Add genuine screenshots if desired. Current game card imagery uses YouTube thumbnail URLs.
- Optionally add a canonical URL and social preview image after your domain is chosen.
- The Google Fonts CSS is loaded online; fallback system fonts are provided.

## Video links

- Tenvader: https://youtu.be/DMMhH1SKcCw
- Tenvader: https://youtu.be/UneA2We_pjo
- A Cat's Little Pond: https://youtu.be/fL34fuJbZ_8

## Branding

`assets/favicon.png` and `assets/rikerat-logo.png` are the user-provided Rikerat logos.

## Official contact links
- Email: hlinh0411hd@gmail.com
- Facebook: https://www.facebook.com/rikerat2401
- Discord: https://discord.gg/CGaNUMNWQm
