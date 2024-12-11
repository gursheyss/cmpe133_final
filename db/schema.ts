import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email").unique().notNull(),
    emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
    image: text("image"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
  })
);

export const accounts = sqliteTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    providerIdx: index("provider_idx").on(table.provider),
    userIdIdx: index("userId_idx").on(table.userId),
  })
);

export const sessions = sqliteTable(
  "sessions",
  {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => ({
    userIdIdx: index("sessions_userId_idx").on(table.userId),
  })
);

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => ({
    tokenIdx: index("token_idx").on(table.token),
  })
);

export const externalAccounts = sqliteTable(
  "external_accounts",
  {
    id: text("id")
      .primaryKey()
      .default(
        sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`
      ),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    type: text("type").notNull(),
    name: text("name").notNull(),
    lastFour: text("last_four"),
    balance: text("balance").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("external_accounts_userId_idx").on(table.userId),
  })
);

export const transactions = sqliteTable(
  "transactions",
  {
    id: text("id")
      .primaryKey()
      .default(
        sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`
      ),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id").references(() => externalAccounts.id, {
      onDelete: "cascade",
    }),
    amount: text("amount").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    type: text("type").notNull(),
    date: integer("date", { mode: "timestamp" }).notNull(),
    isExternal: integer("is_external", { mode: "boolean" })
      .default(sql`false`)
      .notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("transactions_userId_idx").on(table.userId),
    dateIdx: index("transactions_date_idx").on(table.date),
    accountIdIdx: index("transactions_accountId_idx").on(table.accountId),
  })
);

export const categories = sqliteTable(
  "categories",
  {
    id: text("id")
      .primaryKey()
      .default(
        sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`
      ),
    name: text("name").notNull().unique(),
    type: text("type").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    nameIdx: index("categories_name_idx").on(table.name),
  })
);

export const budgets = sqliteTable(
  "budgets",
  {
    id: text("id")
      .primaryKey()
      .default(
        sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`
      ),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    amount: text("amount").notNull(),
    period: text("period", { enum: ["monthly", "annual"] }).notNull(),
    startDate: integer("start_date", { mode: "timestamp" }).notNull(),
    endDate: integer("end_date", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("budgets_userId_idx").on(table.userId),
    categoryIdIdx: index("budgets_categoryId_idx").on(table.categoryId),
    dateIdx: index("budgets_date_idx").on(table.startDate, table.endDate),
  })
);

export const investments = sqliteTable(
  "investments",
  {
    id: text("id")
      .primaryKey()
      .default(
        sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`
      ),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    symbol: text("symbol").notNull(),
    name: text("name").notNull(),
    type: text("type", {
      enum: ["stock", "etf", "crypto", "bond", "mutual_fund"],
    }).notNull(),
    shares: text("shares").notNull(),
    averageCost: text("average_cost").notNull(),
    currentPrice: text("current_price").notNull(),
    lastUpdated: integer("last_updated", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("investments_userId_idx").on(table.userId),
    symbolIdx: index("investments_symbol_idx").on(table.symbol),
  })
);

export const dividends = sqliteTable(
  "dividends",
  {
    id: text("id")
      .primaryKey()
      .default(
        sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`
      ),
    investmentId: text("investment_id")
      .notNull()
      .references(() => investments.id, { onDelete: "cascade" }),
    amount: text("amount").notNull(),
    paymentDate: integer("payment_date", { mode: "timestamp" }).notNull(),
    reinvested: integer("reinvested", { mode: "boolean" })
      .default(sql`false`)
      .notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    investmentIdIdx: index("dividends_investmentId_idx").on(table.investmentId),
    paymentDateIdx: index("dividends_paymentDate_idx").on(table.paymentDate),
  })
);

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type ExternalAccount = typeof externalAccounts.$inferSelect;
export type NewExternalAccount = typeof externalAccounts.$inferInsert;
export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;
export type Investment = typeof investments.$inferSelect;
export type NewInvestment = typeof investments.$inferInsert;
export type Dividend = typeof dividends.$inferSelect;
export type NewDividend = typeof dividends.$inferInsert;

export const accountProviders = {
  credit: [
    {
      id: "amex",
      name: "American Express",
      cards: ["Platinum Card", "Gold Card", "Blue Cash"],
    },
    {
      id: "chase",
      name: "Chase",
      cards: ["Sapphire Reserve", "Freedom Unlimited", "Ink Business"],
    },
    {
      id: "citi",
      name: "Citi",
      cards: ["Double Cash", "Premier", "Custom Cash"],
    },
  ],
  bank: [
    { id: "chase", name: "Chase", accounts: ["Checking", "Savings"] },
    {
      id: "bofa",
      name: "Bank of America",
      accounts: ["Checking", "Savings", "Business"],
    },
    {
      id: "wells",
      name: "Wells Fargo",
      accounts: ["Everyday Checking", "Way2Save"],
    },
  ],
  investment: [
    {
      id: "fidelity",
      name: "Fidelity",
      accounts: ["Investment Account", "Roth IRA", "401(k)"],
    },
    {
      id: "vanguard",
      name: "Vanguard",
      accounts: ["Brokerage", "Roth IRA", "Traditional IRA"],
    },
    {
      id: "schwab",
      name: "Charles Schwab",
      accounts: ["Brokerage", "Retirement", "Checking"],
    },
  ],
} as const;

export const extendedCategories = [
  { name: "Dining & Restaurants", type: "expense" },
  { name: "Travel & Transportation", type: "expense" },
  { name: "Groceries", type: "expense" },
  { name: "Shopping & Retail", type: "expense" },
  { name: "Entertainment", type: "expense" },
  { name: "Bills & Utilities", type: "expense" },
  { name: "Health & Wellness", type: "expense" },
  { name: "Auto & Transport", type: "expense" },
  { name: "Home & Garden", type: "expense" },
  { name: "Education", type: "expense" },

  { name: "Direct Deposit", type: "income" },
  { name: "Interest Income", type: "income" },
  { name: "Transfers", type: "income" },
  { name: "Refunds", type: "income" },
  { name: "ATM Withdrawal", type: "expense" },
  { name: "Bank Fees", type: "expense" },
  { name: "Mortgage/Rent", type: "expense" },
  { name: "Insurance", type: "expense" },

  { name: "Dividend Income", type: "income" },
  { name: "Capital Gains", type: "income" },
  { name: "Investment Income", type: "income" },
  { name: "Stock Purchase", type: "expense" },
  { name: "Bond Purchase", type: "expense" },
  { name: "ETF Purchase", type: "expense" },
  { name: "Mutual Fund Purchase", type: "expense" },
  { name: "Trading Fees", type: "expense" },
];

export const defaultCategories = [
  { name: "Salary", type: "income" },
  { name: "Freelance", type: "income" },
  { name: "Investments", type: "income" },
  { name: "Other Income", type: "income" },
  { name: "Housing", type: "expense" },
  { name: "Transportation", type: "expense" },
  { name: "Food", type: "expense" },
  { name: "Utilities", type: "expense" },
  { name: "Healthcare", type: "expense" },
  { name: "Entertainment", type: "expense" },
  { name: "Shopping", type: "expense" },
  { name: "Education", type: "expense" },
  { name: "Savings", type: "expense" },
  { name: "Other Expenses", type: "expense" },
];
