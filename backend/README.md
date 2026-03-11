# Skill Trading Platform - Backend

This is the backend server for the Skill Trading Platform, built with Node.js, Express, and MongoDB. It provides safe and efficient APIs for user authentication, skill management, trade requests, and real-time messaging.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Running the Server](#running-the-server)

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas instance)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/skill-trading-platform.git
   cd skill-trading-platform/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory based on `.env.example`.

## Environment Variables
Create a `.env` file and add the following:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Project Structure
```text
backend/
├── src/
│   ├── config/         # Configuration files (e.g., Database connection)
│   ├── controllers/    # Request handlers for various routes
│   ├── middleware/     # Custom Express middleware (e.g., auth)
│   ├── models/         # Mongoose schemas for MongoDB
│   ├── routes/         # Route definitions
│   └── server.js       # Main entry point and Socket.io setup
├── .env                # Environment variables (not tracked by git)
├── .env.example        # Template for environment variables
├── package.json        # Project dependencies and scripts
└── package-lock.json   # Locked versions of dependencies
```

### File Descriptions
| File/Directory | Description |
| :--- | :--- |
| `src/server.js` | Initializes Express, connects to MongoDB, and sets up Socket.io for real-time notifications/chat. |
| `src/models/User.js` | Schema for user profiles, including skills offered/desired. |
| `src/models/skill.js` | Schema for individual skill listings. |
| `src/models/tradeRequest.js` | Schema for skill trade requests between users. |
| `src/models/message.js` | Schema for chat messages. |
| `src/models/notification.js` | Schema for real-time notifications. |
| `src/controllers/auth.controller.js` | Logic for user registration and login. |
| `src/controllers/skill.controller.js` | Logic for creating, updating, and fetching skills. |
| `src/controllers/trade.controller.js` | Logic for managing trade requests (accept/reject). |
| `src/controllers/chat.controller.js` | Logic for fetching chat history and messages. |
| `src/controllers/notification.controller.js` | Logic for fetching and marking notifications as read. |

## API Endpoints

### Auth
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login user.

### Skills
- `GET /api/skills`: Get all skills with filters.
- `POST /api/skills`: Add a new skill (Auth required).
- `GET /api/skills/my-skills`: Get skills listed by the logged-in user.

### Trade Requests
- `POST /api/trade-requests`: Send a trade request.
- `GET /api/trade-requests/received`: Get received requests.
- `PATCH /api/trade-requests/:id`: Update request status (accept/reject).

### Notifications
- `GET /api/notifications`: Get user notifications.
- `PUT /api/notifications/read-all`: Mark all notifications as read.

## Running the Server

### Development Mode (with Nodemon)
```bash
npm run dev
```
