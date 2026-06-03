# CanvasSync: Real-Time Collaborative Canvas

A high-performance, real-time collaborative whiteboarding application. Multiple users can draw, chat, and collaborate on a shared canvas with minimal latency.

Built as a monorepo with Turborepo, featuring a Next.js frontend, Express REST API, WebSocket server, and PostgreSQL database.

## Architecture

```
Client Browser (Canvas API + React)
        |
        v
WebSocket Server <---> Other Clients
        |
        v
HTTP API Server (Express)
        |
        v
PostgreSQL (Drizzle ORM)
```

## Tech Stack

- **Frontend:** Next.js 15, React 19, Redux Toolkit, HTML5 Canvas API
- **Backend:** Node.js, Express, WebSocket (ws), Drizzle ORM
- **Database:** PostgreSQL
- **Monorepo:** Turborepo, PNPM

## Features

- Real-time collaborative drawing with WebSocket sync
- Multiple drawing tools: rectangle, diamond, circle, line, arrow, freehand, text
- Selection, move, resize, erase tools
- Infinite canvas with pan and zoom
- Undo/redo with deterministic action buffers
- Real-time chat
- User authentication with JWT

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL database
- PNPM

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables (copy `.env.example` files in each app):
```bash
# apps/web/.env
NEXT_PUBLIC_HTTP_URL=http://localhost:4001
NEXT_PUBLIC_WS_URL=ws://localhost:4002

# apps/http-server/.env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
PORT=4001
FRONTEND_ORIGIN=http://localhost:3000

# apps/ws-server/.env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
PORT=4002
```

3. Generate database migrations:
```bash
pnpm db:generate
```

4. Run database migrations:
```bash
pnpm db:migrate
```

5. Start development:
```bash
pnpm dev
```

## Deployment

Docker compose configuration is provided for production deployment.

```bash
docker compose -f docker-compose.production.yml --env-file .env.production up -d
```