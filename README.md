# Adam Sarabia: personal site

A hand-built static site (plain HTML, CSS, and a little JavaScript) for programming projects, art, video, and music. It needs no build step and no frameworks, and it's hosted free on **GitHub Pages**.

## What's where

| File | Page |
|---|---|
| `index.html` | Home |
| `projects.html` | Programming projects |
| `blog.html` | Blog posts |
| `art.html` | Paintings and drawings galleries |
| `video.html` | YouTube videos and the logo animation |
| `music.html` | The album *Symptoms* (Spotify) |
| `404.html` | "Page not found" page |
| `assets/css/style.css` | All styling. Colors are at the top under `:root`. |
| `assets/js/site.js` | Mobile menu and the full-screen image viewer |
| `assets/img/` | Logo, art, and project images |

## Preview it on your computer

From this folder, run:

```powershell
python -m http.server 8080
```

Then open http://localhost:8080. Press Ctrl+C to stop it.

## Publish it on GitHub Pages (free)

**One-time setup**

1. Create a free account at https://github.com.
2. Create a new **public** repository named exactly `asarabiapersonal.github.io`, using your GitHub username. Leave "Add a README" unchecked.
3. In this folder, run these commands, putting your username in the last-but-one line:

   ```powershell
   git init -b main
   git add .
   git commit -m "First version of the site"
   git remote add origin https://github.com/asarabiapersonal/asarabiapersonal.github.io.git
   git push -u origin main
   ```

4. On GitHub, open the repository and go to **Settings → Pages**. Under "Build and deployment", set **Source** to *Deploy from a branch*, choose **main** and **/ (root)**, and click **Save**.
5. After a minute or two the site is live at `https://asarabiapersonal.github.io`.

**Publishing updates later**

```powershell
git add .
git commit -m "Describe what changed"
git push
```

### Optional: your own domain

Buy a domain such as `yourname.com` (about $10–15/year at Cloudflare, Porkbun, or Namecheap). Then go to **Settings → Pages → Custom domain** and follow GitHub's DNS instructions. HTTPS is free.

## Common edits

- **New blog post:** in `blog.html`, copy an `<article class="post">` block, paste it above the newest post, and change the `id`, date, title, and text. Then add a card for it in the "From the blog" section of `index.html`.
- **New project:** in `projects.html`, copy the whole `<article class="project">` block and edit it.
- **GitHub or demo links for the image classifier:** in `projects.html`, find `ADD LINKS`, uncomment the buttons, and paste in your URLs.
- **New artwork:** put the image in `assets/img/art/paintings/` or `.../drawings/`, then copy one `<a ...><img ...></a>` line in `art.html` and change the file name and the `alt` description. Keep images under about 1–2 MB; 1600 px on the long side is plenty.
- **New video:** in `video.html`, copy a video block and swap in the YouTube video ID (the part after `watch?v=`).
- **About text:** in `index.html`, look for `EDIT ME`.

## Live demos for Python projects

GitHub Pages only serves static files, so it can't run Python. To give a Streamlit app a live demo, deploy it free on [Streamlit Community Cloud](https://streamlit.io/cloud) or [Hugging Face Spaces](https://huggingface.co/spaces), then link to it from the project page.
