"use client";

import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Transaction } from "@/db/schema";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const recentTransactions = sortedTransactions.slice(0, 10);

  return (
    <ScrollArea className="h-[350px] pr-4">
      <div className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="w-9 h-9">
                <div
                  className={`w-full h-full flex items-center justify-center ${
                    transaction.type === "income"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                </div>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {transaction.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.category}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <span
                className={`text-sm font-medium ${
                  transaction.type === "income"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.type === "income" ? "+" : ""}$
                {Math.abs(Number(transaction.amount)).toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(transaction.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
