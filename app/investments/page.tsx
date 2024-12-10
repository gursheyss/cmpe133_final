import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { InvestmentOverview } from "@/components/dashboard/investment-overview";
import { InvestmentList } from "@/components/dashboard/investment-list";
import { getInvestmentData } from "../dashboard/actions";

export default async function InvestmentsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth");
  }

  const investmentData = await getInvestmentData();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Investments</h2>
      </div>

      <InvestmentOverview {...investmentData} />
      <InvestmentList investments={investmentData.investments} />
    </div>
  );
}
