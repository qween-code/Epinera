import { getWalletData } from "@/lib/data/wallet";
import { WalletView } from "@/components/wallet/WalletView";
import { redirect } from "next/navigation";

export default async function WalletPage() {
  const data = await getWalletData();

  if (!data) {
    // User not logged in
    redirect('/login');
  }

  return <WalletView initialBalance={data.wallet?.balance ?? 0} transactions={data.transactions || []} />;
}
