# Klinik Medinura

A modern, responsive clinic website for Klinik Medinura, providing family-friendly healthcare information and services.

## 🌟 Features

- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark Mode** — Toggle between light and dark themes
- **Multi-language** — Support for English (EN) and Malay (BM)
- **Interactive Components**:
  - Hover-triggered health condition cards with care tips
  - Fever symptom checker quiz
  - Before/after vision comparison slider
  - Filterable doctor gallery
  - Multi-step appointment booking form
  - Testimonials carousel
  - Partner networks display
- **WhatsApp Integration** — Direct booking via WhatsApp
- **Smooth Animations** — Professional CSS transitions and hover effects
- **Theme Colors** — Maroon (#8B1E3F) primary theme for healthcare branding

## 📁 Project Structure

```
KlinikMedinura/
├── index.html           # Main website (entry point)
├── KlinikMedinura.css   # Styling and theme
├── KlinikMedinura.js    # Interactive functionality
├── vercel.json          # Vercel deployment config
├── README.md            # This file
└── assets/              # Images (logo.png, bg2.png, etc.)
```

## 🚀 Deployment

### Vercel (Live)
This site is deployed on Vercel. Any push to the GitHub `main` branch will auto-redeploy.

**Live URL:** https://klinikmedinura.vercel.app

### Local Testing
Simply open `index.html` in your browser.

## 📝 Configuration

### Theme
Theme preference is stored in browser `localStorage`:
- Light mode: default
- Dark mode: toggle icon in navbar

### Language
Language preference is stored in browser `localStorage`:
- English (EN): default
- Malay (BM): toggle button in navbar

### Contact
- Phone: 010-5120050
- Hours: 9am - 10pm daily
- Location: Kajang, Selangor

## 🎨 Customization

### Colors
Edit in `KlinikMedinura.css`:
```css
:root {
    --primary-color: #8B1E3F;      /* Maroon */
    --accent-color: #B3454B;       /* Accent */
}
```

### Content
Edit text in `index.html`. Multi-language text uses `data-en` and `data-ms` attributes.

### Images
Replace placeholders in `assets/`:
- `logo.png` — Clinic logo
- `bg2.png` — Hero background
- Doctor and treatment images

## 🛠️ Technologies

- **HTML5** — Semantic markup
- **CSS3** — Modern styling with CSS variables for theming
- **JavaScript (Vanilla)** — No frameworks, pure DOM manipulation
- **Bootstrap 5.3** — Responsive grid and components
- **Font Awesome 6.4** — Icon library

## 📞 Support

For issues or feature requests, contact the development team or check the GitHub repository.

---

**Built with ❤️ for Klinik Medinura**
