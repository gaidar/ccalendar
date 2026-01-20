# Country Calendar

Track your travels across the globe with a beautiful calendar interface.

## Features

- Visual calendar to track which countries you visited on each day
- 249 countries with unique colors for easy identification
- OAuth authentication (Google, Facebook, Apple)
- Mobile-first responsive design
- Export your travel data

## Tech Stack

- **Backend**: Node.js, Express.js, Prisma, PostgreSQL, Redis
- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui, Zustand, TanStack Query
- **Infrastructure**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- npm 10+

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ccalendar.git
   cd ccalendar
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env.development
   ```

3. Start the development environment:
   ```bash
   docker compose up
   ```

4. In a separate terminal, run database migrations:
   ```bash
   docker compose exec api npx prisma migrate dev
   ```

5. Access the application:
   - Web App: http://localhost:3000
   - API: http://localhost:3001/api/v1
   - Health Check: http://localhost:3001/api/v1/health

### Local Development (without Docker)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start PostgreSQL and Redis (locally or via Docker):
   ```bash
   docker compose up db redis
   ```

3. Run database migrations:
   ```bash
   npm run db:migrate
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

## Project Structure

```
ccalendar/
├── docker/                 # Docker configuration files
│   ├── Dockerfile.api
│   └── Dockerfile.web
├── packages/
│   ├── api/               # Backend Express.js application
│   │   ├── prisma/        # Database schema and migrations
│   │   ├── data/          # Static data (countries.json)
│   │   └── src/
│   │       ├── config/    # Configuration management
│   │       ├── controllers/
│   │       ├── middleware/
│   │       ├── routes/
│   │       ├── services/
│   │       ├── utils/
│   │       └── validators/
│   └── web/               # Frontend React application
│       └── src/
│           ├── components/
│           ├── hooks/
│           ├── lib/
│           ├── pages/
│           ├── services/
│           ├── stores/
│           ├── styles/
│           └── types/
├── docker-compose.yml
├── package.json
└── README.md
```

## Available Scripts

### Root

- `npm run dev` - Start all packages in development mode
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

### API (`packages/api`)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint code
- `npm run test` - Run tests

### Web (`packages/web`)

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## API Endpoints

### Health

- `GET /api/v1/health` - Health check endpoint

### Countries

- `GET /api/v1/countries` - Get all countries
- `GET /api/v1/countries/:code` - Get country by code

## Environment Variables

See `.env.example` for all available environment variables.

## License

MIT
