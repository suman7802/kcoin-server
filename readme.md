# GloballyHubServer (kcoin)

> A lightweight Node.js + TypeScript API server for cryptocurrency-related operations.

## Quick links

- API documentation (Postman): https://documenter.getpostman.com/view/46183183/2sBXVfiWwT

## Features

- Express + TypeScript
- MongoDB via Mongoose
- Request rate limiting, slow-down, and security middlewares (helmet, cors)
- Internationalization (i18next)
- Prometheus metrics endpoint (`/metrics`)
- Logging with Winston and request tracing

## Requirements

- Node.js (18+ recommended)
- npm or yarn
- MongoDB (connection string required)

## Setup

1. Install dependencies

```bash
npm install
```

2. Create environment files

Copy or create environment variables for the application. Example `.env` values:

```
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:3000
LOG_LEVEL=dev
API_KEY=your-api-key
JWT_SECRET=supersecret
MONGODB_URI=mongodb://localhost:27017/kcoin
DISABLE_RATE_LIMITER=false
DISABLE_VALIDATE_API_KEY_ON_DEVELOPMENT=true
```

3. Run in development

```bash
npm run dev
```

4. Build and run for production

```bash
npm run build
npm start
```

## Scripts

- `npm run dev` - run in development with `tsx` watcher
- `npm run build` - compile TypeScript and resolve paths
- `npm start` - run built production server (`node build/server.js`)
- `npm run lint` / `npm run lint:fix` - linting

## Docker

This repository includes a `docker-compose.yml`. To run via Docker:

```bash
docker-compose up --build
```

## Environment variables

- `NODE_ENV` - `development|production`
- `PORT` - port to run the server (default in env)
- `CLIENT_URL` - allowed CORS origin
- `LOG_LEVEL` - morgan log level
- `API_KEY` - API key used by `verify-apiKey` middleware
- `JWT_SECRET` - JWT signing secret
- `MONGODB_URI` - MongoDB connection string
- `DISABLE_RATE_LIMITER` - disable rate limiter (true/false)
- `DISABLE_VALIDATE_API_KEY_ON_DEVELOPMENT` - allow skipping API key check in dev

## Endpoints

- Base API: `/api/v0`
- Metrics: `/metrics` (Prometheus)

For full API details (routes, request/response payloads, examples), see the Postman docs:

https://documenter.getpostman.com/view/46183183/2sBXVfiWwT

## Observability

- Prometheus-compatible metrics are exposed at `/metrics`.
- Request and application logs are handled with `morgan` and `winston`.

## Notes

- Entry point: `src/server.ts` (built output: `build/server.js`).
- Application uses `dotenv-flow` and performs schema validation for required environment variables.
- There are no tests included in this repository by default.

## Next steps

- Start the app locally with `npm run dev` and open the API docs link to explore endpoints.
- I can add a `.env.example` or CI instructions if you want — tell me which you prefer.

---

Generated from repository metadata on January 11, 2026.
