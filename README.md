<div align="center">

<img src="https://img.shields.io/badge/Hackathon-2026-blueviolet?style=for-the-badge&logo=trophy&logoColor=white" />
<img src="https://img.shields.io/badge/AI_Powered-Gemini-0EA5E9?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Platform-Google_Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white" />
<img src="https://img.shields.io/badge/Stack-HTML_%7C_CSS_%7C_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />

# 🏟️ SmartStadium AI

### *Never Miss a Moment. Never Wait in a Line.*

**An AI-powered Smart Venue & Fan Experience Platform for the modern sports stadium.**

[🚀 Live Demo](#) · [📖 Features](#-features) · [⚙️ How It Works](#️-how-it-works) · [🛠️ Tech Stack](#️-tech-stack)

---

</div>

## 📸 Preview

> A fully responsive, dark-themed single-page website built for the **Hackathon 2026 — Smart Sports & Venues Track**.

<div align="center">

| Section | Description |
|---|---|
| 🎯 **Hero** | Bold headline with animated stadium-grid background and glowing CTA |
| 📊 **Problem** | 3 animated stat cards with live counter animations on scroll |
| ⚡ **Live Demo** | Interactive Queue Estimator — select stall + crowd level, get AI predictions |
| 🧭 **Features** | 6-card hover grid of smart venue capabilities |
| 📋 **How It Works** | 3-step fan journey with connector flow |
| 🔧 **Tech Stack** | Badge-style technology tags |

</div>

---

## 🚀 Features

<table>
<tr>
<td width="50%">

### 🧭 AI Crowd Routing
Real-time crowd density maps powered by computer vision dynamically reroute fans away from congestion hotspots inside and outside the venue.

</td>
<td width="50%">

### 📱 Pre-Order to Seat
Order food and beverages directly to your seat via the mobile app. AI predicts optimal delivery windows based on match flow and player breaks.

</td>
</tr>
<tr>
<td>

### 🥽 AR Wayfinding
Point your phone and follow AR overlays to toilets, exits, your seat, or the nearest concession — powered by BLE beacons and centimeter-accurate indoor GPS.

</td>
<td>

### 📊 Live Queue View
See real-time queue lengths at every stall on an interactive venue heatmap. Get push alerts when your preferred stall drops below a 5-minute threshold.

</td>
</tr>
<tr>
<td>

### 🚨 Emergency Exit Navigation
In critical situations, SmartStadium AI instantly activates dynamic exit routing, distributing evacuation load evenly and minimizing crowd crush risk.

</td>
<td>

### 🎬 Post-Match Highlights
AI-generated personalized highlight reels — based on your seat view and favorite players — delivered to your phone within minutes of the final whistle.

</td>
</tr>
</table>

---

## 🔥 The Problem We Solve

Live sports should be unforgettable. But right now, friction is destroying the experience:

| Statistic | Reality |
|---|---|
| ⏱️ **18 min** | Average wait time at concession stands during peak hours |
| 🚗 **43%** | Of fans leave before the final whistle to beat traffic |
| 🗺️ **2 in 3** | Fans frustrated by confusing in-venue navigation |

**SmartStadium AI eliminates all three.**

---

## ⚙️ How It Works

```
💺 Enter Your Seat  ──►  🗺️ Get Your Plan  ──►  🎉 Enjoy the Game
```

1. **Enter Your Seat** — Open the app, scan your ticket QR or enter your seat number. SmartStadium AI maps your exact location instantly.
2. **Get Your Plan** — Receive a personalized gameday plan with optimal concession picks, queue times, and AI predictions for halftime demand.
3. **Enjoy the Game** — Never miss a goal because you were in a queue again. Live alerts, AR navigation, and pre-order delivery keep you in your seat.

---

## ⚡ Interactive Demo — Queue Estimator

The live demo lets you:
- **Select a food stall**: Main Concession · East Wing Bar · West Wing Grill · VIP Lounge
- **Set crowd level**: 🟢 Low · 🟡 Medium · 🔴 High
- **Get an AI prediction**: Estimated wait time + status badge (green/yellow/red) + a smart routing tip

> Example: *"🥩 West Wing Grill · High crowd → 14 min wait 🔴 Long Wait — Consider the VIP Lounge or pre-order delivery."*

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| 👁️ **Computer Vision** | Real-time crowd density analysis from CCTV feeds |
| 📡 **BLE Beacons** | Indoor positioning with centimeter-level accuracy |
| ⚡ **Realtime AI** | Edge inference for sub-second queue predictions |
| 📱 **Mobile App** | Cross-platform fan interface (iOS & Android) |
| ☁️ **Cloud APIs** | Google Cloud infrastructure and data pipelines |
| 🤖 **Predictive ML** | Historical demand forecasting and anomaly detection |
| ✨ **Gemini AI** | Natural language tips, highlights generation, chatbot |
| 🔷 **Google Cloud** | Hosting, Cloud Run, Firestore, Firebase |

---

## 🗂️ Project Structure

```
smartstadium-ai/
├── index.html          # Single-page application (all 7 sections)
├── style.css           # Full design system — CSS variables, animations, responsive
├── script.js           # Scroll animations, Queue Estimator logic, counter animations
├── README.md           # You are here!
└── requirements.txt    # Project dependencies and tech notes
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- No build tools or dependencies required — it's pure HTML, CSS, and JavaScript!

### Running Locally

**Option 1 — Direct Open (Instant)**
```bash
# Just double-click index.html — or:
open index.html         # macOS
start index.html        # Windows
xdg-open index.html     # Linux
```

**Option 2 — Python Local Server (Recommended)**
```bash
# Python 3
python -m http.server 8000
# Then visit: http://localhost:8000
```

**Option 3 — Node.js (via npx)**
```bash
npx serve .
# Then visit: http://localhost:3000
```

---

## ☁️ Deployment — Google Cloud

### Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to: .
# Configure as SPA: No
firebase deploy
```

### Google Cloud Storage Static Hosting
```bash
# Authenticate
gcloud auth login

# Create bucket
gsutil mb gs://smartstadium-ai

# Upload files
gsutil cp index.html style.css script.js gs://smartstadium-ai

# Set website config
gsutil web set -m index.html -e 404.html gs://smartstadium-ai

# Make public
gsutil iam ch allUsers:objectViewer gs://smartstadium-ai
```

### Cloud Run (Docker)
```bash
gcloud run deploy smartstadium-ai \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🤖 Gemini AI Integration (Planned)

The Queue Estimator will be upgraded to call the **Gemini 1.5 Flash** API in real time:

```javascript
// Planned integration
const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-goog-api-key': YOUR_API_KEY
  },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: `Estimate wait time at ${stall} with ${crowdLevel} crowd. Give a number in minutes and one routing tip.` }]
    }]
  })
});
```

---

## 👤 Author

**Savio Mohan**
- GitHub: [@SavioMohan1](https://github.com/SavioMohan1)
- Email: saviomohan2002@gmail.com

---

## 🏆 Hackathon

> Built for **Hackathon 2026 — Smart Sports & Venues Track**
> Powered by **Google Cloud** & **Gemini AI**

---

<div align="center">

**⭐ If you like this project, star it on GitHub!**

Made with ❤️ and ⚡ AI by Savio Mohan

</div>
