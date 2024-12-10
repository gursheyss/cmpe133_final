"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Budget, Category } from "@/db/schema";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { EditBudgetDialog } from "./edit-budget-dialog";
import { deleteBudget } from "@/app/(app)/dashboard/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BudgetWithSpending extends Budget {
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
}

interface BudgetProgressProps {
  budgets: BudgetWithSpending[];
  categories: Category[];
}

export function BudgetProgress({ budgets, categories }: BudgetProgressProps) {
  if (!budgets.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No budgets set. Create a budget to track your spending.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {budgets.map((budget) => {
          const category = categories.find((c) => c.id === budget.categoryId);
          const isOverBudget = budget.percentageUsed > 100;

          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium tracking-tight">
                      {category?.name} Budget
                    </h3>
                    <div className="flex items-center gap-1">
                      <EditBudgetDialog
                        budget={budget}
                        categories={categories}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this budget? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteBudget(budget.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(budget.startDate), "MMM d, yyyy")} -{" "}
                    {format(new Date(budget.endDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ${budget.totalSpent.toFixed(2)} / $
                    {Number(budget.amount).toFixed(2)}
                  </div>
                  <p
                    className={`text-sm ${
                      isOverBudget ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {isOverBudget
                      ? `$${Math.abs(budget.remainingBudget).toFixed(
                          2
                        )} over budget`
                      : `$${budget.remainingBudget.toFixed(2)} remaining`}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "h-2 w-full rounded-full",
                  isOverBudget ? "bg-red-100" : "bg-secondary"
                )}
              >
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    isOverBudget ? "bg-red-500" : "bg-primary"
                  )}
                  style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
