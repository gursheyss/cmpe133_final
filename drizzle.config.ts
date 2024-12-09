import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    url: process.env.TURSO_CONNECTION_URL!,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
} satisfies Config;
