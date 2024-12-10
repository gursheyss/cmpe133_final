"use server";

import { auth } from "@/lib/auth";
import {
  addTransaction,
  getCategories,
  getUserTransactions,
  addExternalAccount,
  addExternalTransactions,
  getUserExternalAccounts,
  getUserBudgets,
  addBudget,
  getBudgetSpending,
  deleteBudget as deleteBudgetFromDb,
  updateBudget as updateBudgetInDb,
} from "@/db";
import { revalidatePath } from "next/cache";
import { extendedCategories } from "@/db/schema";

export async function createTransaction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const amount = Number.parseFloat(formData.get("amount") as string);
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const type = formData.get("type") as "income" | "expense";
  const date = formData.get("date")
    ? new Date(formData.get("date") as string)
    : new Date();

  if (!amount || !description || !category || !type) {
    throw new Error("Missing required fields");
  }

  await addTransaction(session.user.id, {
    amount,
    description,
    category,
    type,
    date,
  });

  revalidatePath("/dashboard");
}

export async function getTransactionData() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const [transactions, categories, accounts] = await Promise.all([
    getUserTransactions(session.user.id),
    getCategories(),
    getUserExternalAccounts(session.user.id),
  ]);

  return {
    transactions,
    categories,
    accounts,
  };
}

interface MockTransaction {
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense";
  date: Date;
}

function generateMockTransactions(
  accountType: string,
  startDate: Date = new Date()
): MockTransaction[] {
  const transactions: MockTransaction[] = [];
  const numberOfTransactions = Math.floor(Math.random() * 20) + 30;

  const relevantCategories = extendedCategories.filter((cat) => {
    if (accountType === "credit")
      return [
        "Dining & Restaurants",
        "Travel & Transportation",
        "Shopping & Retail",
        "Entertainment",
      ].includes(cat.name);
    if (accountType === "bank")
      return [
        "Direct Deposit",
        "ATM Withdrawal",
        "Mortgage/Rent",
        "Insurance",
      ].includes(cat.name);
    if (accountType === "investment")
      return [
        "Dividend Income",
        "Stock Purchase",
        "ETF Purchase",
        "Trading Fees",
      ].includes(cat.name);
    return false;
  });

  for (let i = 0; i < numberOfTransactions; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));

    const category =
      relevantCategories[Math.floor(Math.random() * relevantCategories.length)];
    const isExpense = category.type === "expense";

    let amount: number;
    if (accountType === "credit") {
      amount = Math.random() * 200 + 10;
    } else if (accountType === "bank") {
      amount = isExpense
        ? Math.random() * 1000 + 100
        : Math.random() * 3000 + 2000;
    } else {
      amount = isExpense
        ? Math.random() * 5000 + 1000
        : Math.random() * 1000 + 100;
    }

    transactions.push({
      amount: Number(amount.toFixed(2)),
      description: generateDescription(category.name),
      category: category.name,
      type: category.type as "income" | "expense",
      date,
    });
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

function generateDescription(category: string): string {
  const descriptions: Record<string, string[]> = {
    "Dining & Restaurants": [
      "Starbucks",
      "Chipotle",
      "Local Restaurant",
      "Pizza Delivery",
      "Sushi Bar",
    ],
    "Travel & Transportation": [
      "Uber",
      "Lyft",
      "Airlines Ticket",
      "Hotel Stay",
      "Car Rental",
    ],
    "Shopping & Retail": [
      "Amazon",
      "Target",
      "Walmart",
      "Best Buy",
      "Apple Store",
    ],
    Entertainment: [
      "Netflix",
      "Movie Theater",
      "Concert Tickets",
      "Spotify",
      "Gaming",
    ],
    "Direct Deposit": ["Salary", "Payroll", "Company Name Deposit"],
    "ATM Withdrawal": ["ATM Withdrawal", "Cash Withdrawal"],
    "Mortgage/Rent": ["Monthly Rent", "Mortgage Payment"],
    Insurance: ["Car Insurance", "Home Insurance", "Health Insurance"],
    "Dividend Income": [
      "Stock Dividend",
      "ETF Distribution",
      "Fund Distribution",
    ],
    "Stock Purchase": ["AAPL Share", "GOOGL Share", "MSFT Share", "AMZN Share"],
    "ETF Purchase": ["VOO Share", "VTI Share", "QQQ Share", "SPY Share"],
    "Trading Fees": ["Commission", "Exchange Fee", "Trading Fee"],
  };

  const options = descriptions[category] || ["Transaction"];
  return options[Math.floor(Math.random() * options.length)];
}

export async function connectExternalAccount(data: {
  type: "credit" | "bank" | "investment";
  provider: string;
  account: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const balance =
    data.type === "credit"
      ? Math.random() * 5000 + 1000
      : data.type === "bank"
      ? Math.random() * 20000 + 5000
      : Math.random() * 100000 + 50000;

  const account = await addExternalAccount(session.user.id, {
    provider: data.provider,
    type: data.type,
    name: data.account,
    lastFour: Math.floor(Math.random() * 9000 + 1000).toString(),
    balance,
  });

  const mockTransactions = generateMockTransactions(data.type);
  await addExternalTransactions(session.user.id, account.id, mockTransactions);

  revalidatePath("/dashboard");
}

export async function getBudgetData() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const [budgets, categories] = await Promise.all([
    getUserBudgets(session.user.id),
    getCategories(),
  ]);

  const budgetsWithSpending = await Promise.all(
    budgets.map(async (budget) => {
      if (!session.user?.id) throw new Error("Not authenticated");
      const spending = await getBudgetSpending(session.user.id, budget);
      return {
        ...budget,
        ...spending,
      };
    })
  );

  return {
    budgets: budgetsWithSpending,
    categories,
  };
}

export async function createBudget(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const amount = Number.parseFloat(formData.get("amount") as string);
  const categoryId = formData.get("categoryId") as string;
  const period = formData.get("period") as "monthly" | "annual";
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = new Date(formData.get("endDate") as string);

  if (!amount || !categoryId || !period || !startDate || !endDate) {
    throw new Error("Missing required fields");
  }

  await addBudget(session.user.id, {
    amount,
    categoryId,
    period,
    startDate,
    endDate,
  });

  revalidatePath("/dashboard");
}

export async function deleteBudget(budgetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await deleteBudgetFromDb(session.user.id, budgetId);
  revalidatePath("/dashboard");
}

export async function updateBudget(budgetId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const amount = formData.get("amount")
    ? Number.parseFloat(formData.get("amount") as string)
    : undefined;
  const categoryId = (formData.get("categoryId") as string) || undefined;
  const period = (formData.get("period") as "monthly" | "annual") || undefined;
  const startDate = formData.get("startDate")
    ? new Date(formData.get("startDate") as string)
    : undefined;
  const endDate = formData.get("endDate")
    ? new Date(formData.get("endDate") as string)
    : undefined;

  await updateBudgetInDb(session.user.id, budgetId, {
    amount,
    categoryId,
    period,
    startDate,
    endDate,
  });

  revalidatePath("/dashboard");
}
