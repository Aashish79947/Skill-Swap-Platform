# Skill Trading Platform - Frontend

This is the frontend application for the Skill Trading Platform, built with React, Vite, and Tailwind CSS. It provides a modern, responsive interface for users to list skills, search for trades, chat with others, and manage their profiles.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [Available Scripts](#available-scripts)

## Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/skill-trading-platform.git
   cd skill-trading-platform/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` directory based on `.env.example`.

## Environment Variables
Create a `.env` file and add the following:
```env
VITE_API_URL=http://localhost:8000
```

## Project Structure
```text
frontend/
├── public/             # Static assets like icons
├── src/
│   ├── assets/         # Images and global styles
│   ├── components/     # Reusable UI components (Navbar, NotificationDropdown, etc.)
│   ├── context/        # React Context for global state (Auth, Notifications)
│   ├── pages/          # Full page components (Dashboard, Profile, Chat, etc.)
│   ├── services/       # API call handlers (Axios setup)
│   ├── App.jsx         # Main application component and routing
│   ├── main.jsx        # Application entry point
│   ├── index.css       # Global styles and Tailwind imports
│   └── App.css         # App-specific styles
├── .env                # Environment variables
├── .env.example        # Template for environment variables
├── tailwind.config.js  # Tailwind CSS configuration
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

### File Descriptions
| File/Directory | Description |
| :--- | :--- |
| `src/context/AuthContext.jsx` | Manages user authentication state and login/logout logic. |
| `src/context/NotificationContext.jsx` | Handles real-time notifications via Socket.io. |
| `src/components/Navbar.jsx` | Main navigation component with Glassmorphism design. |
| `src/pages/Dashboard.jsx` | Main landing page for authenticated users to see skill listings. |
| `src/pages/ChatWindow.jsx` | Interface for real-time messaging with other users. |
| `src/pages/MyProfile.jsx` | User profile management page. |
| `src/services/api.js` | Axios instance configured with the base API URL. |

## Core Features
- **Modern UI**: Stylish design using Glassmorphism and responsive layouts.
- **Real-Time Notifications**: Instant alerts for messages and trade requests.
- **Skill Discovery**: Search and filter skills offered by other users.
- **Interactive Chat**: Real-time communication between skill traders.
- **Authentication**: Secure JWT-based login and registration.

## Available Scripts

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```
