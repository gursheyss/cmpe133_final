import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { TransactionList } from "@/components/transaction-list";
import { AddTransactionDialog } from "@/components/dashboard/add-transaction-dialog";
import type { Transaction } from "@/db/schema";
import { getTransactionData } from "../dashboard/actions";

export default async function TransactionsPage() {
  const { transactions, categories } = await getTransactionData();

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

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <AddTransactionDialog categories={categories} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Monthly Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${monthlyIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${monthlyExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={transactions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview transactions={transactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
