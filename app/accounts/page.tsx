import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectAccountDialog } from "@/components/dashboard/connect-account-dialog";
import { ManageAccountsDialog } from "@/components/dashboard/manage-accounts-dialog";
import { getTransactionData } from "../dashboard/actions";

export default async function AccountsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth");
  }

  const { accounts } = await getTransactionData();

  const totalBalance = accounts.reduce(
    (sum, account) => sum + Number(account.balance),
    0
  );

  const accountsByType = accounts.reduce((acc, account) => {
    acc[account.type] = acc[account.type] || [];
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, typeof accounts>);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
        <div className="flex items-center gap-4">
          <ConnectAccountDialog />
          <ManageAccountsDialog accounts={accounts} />
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
          </CardContent>
        </Card>

        {Object.entries(accountsByType).map(([type, typeAccounts]) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle>
                {type.charAt(0).toUpperCase() + type.slice(1)} Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {typeAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {account.provider}
                        {account.lastFour && ` •••• ${account.lastFour}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${Number(account.balance).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
