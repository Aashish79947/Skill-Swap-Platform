# Skill-Swap-Platform

A full-stack skill trading platform where users can list skills, find matches, send trade requests, and chat in real-time. Built with **React + Vite** (frontend) and **Express + MongoDB** (backend), with automated testing powered by **Robot Framework**.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Test Automation (Robot Framework)](#test-automation-robot-framework)
  - [Setup Testing Environment](#setup-testing-environment)
  - [Running Tests](#running-tests)
  - [Test Suite Overview](#test-suite-overview)
  - [Test Reports](#test-reports)
- [API Endpoints](#api-endpoints)

---

## Features
- 🔐 JWT Authentication + Google OAuth
- 🎯 Skill Listing & Marketplace
- 🤝 Trade Request System (send/accept/reject/complete)
- 💬 Real-time Chat via Socket.io
- 🔔 Live Notifications
- ⭐ User Reviews & Ratings
- 🔍 Smart Skill Matching
- 🤖 Automated API & UI Testing with Robot Framework

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | Express 5, Node.js |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io |
| Auth | JWT, Passport.js, Google OAuth |
| Testing | Robot Framework, RequestsLibrary, Browser Library |

## Project Structure
```
Skill-Swap-Platform/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── config/             # DB & passport config
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Auth middleware
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   └── server.js          # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth & Notification context
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service (Axios)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── tests/                      # Robot Framework test automation
│   ├── requirements.txt       # Python test dependencies
│   ├── resources/             # Shared keywords & variables
│   │   ├── common.resource
│   │   ├── api_keywords.resource
│   │   └── ui_keywords.resource
│   ├── api/                   # API test suites
│   │   ├── health_check.robot
│   │   ├── auth_tests.robot
│   │   └── skill_tests.robot
│   └── ui/                    # UI test suites
│       ├── login_tests.robot
│       ├── register_tests.robot
│       └── navigation_tests.robot
└── README.md
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Python](https://www.python.org/) 3.10+ (for test automation)

### Installation

```bash
# Clone the repository
git clone https://github.com/Aashish79947/Skill-Swap-Platform.git
cd Skill-Swap-Platform

# Install backend dependencies
cd backend
npm install
cp .env.example .env    # Edit .env with your MongoDB URI & JWT secret

# Install frontend dependencies
cd ../frontend
npm install
cp .env.example .env    # Edit .env with VITE_API_URL
```

### Running the Application

```bash
# Terminal 1 — Backend (port 8000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Test Automation (Robot Framework)

The project includes **23 automated test cases** using [Robot Framework](https://robotframework.org/) covering both API and UI testing.

### Setup Testing Environment

After cloning the repo, set up the testing environment:

```bash
# 1. Create a Python virtual environment
python3 -m venv .venv
source .venv/bin/activate        # Linux/Mac
# .venv\Scripts\activate         # Windows

# 2. Install Robot Framework & test libraries
pip install -r tests/requirements.txt

# 3. Initialize browser drivers (for UI tests)
rfbrowser init
```

> **Note:** `rfbrowser init` downloads Chromium, Firefox, and WebKit browsers (~400MB). You can install only Chromium with:
> ```bash
> rfbrowser init --skip-browsers
> npx playwright install chromium
> ```

### Running Tests

**Make sure both backend and frontend servers are running** before executing tests.

```bash
# Activate virtual environment
source .venv/bin/activate

# Run ALL tests
robot --outputdir tests/results tests/

# Run only API tests (needs backend on port 8000)
robot --outputdir tests/results tests/api/

# Run only UI tests (needs backend + frontend)
robot --outputdir tests/results tests/ui/

# Run a specific test file
robot --outputdir tests/results tests/api/auth_tests.robot

# Dry-run (validate syntax without executing)
robot --dryrun --outputdir tests/results tests/
```

### Test Suite Overview

| Test File | Tests | What It Covers |
|-----------|:-----:|----------------|
| `health_check.robot` | 3 | Server status, endpoint availability |
| `auth_tests.robot` | 6 | Register, duplicate email, login, wrong password, profile with/without token |
| `skill_tests.robot` | 4 | Create skill, list my skills, marketplace, delete skill |
| `login_tests.robot` | 4 | Page load, form elements, register link, Google SSO, empty field validation |
| `register_tests.robot` | 3 | Page load, login link, Google SSO |
| `navigation_tests.robot` | 3 | Login ↔ Register navigation, 404 page |
| **Total** | **23** | |

### Test Reports

After running tests, Robot Framework generates HTML reports in `tests/results/`:

| File | Description |
|------|-------------|
| `report.html` | High-level summary with pass/fail stats |
| `log.html` | Detailed step-by-step execution log |
| `output.xml` | Machine-readable results (for CI/CD) |

Open `tests/results/report.html` in a browser to view results.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/api/auth/register` | ✗ | Register new user |
| POST | `/api/auth/login` | ✗ | Login user |
| GET | `/api/auth/profile` | ✓ | Get user profile |
| PUT | `/api/auth/profile` | ✓ | Update profile |
| GET | `/api/auth/google` | ✗ | Google OAuth login |
| POST | `/api/skills` | ✓ | Create a skill |
| GET | `/api/skills/my` | ✓ | Get my skills |
| GET | `/api/skills/marketplace` | ✓ | Browse marketplace |
| PUT | `/api/skills/:id` | ✓ | Update a skill |
| DELETE | `/api/skills/:id` | ✓ | Delete a skill |
| POST | `/api/trade/request` | ✓ | Send trade request |
| GET | `/api/trade/requests` | ✓ | Get my requests |
| PUT | `/api/trade/requests/:id/accept` | ✓ | Accept request |
| PUT | `/api/trade/requests/:id/reject` | ✓ | Reject request |
| GET | `/api/chat/conversations` | ✓ | Get conversations |
| GET | `/api/chat/:tradeId` | ✓ | Get chat history |
| POST | `/api/chat/send` | ✓ | Send message |
| GET | `/api/matches` | ✓ | Find skill matches |
| GET | `/api/notifications` | ✓ | Get notifications |
| POST | `/api/reviews` | ✓ | Create review |
| GET | `/api/reviews/user/:userId` | ✗ | Get user reviews |
