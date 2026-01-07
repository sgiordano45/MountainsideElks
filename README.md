# Mountainside Elks Lodge #1585 Website

Official website for Mountainside Elks Lodge #1585, serving Mountainside, NJ and Union County since 1958.

🌐 **Live Site:** [mountainsideelks.org](https://www.mountainsideelks.org) *(update when deployed)*

## Overview

A modern, fast, static website built to replace the legacy WordPress site. Hosted on GitHub Pages for zero ongoing hosting costs.

## Features

- **Responsive Design** — Mobile-first, works on all devices
- **Fast Loading** — Static HTML/CSS/JS, no WordPress bloat
- **Easy Updates** — Simple file structure, no CMS required
- **Modern UI** — Clean design with Elks navy/gold color scheme
- **Contact Forms** — Integrated with Formspree (or similar)
- **SEO Optimized** — Semantic HTML, meta descriptions, fast load times

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, virtues, events preview, hall rental CTA |
| About | `pages/about.html` | Mission, history, leadership, charitable programs |
| Events | `pages/events.html` | Recurring events, upcoming specials, photo gallery |
| Hall Rental | `pages/hall-rental.html` | Photos, amenities, pricing, inquiry form |
| Membership | `pages/membership.html` | Benefits, requirements, how to join, FAQ |
| Contact | `pages/contact.html` | Address, hours, map, contact form |

## Project Structure

```
mountainside-elks/
├── index.html              # Homepage
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── main.js             # Navigation & interactions
├── images/                 # Logo, photos, etc.
│   └── (add images here)
└── pages/
    ├── about.html
    ├── events.html
    ├── hall-rental.html
    ├── membership.html
    └── contact.html
```

## Setup

### GitHub Pages Deployment

1. Create a new repository on GitHub
2. Push this code to the repository
3. Go to Settings → Pages
4. Select "Deploy from a branch" → `main` → `/ (root)`
5. Your site will be live at `https://username.github.io/repo-name`

### Custom Domain (mountainsideelks.org)

1. In GitHub repo Settings → Pages → Custom domain, enter `www.mountainsideelks.org`
2. Create a `CNAME` file in root with content: `www.mountainsideelks.org`
3. Update DNS records at your domain registrar:
   - **A Records** (for apex domain):
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **CNAME Record** (for www):
     ```
     www → username.github.io
     ```

### Contact Form Setup (Formspree)

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Replace `YOUR_FORM_ID` in the form action URLs with your Formspree endpoint
4. Forms are in: `pages/hall-rental.html` and `pages/contact.html`

## Content Updates

### Adding Events
Edit `pages/events.html` — add new event cards in the "Upcoming Special Events" section.

### Updating Leadership
Edit `pages/about.html` — update officer names and photos in the Leadership section.

### Adding Photos
1. Add optimized images to the `images/` folder
2. Reference them in HTML: `<img src="images/your-image.jpg" alt="Description">`

### Bar Hours
Update in two places:
- `index.html` (homepage Visit Us section)
- `pages/contact.html` (Contact page)

## Images Needed

The following placeholder images should be replaced:

- [ ] `images/elks-logo.png` — Lodge logo
- [ ] `images/favicon.png` — Browser favicon
- [ ] `images/hall-1.jpg` through `hall-6.jpg` — Hall rental photos
- [ ] Officer photos for About page
- [ ] Event photos for Events page

**Image Tips:**
- Compress images before uploading (use [squoosh.app](https://squoosh.app))
- Use descriptive filenames and alt text for SEO
- Recommended sizes: Hero images 1920px wide, thumbnails 600px wide

## Future Enhancements

Potential Phase 2 additions (using Firebase):

- [ ] Events calendar with database backend
- [ ] Hall rental availability/booking system
- [ ] Member login portal
- [ ] Event RSVP functionality
- [ ] Admin interface for content updates

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Flexbox, Grid
- **JavaScript** — Vanilla JS, no frameworks
- **Fonts** — Google Fonts (Playfair Display, Source Sans 3)
- **Icons** — Inline SVG (Heroicons)
- **Forms** — Formspree
- **Hosting** — GitHub Pages
- **SSL** — Free via GitHub Pages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## License

© 2026 Mountainside Lodge of Elks #1585. All rights reserved.

---

**Elks Care — Elks Share** 🦌
