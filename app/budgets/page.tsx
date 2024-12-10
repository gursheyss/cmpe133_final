import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { AddBudgetDialog } from "@/components/dashboard/add-budget-dialog";
import { getBudgetData } from "../dashboard/actions";

export default async function BudgetsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth");
  }

  const { budgets, categories } = await getBudgetData();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
        <AddBudgetDialog categories={categories} />
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetProgress budgets={budgets} categories={categories} />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget) => {
            const category = categories.find((c) => c.id === budget.categoryId);
            const totalSpent = budget.totalSpent;
            const remaining = Number(budget.amount) - totalSpent;
            const percentUsed = (totalSpent / Number(budget.amount)) * 100;

            return (
              <Card key={budget.id}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    {category?.name} Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Spent
                      </span>
                      <span className="font-medium">
                        ${totalSpent.toFixed(2)} / $
                        {Number(budget.amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Remaining
                      </span>
                      <span
                        className={
                          remaining >= 0 ? "text-green-500" : "text-red-500"
                        }
                      >
                        ${Math.abs(remaining).toFixed(2)}
                        {remaining < 0 ? " over budget" : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Progress
                      </span>
                      <span
                        className={
                          percentUsed > 100 ? "text-red-500" : "text-green-500"
                        }
                      >
                        {percentUsed.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
