# Simple Attendance Website

A full-stack application built with **React** (via Vite) and **NestJS**. 

## Tech Stack

*   **Frontend**: React, TypeScript, Vite
*   **Backend**: NestJS, TypeScript, Node.js
*   **Package Manager**: npm 

## Project Structure

This repository contains both the frontend and backend in separate directories:

```text
.
├── backend/            # NestJS API
├── frontend/           # Vite + React App
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   npm, yarn, or pnpm

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/wNSYA/dexa-group-technical-test.git
cd your-repo-name
```

### 2. Backend Setup (NestJS)

Open a new terminal window and navigate to the backend directory:

```bash
cd backend

# Install dependencies
npm install

# Copy the example environment file and configure your variables
cp .env.example .env

# Start the development server
npm run start:dev
```
The NestJS API will typically run on `http://localhost:3000`.

### 3. Frontend Setup (Vite + React)

Open another terminal window and navigate to the frontend directory:

```bash
cd frontend

# Install dependencies
npm install

# Copy the example environment file
cp .env.example .env

# Start the development server
npm run dev
```
The Vite frontend will typically run on `http://localhost:5173`.

## Available Scripts

### Backend
*   `npm run start:dev` - Starts the application in watch mode
*   `npm run build` - Builds the application for production
*   `npm run test` - Runs unit tests

### Frontend
*   `npm run dev` - Starts the Vite development server
*   `npm run build` - Builds the React app for production
*   `npm run lint` - Runs ESLint

## Deployment

**Backend**: Build the NestJS app using `npm run build` and deploy the output in the `dist/` directory to your Node.js hosting provider.

**Frontend**: Build the React app using `npm run build` and deploy the output in the `dist/` directory to your static hosting provider.