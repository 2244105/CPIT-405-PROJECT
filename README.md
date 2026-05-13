# 🏕️ Kashta Tracker

A React web application that helps Saudi outdoor enthusiasts plan **Kashtas** (desert camping trips) by combining **real-time weather data** with **smart trip checklists** and **one-click WhatsApp coordination**.

> **King Abdulaziz University · Faculty of Computing and Information Technology · CPIT-405**
> Supervised by **Dr. Ahmed Al-Tayeb**

---

## 🎯 Problem & Solution

Organizing a Kashta is a beloved Saudi tradition, but coordination is regularly disrupted by sudden weather changes (high winds, dust storms) and disorganized task distribution among group members.

**Kashta Tracker** solves this by giving users:

- ✅ A **live weather dashboard** to verify location safety before leaving home
- ✅ **Pre-built checklists** for common scenarios (BBQ, Overnight Camp, Tea Setup)
- ✅ **One-click WhatsApp sharing** so the whole group sees the same plan
- ✅ A **night-mode UI** designed for low-glare visibility outdoors

---

## 👥 Team Members — Group 6

| Name | ID | Role |
|------|-----|------|
| Rami Jameel Aliele | 2244105 | State Management & Component Architecture / Frontend Developer |
| Azzam Alghamdi | 2237392 | Frontend Developer / API Integration Lead |
| Alwaleed Alhalafi | 2236603 | UI/UX Designer / QA Tester |

---

## ✨ Key Features

1. **🔐 User Authentication** — Email/password sign up & login via **Firebase Authentication**
2. **🛡️ Protected Routes** — Dashboard and Checklist pages require authentication
3. **🌤️ Weather Dashboard** — Real-time conditions from the **OpenWeatherMap API**, with a kashta safety verdict (Good / Caution / Danger)
4. **📋 Smart Checklists** — Three pre-built trip templates plus full custom item support
5. **📲 WhatsApp Sharing** — Generates a formatted shareable message containing the live weather report and the gear checklist
6. **🌙 Night Mode** — Toggle between warm daytime and dark night themes, persisted in localStorage
7. **♿ Accessibility** — Semantic HTML, ARIA attributes, keyboard navigation, focus-visible styles, alt text on every image

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Authentication**: Firebase Auth
- **External API**: OpenWeatherMap
- **State Management**: React Context + Hooks (`useState`, `useEffect`, `useContext`)
- **Styling**: Custom CSS with CSS Variables (no UI library — fully responsive, mobile-first)
- **Deployment**: GitHub Pages

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm
- A free **Firebase project** ([create one here](https://console.firebase.google.com))
- A free **OpenWeatherMap API key** ([get one here](https://openweathermap.org/api))

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/kashta-tracker.git
cd kashta-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:abcdef123456

VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key
```

### 4. Enable Firebase Email/Password auth

1. Open the [Firebase console](https://console.firebase.google.com)
2. Select your project → **Authentication** → **Sign-in method**
3. Enable **Email/Password**

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173/kashta-tracker/](http://localhost:5173/kashta-tracker/) in your browser.

### 6. Build for production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

---

## 🌐 Deployment (GitHub Pages)

1. In `package.json`, set the `homepage` field to your GitHub Pages URL:
   ```json
   "homepage": "https://YOUR_GITHUB_USERNAME.github.io/kashta-tracker"
   ```
2. In `vite.config.js`, set the `base` to `/kashta-tracker/` (already configured).
3. Push the project to GitHub.
4. Deploy:
   ```bash
   npm run deploy
   ```
5. In your repo settings → **Pages**, set the source to the `gh-pages` branch.

---

## 📁 Project Structure

```
kashta-tracker/
├── public/                       # Static assets
├── src/
│   ├── components/               # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── WeatherCard.jsx
│   │   └── ChecklistItem.jsx
│   ├── pages/                    # Route pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx         # Protected — weather lookup
│   │   ├── Checklist.jsx         # Protected — gear list + share
│   │   └── NotFound.jsx
│   ├── context/                  # Global state (Context API)
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── services/                 # External integrations
│   │   ├── firebase.js
│   │   └── weatherApi.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🗂️ Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Sign in |
| `/register` | Public | Create account |
| `/dashboard` | 🔒 Protected | Weather lookup |
| `/checklist` | 🔒 Protected | Gear list + WhatsApp share |

---

## 📸 Screenshots

> _Replace these with real screenshots after deployment._

| Home | Login | Dashboard | Checklist |
|------|-------|-----------|-----------|
| ![Home](docs/screenshots/home.png) | ![Login](docs/screenshots/login.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Checklist](docs/screenshots/checklist.png) |

---

## 🎓 Rubric Coverage

| # | Criterion | Where it's implemented |
|---|-----------|------------------------|
| 1 | **Semantic HTML** | `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>` throughout |
| 2 | **Responsive CSS** | `global.css` with mobile-first media queries, CSS variables |
| 3 | **Form validation** | `Login.jsx`, `Register.jsx` — client-side validation with field-level errors |
| 4 | **Mouse + keyboard events** | Theme toggle, checklist toggle (Enter/Space), quick-pick chips |
| 5 | **Reusable components** | `Navbar`, `WeatherCard`, `ChecklistItem`, `ProtectedRoute`, `Footer` |
| 6 | **Prop management** | `WeatherCard` receives `weather`; `ChecklistItem` receives `item`, `onToggle`, `onRemove` |
| 7 | **State management** | `useState` + `useEffect` everywhere; `AuthContext` and `ThemeContext` for global state |
| 8 | **Routing & navigation** | React Router v6 with public and protected routes |
| 9 | **API fetching** | `weatherApi.js` — OpenWeatherMap with full error handling |
| 10 | **Key features** | Auth, protected routes, weather dashboard, checklist, templates, WhatsApp share, night mode |
| 11 | **Deployment** | GitHub Pages — `npm run deploy` |
| 12 | **Documentation** | This README |
| 13 | **Accessibility** | ARIA labels, semantic tags, `alt` text, focus-visible styles, `prefers-reduced-motion` |

---

## 📄 License

MIT — Built for academic purposes at KAU.
