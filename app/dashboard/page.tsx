import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { TransactionList } from "@/components/transaction-list";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  getTransactionData,
  getBudgetData,
  getInvestmentData,
} from "./actions";
import { initializeDefaultCategories } from "@/db";
import type { Transaction } from "@/db/schema";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth");
  }

  await initializeDefaultCategories();

  const [{ transactions, accounts }, { budgets }, investmentData] =
    await Promise.all([
      getTransactionData(),
      getBudgetData(),
      getInvestmentData(),
    ]);

  const totalBalance = transactions.reduce(
    (sum: number, t: Transaction) => sum + Number(t.amount),
    0
  );

  const monthlyIncome = transactions
    .filter(
      (t: Transaction) =>
        t.type === "income" &&
        new Date(t.date).getMonth() === new Date().getMonth()
    )
    .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

  const monthlyExpenses = Math.abs(
    transactions
      .filter(
        (t: Transaction) =>
          t.type === "expense" &&
          new Date(t.date).getMonth() === new Date().getMonth()
      )
      .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)
  );

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthBalance = transactions
    .filter(
      (t: Transaction) => new Date(t.date).getMonth() === lastMonth.getMonth()
    )
    .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

  const monthlyChange =
    lastMonthBalance !== 0
      ? ((totalBalance - lastMonthBalance) / Math.abs(lastMonthBalance)) * 100
      : 0;

  const overBudgetCount = budgets.filter(
    (budget) => budget.percentageUsed > 100
  ).length;

  const accountBalance = accounts.reduce(
    (sum, account) => sum + Number(account.balance),
    0
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${accountBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthlyChange >= 0 ? "+" : ""}
              {monthlyChange.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Income
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${monthlyIncome.toFixed(2)}
            </div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              This month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Expenses
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${monthlyExpenses.toFixed(2)}
            </div>
            <div className="flex items-center text-xs text-red-500">
              <ArrowDownRight className="h-4 w-4" />
              This month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Investment Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${investmentData.totalValue.toFixed(2)}
            </div>
            <div
              className={`flex items-center text-xs ${
                investmentData.totalGainLossPercent >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {investmentData.totalGainLossPercent >= 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {investmentData.totalGainLossPercent.toFixed(1)}% total return
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview transactions={transactions} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={transactions.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overBudgetCount} / {budgets.length}
            </div>
            <p className="text-sm text-muted-foreground">
              {overBudgetCount
                ? `${overBudgetCount} categories over budget`
                : "All budgets on track"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
            <p className="text-sm text-muted-foreground">
              {accounts.length
                ? `${accounts.length} accounts connected`
                : "No accounts connected"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investment Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {investmentData.investments.length}
            </div>
            <p className="text-sm text-muted-foreground">
              {investmentData.investments.length
                ? `${investmentData.investments.length} investments tracked`
                : "No investments tracked"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
