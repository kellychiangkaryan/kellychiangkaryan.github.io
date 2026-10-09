# Kelly Chiang: Portfolio Site

A static portfolio (plain HTML/CSS/JS, no build step). Works on GitHub Pages.

## Structure

```
index.html                    Home
projects.html                 Project grid with Design / Programming / Production filter
about.html                    About, skills, background
project-unreal-level.html     Case study template (level design)
project-the-unraveling.html   Case study template (audio + production) with interactive audio demo
css/style.css                 All styling (colours are variables at the top)
js/main.js                    Menu, project filter
js/audio-demo.js              Web Audio demo (low-pass filter + crossfade)
images/                       Put your screenshots here (create this folder)
resume.pdf                    Add your resume PDF with this exact name
```

## Fill in the placeholders

Search all files for `[` to find every placeholder in square brackets. Replace:
1. Unreal level name, role, duration, and your real playtest numbers (only real ones)
2. Screenshots: save into `images/`, then replace the grey `[Add ...]` boxes with
   `<img src="images/your-file.jpg" alt="Describe the image">`
3. Videos: upload to YouTube/Vimeo (unlisted is fine), then use
   `<iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>` inside the `.media.video` box
4. About page: add a photo (`images/kelly.jpg`) and a few lines about you
5. Save your resume as `resume.pdf` in this folder

## Preview locally

Open `index.html` in your browser. For the most accurate preview, run in this folder:

```
python3 -m http.server 8000
```
then visit http://localhost:8000

## Publish on GitHub Pages (free)

1. Create a GitHub account if you don't have one. Pick your username carefully; it becomes your URL.
2. Create a **public** repository named exactly `YOUR-USERNAME.github.io`.
3. Upload all the files in this folder (the contents, not the folder itself). Either:
   - On github.com: **Add file > Upload files**, drag everything in, commit, or
   - With Git:
     ```
     git init
     git add .
     git commit -m "Initial portfolio"
     git branch -M main
     git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
     git push -u origin main
     ```
4. In the repo go to **Settings > Pages**, set Source to **Deploy from a branch**, choose `main` and `/ (root)`, and save.
5. After a minute or two your site is live at `https://YOUR-USERNAME.github.io`.
6. Add that link to your resume next to LinkedIn.

## Tips

- Keep images under about 500 KB each (compress with squoosh.app). Don't commit large videos.
- Add a project: copy a card in `projects.html`, copy a case study page, and set `data-cats` to
  `design`, `programming`, `production` (space-separated for more than one).
- Change the look: edit the colour variables at the top of `css/style.css`.
- Lead with design projects when applying for design internships.
