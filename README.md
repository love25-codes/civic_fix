
# 🏙️ CivicFix: Empowering Communities Through Data
## CivicFix is a high-performance management platform that bridges the gap between citizens and city administration. It provides a transparent, real-time ecosystem for reporting infrastructure issues, tracking resolution progress, and visualizing city-wide analytics.

## 🎯 The Mission
The goal of CivicFix is to transform citizens from passive observers into active participants in urban maintenance. Whether it's a broken street light, a pothole, or a sanitation issue, CivicFix ensures every voice is heard and every problem is tracked.

## 🔗 Live Link:
### https://civic-fix-six.vercel.app/

## 🏗️ Project Architecture
The codebase is structured for scalability and clean separation of concerns using React, Tailwind CSS.
```
CIVIC_FIX
├── 📁 node_modules       # Project dependencies
├── 📁 public             # Static assets (images, icons, favicon)
├── 📁 src                # Main source code
│   ├── 📁 components     # Reusable UI elements
│   │   ├── AuthModal.jsx     # Login/Signup popup
│   │   ├── LearnBanner.jsx   # Educational/Info banner
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── ReportForm.jsx    # Issue reporting form
│   ├── 📁 context        # Global State Management
│   │   ├── AuthContext.js    # Firebase Auth state
│   │   └── ReportContext.js  # Global reporting data
│   ├── 📁 firebase       # Firebase configuration
│   │   └── config.js         # Firebase SDK initialization
│   ├── 📁 pages          # Main Page views
│   │   ├── Analytics.jsx     # City data visualizations
│   │   ├── Dashboard.jsx     # User management area
│   │   ├── Learn.jsx         # Info/Resource page
│   │   └── Report.jsx        # Reporting landing page
│   ├── 📁 services       # API and Logic helpers
│   │   └── authService.js    # Auth-related helper functions
│   ├── App.css           # Global CSS styles
│   ├── App.jsx           # Main App component & Routing
│   ├── index.css         # Tailwind & base styles
│   └── main.jsx          # React entry point
├── .env                  # Private API keys (Secured)
├── .gitignore            # Files excluded from GitHub
├── eslint.config.js      # Linting configuration
├── index.html            # Entry HTML file
├── package-lock.json     # Locked version of dependencies
├── package.json          # Project metadata & dependencies
├── postcss.config.js     # PostCSS (Tailwind) config
└── README.md             # Project documentation
```


## ✨ Key Features:
```
-> 📢INSTANT ISSUE REPORTING: A streamlined, authenticated form to submit reports with category tagging and descriptions.
-> 📡REAL-TIME STATUS TRACKING: Users can monitor the "Life Cycle" of their reported issues directly from their dashboard.
-> 📊URBAN ANALYTICS: A premium dashboard visualizing city data, demographic trends, and infrastructure health.
-> 🔐SECURE USER IDENTITY: Protected by Firebase Auth, ensuring all reports are verified and linked to individual profiles.
```

## 🛠️ Tech Stack:
```
 -> Frontend: React.js (Vite)
 -> Styling: Tailwind CSS
 -> Icons: Lucide React
 -> Deployment: Vercel
 -> Backend:	Firebase (Firestore & Authentication)
```

## 🧠 Concepts Used:

### ● Frontend & UX
COMPONENT ARCHITECTURE: Used React to build modular, reusable UI elements like Navbar, AuthModal, and ReportForm.
<br />
GLOBAL STATE MANAGEMENT: Implemented React Context API to share user authentication and report data across the entire app seamlessly.
<br />
CLIENT-SIDE ROUTING: Used react-router-dom to create a smooth, single-page application (SPA) experience without page reloads.
<br />
RESPONSIVE DESIGN: Applied Tailwind CSS utility classes to ensure a premium dashboard experience.


### ● Backend & Database
SERVERLESS ARCHITECTURE: Utilized Firebase as a Backend-as-a-Service (BaaS) to handle logic without managing a physical server.
<br />
NoSQL DATA MODELING: Structured data in Cloud Firestore using collections and documents for flexible urban issue tracking.
<br />
IDENTITY MANAGEMENT: Integrated Firebase Auth for secure user registration and login sessions.

### ● Security & DevOps
ENVIRONMENT SECURITY: Managed sensitive API keys via .env files and Vite environment variables to prevent leaks on GitHub.
<br />
DATABASE GUARDRAILS: Wrote custom Firestore Security Rules to ensure only authenticated users can read or write data.
<br />
CI/CD PIPELINE: Connected GitHub to Vercel for automated builds and continuous deployment.


## 🛡️ Security & Reliability:
```
 -> DATA INTEGRITY: Firestore Security Rules ensure that only registered users can write to the database.
 -> CREDENTIAL PROTECTION: All sensitive API keys are injected via Vercel's environment variables, never exposed.
 -> PRODUCTION READY: Deployment includes whitelisted domains and restricted API keys.
```

## 🏆 The CivicFix Philosophy:
```
"Don't just see. Report it to CivicFix."
```

## 👩‍💻 Creator:
### Lovepreet Kaur
Built with curiosity, creativity, and React.
