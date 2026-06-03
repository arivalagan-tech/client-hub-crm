# 🚀 Client Hub CRM (SaaS)

A modern, high-fidelity SaaS-based Client Relationship Management (CRM) platform designed to streamline client interactions, sales workflows, meeting logs, and deal tracking through a highly responsive, pure HTML/CSS/Vanilla JavaScript front-end. 

Built with a modular architecture, responsive design principles, and browser-native APIs to create a scalable CRM application suitable for real-world workflows.

---

## 🌐 Live Demo & Repository
- **Live Demo**: [client-hub-crm-six.vercel.app/](https://client-hub-crm-wixy.vercel.app/)
- **GitHub Repository**: [arivalagan-tech/client-hub-crm](https://github.com/arivalagan-tech/client-hub-crm)
- **Tech Stack**: Pure HTML5, Vanilla CSS3 (Custom Variables), Native ES6 JavaScript, LocalStorage API.

---

## 📁 Refactored Project Structure

This project has been transformed into a production-grade, highly structured SaaS layout:

```text
client-hub-crm/
│
├── assets/
│   └── images/          # Professional brand, workflow, and user avatars
│
├── css/
│   ├── global.css       # Design tokens, variables, typography, resets, navbar & forms
│   ├── clients.css      # Dual-pane directory and detailed contact sheets
│   ├── popup.css        # Unified glassmorphic accessibility modal styling
│   └── responsive.css   # Mobile-first breakpoints (320px up to 1920px+)
│
├── data/
│   └── client.json      # Mock client schema for automatic database seeding
│
├── js/
│   ├── main.js          # index.html controller (validation & client onboarding)
│   ├── clients.js       # clients.html controller (search, listing, call scheduler)
│   ├── popup.js         # Accessible modular popup class (ESC close, overlay close, focus trapping)
│   ├── storage.js       # LocalStorage CRUD, key migration, and seeding engine
│   └── utils.js         # HTML sanitization (XSS protection) & time/date formatters
│
├── index.html           # New Client Onboarding Interface
├── clients.html         # Live CRM Dual-Pane Dashboard Sheet
└── README.md
```

---

## ✨ Production-Ready SaaS Features

### 👥 Dual-Pane Client Dashboard
- **Left Panel List Directory**: Fast reactive searching by name, tag category pills, and real-time status badges (Available, Busy, Inactive).
- **Right Panel Sheet**: Deep profile sheet showing overview data, contact particulars, communication language preferences, budget progress trackers, meeting history, and interaction schedulers.

### 🔐 Robust Storage Layer (`js/storage.js`)
- **Key Migration**: Automatically detects and migrates legacy `"myArray"` databases to a professional `"client_hub_crm_clients"` key safely, keeping user data intact.
- **Seeding Engine**: Proactively fetches `data/client.json` and seeds mock profiles upon initial startup so the dashboard immediately presents a filled ecosystem.

### 🛡️ Secure Utilities (`js/utils.js`)
- **XSS Protection**: Uses native HTML character encoders to safely render user strings, preventing code injection attacks.
- **AM/PM Time Conversions**: Polished 24-hour inputs into user-friendly AM/PM timestamps.

### ♿ Unified Accessible Popups (`js/popup.js` & `css/popup.css`)
- **Escape Close Key**: Closes open popups instantly when user presses the `ESC` key.
- **Backdrop Overlay Click Close**: Closes dialogs seamlessly when clicking outside modal contents.
- **Focus Trapping**: Keeps keyboard focus trapped inside interactive elements of the modal, satisfying ARIA 1.1 modal accessibility regulations.

### 📱 100% Mobile-First Responsive Breakpoints
Optimized to look professional, with zero horizontal scrollbars, across all standard viewports:
- **Phone (320px, 375px, 425px)**: Native slide-out dashboard panes with smooth transform transitions.
- **Tablet (768px)**: Collapsed sidebar grids with centered panels.
- **Desktop (1024px, 1440px, 1920px+)**: Dual-pane grid layout.

---

## ⚙️ Quick Start

No compilers or build steps required. Simply serve the workspace using any static HTTP server or open directly in your browser.

```bash
# Serve index.html or clients.html via local web server (e.g. VS Code Live Server)
```
