"use client";

import type { Transaction } from "@/db/schema";

import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Loader2, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table as TableRoot,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (transactionId: string) => {
    try {
      setLoadingId(transactionId);
      const response = await fetch("/api/transactions/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="relative">
      <TableRoot>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {format(new Date(transaction.date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell className="text-right">
                <span
                  className={
                    transaction.type === "expense"
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  {formatCurrency(Number.parseFloat(transaction.amount))}
                </span>
              </TableCell>
              <TableCell className="w-[50px]">
                {!transaction.isExternal && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(transaction.id)}
                    disabled={loadingId === transaction.id}
                  >
                    {loadingId === transaction.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2Icon className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </div>
  );
}
