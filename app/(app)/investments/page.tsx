import { InvestmentOverview } from "@/components/dashboard/investment-overview";
import { InvestmentList } from "@/components/dashboard/investment-list";
import { getInvestmentData } from "../dashboard/actions";
import { getUserExternalAccounts } from "@/db";
import { auth } from "@/lib/auth";
import { ManageAccountsDialog } from "@/components/dashboard/manage-accounts-dialog";
import { ConnectAccountDialog } from "@/components/dashboard/connect-account-dialog";

export default async function InvestmentsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const [investmentData, accounts] = await Promise.all([
    getInvestmentData(),
    getUserExternalAccounts(session.user.id),
  ]);

  const investmentAccounts = accounts.filter(
    (account) => account.type === "investment"
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Investments</h2>
        <div className="flex items-center gap-4">
          <ConnectAccountDialog />
          <ManageAccountsDialog accounts={investmentAccounts} />
        </div>
      </div>

      <InvestmentOverview {...investmentData} />
      <InvestmentList investments={investmentData.investments} />
    </div>
  );
}
