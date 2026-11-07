# Simple Attendance Website

A full-stack application built with **React** (via Vite), **NestJS**, and **MySQL**.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: NestJS, TypeScript, Node.js
- **Database**: MySQL (containerized via Docker)
- **Package Manager**: npm

## Project Structure

This repository uses a root-level configuration for environment variables and Docker, with the frontend and backend in separate directories:

```text
.
├── docker-compose.yml   # Database and container configuration
├── .env.example         # Example environment variables template
├── .env                 # Local environment variables (Ignored in Git)
├── .gitignore           # Root gitignore rules
├── backend/             # NestJS API
│   ├── package.json
│   └── src/
└── frontend/            # Vite + React App
    ├── package.json
    └── src/
```

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (to run the local database)
- npm, yarn, or pnpm

## Getting Started

### 1. Clone the repository and configure environment

```bash
git clone https://github.com/wNSYA/dexa-group-technical-test.git
cd dexa-group-technical-test

# Copy the example environment file and configure your variables
cp .env.example .env
```

### 2. Database Setup (Docker)

Start the MySQL database container in the background from the root directory:

```bash
docker compose up -d
```
*(The database will run on `localhost:3306`. To stop it later, run `docker compose down`.)*

### 3. Backend Setup (NestJS)

Open a new terminal window and navigate to the backend directory:

```bash
cd backend

# Install dependencies
npm install

# Start the development server
npm run start:dev
```

The NestJS API will typically run on `http://localhost:3000`.

### 4. Frontend Setup (Vite + React)

Open another terminal window and navigate to the frontend directory:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The Vite frontend will typically run on `http://localhost:5173`.

## Available Scripts

### Backend (run inside `/backend`)

- `npm run start:dev` - Starts the application in watch mode
- `npm run build` - Builds the application for production
- `npm run test` - Runs unit tests

### Frontend (run inside `/frontend`)

- `npm run dev` - Starts the Vite development server
- `npm run build` - Builds the React app for production
- `npm run lint` - Runs ESLint

## Deployment

**Database**: Provision a managed MySQL database (e.g., AWS RDS, DigitalOcean, etc.) and update your production environment variables.

**Backend**: Build the NestJS app using `npm run build` and deploy the output in the `dist/` directory to your Node.js hosting provider.

**Frontend**: Build the React app using `npm run build` and deploy the output in the `dist/` directory to your static hosting provider.