# FinanceGuard

A secure financial management platform.

## Getting Started

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

2. Set up your environment variables in `.env`:

```bash
# Required database configuration
TURSO_CONNECTION_URL=your_turso_connection_url
TURSO_AUTH_TOKEN=your_turso_auth_token

# Auth configuration
AUTH_SECRET=your_auth_secret # Generate with: openssl rand -base64 32

# Next.js configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Run database migrations:

```bash
npm run db:push
# or
yarn db:push
# or
pnpm db:push
# or
bun db:push
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

- [Turso Documentation](https://docs.turso.tech) - learn about Turso database features
- [DrizzleORM Documentation](https://orm.drizzle.team) - learn about DrizzleORM
