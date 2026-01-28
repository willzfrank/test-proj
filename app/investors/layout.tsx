import DashboardLayout from "../dashboard/layout";

export default function InvestorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
