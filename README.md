<div align="center">

<img src="https://img.shields.io/badge/🌾-KisanSetu-2d6a4f?style=for-the-badge&labelColor=1b4332&color=2d6a4f" height="40"/>

# KisanSetu
### *Bridging Farmers with the Future of Smart Agriculture*

<br/>

[![JavaScript](https://img.shields.io/badge/JavaScript-90%25-F7DF1E?style=flat-square&logo=javascript&logoColor=black)]()
[![Python](https://img.shields.io/badge/Python-7.8%25-3776AB?style=flat-square&logo=python&logoColor=white)]()
[![CSS](https://img.shields.io/badge/CSS-2%25-1572B6?style=flat-square&logo=css3&logoColor=white)]()
[![Status](https://img.shields.io/badge/Status-Active-52b788?style=flat-square)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-74c69d?style=flat-square)]()

<br/>

> **KisanSetu** *(Farmer's Bridge)* is an AI-powered smart agriculture platform that gives every Indian farmer access to precision crop intelligence, instant disease diagnosis, live weather insights, government scheme discovery, and a fair digital marketplace — all in one place.

<br/>

[🚀 Features](#-features) &nbsp;•&nbsp; [🏗️ Architecture](#-architecture) &nbsp;•&nbsp; [🛠️ Tech Stack](#-tech-stack) &nbsp;•&nbsp; [📂 Project Structure](#-project-structure) &nbsp;•&nbsp; [⚙️ Getting Started](#-getting-started) &nbsp;•&nbsp; [🤝 Contributing](#-contributing)

---

</div>

## 📖 Overview

Agriculture employs over 50% of India's workforce, yet millions of farmers make critical decisions — what to grow, when to harvest, which schemes to apply for — without access to data-driven guidance. **KisanSetu** changes that.

By combining cutting-edge AI/ML models with a clean, accessible interface, KisanSetu puts powerful agricultural intelligence directly in the hands of farmers. Whether it's preventing a disease outbreak through early detection, selecting the most profitable crop for the season, or connecting buyers and sellers without middlemen — KisanSetu is the complete digital companion for modern farming.

---

## ✨ Features

### 🌱 AI Crop Recommendation Engine
Input soil composition, water availability, geographic location, and season — and receive intelligent, data-backed crop suggestions ranked by expected yield and local market conditions. Built to help farmers maximize productivity and income.

### 🔬 Plant Disease Detection
Take a photo of any affected leaf or plant and get an instant AI-powered diagnosis with treatment recommendations. The model identifies disease type, severity, and prescribes actionable remedies — helping stop crop loss before it spreads.

### ⛅ Hyperlocal Weather Forecasting
Real-time weather data and multi-day forecasts tailored to the farmer's exact location. Covers rainfall probability, temperature ranges, humidity, and wind — enabling smarter irrigation, sowing, and harvesting decisions.

### 🏛️ Government Schemes Directory
A continuously updated, searchable portal for central and state government agricultural schemes, subsidies, loans, and insurance programs. Farmers get easy-to-understand summaries, eligibility checks, and direct application guidance.

### 🛒 Digital Agri Marketplace
A farmer-first online marketplace to buy quality seeds, fertilizers, tools, and equipment — and sell produce directly to buyers at fair prices. Eliminates middlemen and improves farmer margins.

---

## 🏗️ Architecture

KisanSetu follows a clean **three-tier architecture** — a React frontend, a Node.js/Express backend API layer, and a Python-based AI engine for ML inference.

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│              React.js Frontend (Port 3000)                   │
│   UI Components • Pages • API Service Calls • State Mgmt    │
└─────────────────────────┬───────────────────────────────────┘
                          │  REST API
┌─────────────────────────▼───────────────────────────────────┐
│                        API LAYER                             │
│              Node.js / Express Backend (Port 5000)           │
│   Auth • Business Logic • DB Operations • AI Orchestration  │
└──────────┬──────────────────────────────────┬───────────────┘
           │  DB Queries                      │  HTTP
┌──────────▼──────────┐          ┌────────────▼───────────────┐
│      DATABASE       │          │         AI ENGINE           │
│   MongoDB / Atlas   │          │  Python FastAPI (Port 8000) │
│  Users • Crops •    │          │  Crop Model • Disease CNN   │
│  Orders • Schemes   │          │  Weather Parser • Inference │
└─────────────────────┘          └────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js, HTML5, CSS3 | User interface and client-side logic |
| **Backend** | Node.js, Express.js | REST API, authentication, business logic |
| **AI Engine** | Python, scikit-learn / TensorFlow | Crop recommendation & disease detection models |
| **Database** | MongoDB | Users, crops, orders, scheme data |
| **Weather** | OpenWeatherMap API | Real-time weather & forecasts |
| **Auth** | JWT | Secure stateless authentication |
| **Deployment** | *(Add your platform — Vercel, Railway, Render etc.)* | Hosting |

---

## 📂 Project Structure

The repository is split into three self-contained modules, each independently runnable:

```
KisanSetu/
├── frontend/               ← React.js Client Application
├── backend/                ← Node.js REST API Server
├── ai_engine/              ← Python ML Inference Engine
└── README.md
```

---

### 🖥️ `frontend/` — React Client

The user-facing application. Handles all UI, routing, and API communication.

```
frontend/
├── public/
│   └── index.html                  # HTML entry point
│
└── src/
    ├── components/                 # Reusable UI building blocks
    │   ├── Navbar/                 # Top navigation bar
    │   ├── Footer/                 # Site-wide footer
    │   ├── CropCard/               # Crop recommendation display card
    │   ├── DiseaseResult/          # Disease detection output component
    │   ├── WeatherWidget/          # Live weather display widget
    │   ├── SchemeCard/             # Government scheme info card
    │   └── ProductCard/            # Marketplace product tile
    │
    ├── pages/                      # Full page-level views (one per route)
    │   ├── Home/                   # Landing page with feature overview
    │   ├── CropRecommendation/     # Crop input form + AI results page
    │   ├── DiseaseDetection/       # Image upload + diagnosis page
    │   ├── Weather/                # Weather forecast dashboard
    │   ├── Schemes/                # Government schemes browser
    │   ├── Marketplace/            # Buy/sell product listings
    │   ├── Login/ & Register/      # Auth pages
    │   └── Dashboard/              # User's personalized home
    │
    ├── services/                   # Axios API call utilities
    │   ├── cropService.js          # Crop recommendation API calls
    │   ├── diseaseService.js       # Disease detection API calls
    │   ├── weatherService.js       # Weather data fetching
    │   ├── schemeService.js        # Schemes directory calls
    │   └── marketService.js        # Marketplace product calls
    │
    ├── context/                    # React Context for global state
    │   └── AuthContext.js          # Authentication state & user info
    │
    ├── utils/                      # Shared helper functions
    │   ├── formatters.js           # Date, number, unit formatting
    │   └── validators.js           # Form input validation
    │
    ├── App.js                      # Root app component + router setup
    └── index.js                    # React DOM entry point
```

**Key design decisions:**
- `services/` keeps all API logic centralized — pages never call `fetch` directly
- `context/AuthContext.js` provides global auth state so any component can check login status
- Each `pages/` folder is self-contained with its own CSS module

---

### ⚙️ `backend/` — Node.js / Express API

The core server handling authentication, data operations, and orchestration of AI engine calls.

```
backend/
├── server.js                       # App entry point — starts Express server
├── config/
│   └── db.js                       # MongoDB connection setup
│
├── routes/                         # API route definitions (URL → controller)
│   ├── auth.routes.js              # POST /api/auth/register, /login, /logout
│   ├── crop.routes.js              # POST /api/crops/recommend
│   ├── disease.routes.js           # POST /api/disease/detect
│   ├── weather.routes.js           # GET  /api/weather/:location
│   ├── scheme.routes.js            # GET  /api/schemes, /api/schemes/:id
│   └── market.routes.js            # GET/POST /api/market/products
│
├── controllers/                    # Business logic — one file per feature
│   ├── auth.controller.js          # Register, login, JWT issuance
│   ├── crop.controller.js          # Forwards soil/weather params to AI engine
│   ├── disease.controller.js       # Accepts image upload, calls AI engine
│   ├── weather.controller.js       # Queries OpenWeatherMap, returns parsed data
│   ├── scheme.controller.js        # Reads/filters scheme data from DB
│   └── market.controller.js        # CRUD for marketplace listings
│
├── models/                         # Mongoose database schemas
│   ├── User.model.js               # Farmer/user profile schema
│   ├── Crop.model.js               # Crop metadata and season info
│   ├── Scheme.model.js             # Government scheme details
│   └── Product.model.js            # Marketplace product listings
│
├── middleware/                     # Express middleware functions
│   ├── auth.middleware.js          # JWT verification — protects private routes
│   ├── upload.middleware.js        # Multer config for image file uploads
│   └── errorHandler.js            # Centralized error response formatter
│
└── .env.example                    # Environment variable template
```

**Key design decisions:**
- `routes/` only defines URL paths — all logic lives in `controllers/`
- `middleware/auth.js` is applied per-route, not globally, for fine-grained access control
- Disease detection uses Multer to handle multipart image uploads before forwarding to the AI engine

---

### 🤖 `ai_engine/` — Python ML Inference

Standalone Python service exposing ML model predictions via FastAPI. Called internally by the backend.

```
ai_engine/
├── main.py                          # FastAPI server entry point (Port 8000)
├── requirements.txt                # Python package dependencies
│
├── models/                         # Trained ML model artifacts
│   ├── crop_recommendation/
│   │   ├── crop_model.pkl          # Trained classifier (Random Forest / XGBoost)
│   │   └── label_encoder.pkl       # Encodes crop names to/from model format
│   └── disease_detection/
│       ├── disease_model.h5        # CNN model weights (TensorFlow / Keras)
│       └── class_labels.json       # Maps model output indices to disease names
│
├── routes/                         # FastAPI route definitions
│   ├── crop_routes.py              # POST /predict/crop
│   └── disease_routes.py           # POST /predict/disease
│
├── services/                       # Inference logic called by routes
│   ├── crop_service.py             # Loads crop model, runs prediction, returns result
│   └── disease_service.py          # Preprocesses image, runs CNN, returns diagnosis
│
└── utils/
    ├── preprocessor.py             # Input normalization and feature scaling
    └── image_utils.py              # Image resizing and tensor conversion
```

**Key design decisions:**
- Fully decoupled from the Node.js backend — can be developed and deployed independently
- Models are loaded once at startup (not per-request) for low-latency inference
- `services/` layer keeps route handlers thin — all heavy lifting stays in service files

---

## ⚙️ Getting Started

### Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | v16+ |
| npm | v8+ |
| Python | v3.8+ |
| pip | latest |
| MongoDB | v5+ (local or Atlas) |

---

### 1. Clone the Repository

```bash
git clone https://github.com/AdityaGade28/KisanSetu.git
cd KisanSetu
```

### 2. Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your values:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/kisansetu

# Authentication
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# External APIs
WEATHER_API_KEY=your_openweathermap_api_key

# AI Engine
AI_ENGINE_URL=http://localhost:8000
```

### 3. Start the Backend

```bash
cd backend
npm install
npm run dev
# ✅ API server running on http://localhost:5000
```


### 5. Start the Frontend

```bash
cd frontend
npm install
npm run dev
# ✅ App running on http://localhost:3000
```

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new farmer account |
| `POST` | `/api/auth/login` | Login and receive JWT token |

### Crop Recommendation
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/crops/recommend` | Get AI-powered crop recommendations |

```json
// Request body
{
  "nitrogen": 90,
  "phosphorus": 42,
  "potassium": 43,
  "temperature": 20.87,
  "humidity": 82.00,
  "ph": 6.50,
  "rainfall": 202.93
}
```

### Disease Detection
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/disease/detect` | Detect plant disease from an image |

> Request format: `multipart/form-data` with an `image` field.

### Weather
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/weather/:location` | Get weather forecast for a location |

### Marketplace
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/market/products` | List all marketplace products |
| `POST` | `/api/market/products` | Create a new product listing |

---

## 🤝 Contributing

All contributions are welcome! Here's how to get involved:

1. **Fork** this repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with a descriptive message
   ```bash
   git commit -m "feat: add your change description"
   ```
4. **Push** to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open** a Pull Request — describe what you changed and why

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages (`feat:`, `fix:`, `docs:`, `chore:` etc.)

---

## 🐛 Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/AdityaGade28/KisanSetu/issues) with:
- A clear, descriptive title
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots or logs if helpful

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

---

## 🙏 Acknowledgements

- The farming communities of India who inspired this project
- The open-source ecosystem — React, Node.js, FastAPI, scikit-learn, TensorFlow, and more
- Every contributor who dedicated their time to building KisanSetu

---

<div align="center">

**Made with ❤️ for the 140 million farmers of India 🇮🇳**

⭐ If KisanSetu brings value to you, please consider giving it a star!

[GitHub](https://github.com/AdityaGade28/KisanSetu) &nbsp;

</div>
