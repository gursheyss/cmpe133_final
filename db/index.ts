import { drizzle } from "drizzle-orm/libsql";
import { eq, desc, and } from "drizzle-orm";
import {
  transactions,
  categories,
  externalAccounts,
  type NewTransaction,
  type NewExternalAccount,
  extendedCategories,
  defaultCategories,
} from "./schema";
import * as schema from "./schema";

export const db = drizzle({
  connection: {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    url: process.env.TURSO_CONNECTION_URL!,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  schema: schema,
});

export async function getUserTransactions(userId: string) {
  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date));
}

export async function addTransaction(
  userId: string,
  data: {
    amount: number;
    description: string;
    category: string;
    type: "income" | "expense";
    date?: Date;
  }
) {
  const amount =
    data.type === "expense" ? -Math.abs(data.amount) : Math.abs(data.amount);

  const newTransaction: NewTransaction = {
    userId,
    amount: amount.toString(),
    description: data.description,
    category: data.category,
    type: data.type,
    date: data.date || new Date(),
    isExternal: false,
  };

  return await db.insert(transactions).values(newTransaction);
}

export async function getCategories() {
  return await db.select().from(categories).orderBy(desc(categories.name));
}

export async function initializeDefaultCategories() {
  const existingCategories = await getCategories();

  if (existingCategories.length === 0) {
    for (const category of defaultCategories) {
      await db.insert(categories).values({
        name: category.name,
        type: category.type,
      });
    }

    for (const category of extendedCategories) {
      await db.insert(categories).values({
        name: category.name,
        type: category.type,
      });
    }
  }
}

export async function getUserExternalAccounts(userId: string) {
  return await db
    .select()
    .from(externalAccounts)
    .where(eq(externalAccounts.userId, userId))
    .orderBy(desc(externalAccounts.createdAt));
}

export async function addExternalAccount(
  userId: string,
  data: {
    provider: string;
    type: "credit" | "bank" | "investment";
    name: string;
    lastFour?: string;
    balance: number;
  }
) {
  const newAccount: NewExternalAccount = {
    userId,
    provider: data.provider,
    type: data.type,
    name: data.name,
    lastFour: data.lastFour,
    balance: data.balance.toString(),
  };

  const [account] = await db
    .insert(externalAccounts)
    .values(newAccount)
    .returning();
  return account;
}

export async function addExternalTransactions(
  userId: string,
  accountId: string,
  transactions: Array<{
    amount: number;
    description: string;
    category: string;
    type: "income" | "expense";
    date: Date;
  }>
) {
  const newTransactions = transactions.map((t) => ({
    userId,
    accountId,
    amount: (t.type === "expense"
      ? -Math.abs(t.amount)
      : Math.abs(t.amount)
    ).toString(),
    description: t.description,
    category: t.category,
    type: t.type,
    date: t.date,
    isExternal: true,
  }));

  return await db.insert(schema.transactions).values(newTransactions);
}

export async function getAccountTransactions(
  userId: string,
  accountId: string
) {
  return await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.accountId, accountId)
      )
    )
    .orderBy(desc(transactions.date));
}

export async function disconnectExternalAccount(
  userId: string,
  accountId: string
) {
  return await db.transaction(async (tx) => {
    await tx
      .delete(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.accountId, accountId)
        )
      );

    const result = await tx
      .delete(externalAccounts)
      .where(
        and(
          eq(externalAccounts.userId, userId),
          eq(externalAccounts.id, accountId)
        )
      )
      .returning();

    if (!result.length) {
      throw new Error("Account not found");
    }

    return result[0];
  });
}

export async function deleteTransaction(userId: string, transactionId: string) {
  return await db
    .delete(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.id, transactionId),
        eq(transactions.isExternal, false)
      )
    );
}
