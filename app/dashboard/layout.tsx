"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import {
  LogOut,
  Search,
} from "lucide-react";
import NotificationsSidebar from "@/components/NotificationsSidebar";

const DashboardIcon = () => <Icon icon="mage:dashboard-plus" width="20" height="20" />;
const TransactionsIcon = () => <Icon icon="hugeicons:money-exchange-01" width="20" height="20" />;
const InvestmentsIcon = () => <Icon icon="uil:money-bill" width="20" height="20" />;
const UsersIcon = () => <Icon icon="hugeicons:user-multiple-02" width="20" height="20" />;
const ApprovalsIcon = () => <Icon icon="solar:like-broken" width="20" height="20" />;
const ReferralIcon = () => <Icon icon="hugeicons:user-switch" width="20" height="20" />;
const ReportsIcon = () => <Icon icon="streamline-pixel:content-files-note" width="20" height="20" />;
const AMLIcon = () => <Icon icon="hugeicons:money-security" width="20" height="20" />;
const AuditTrailIcon = () => <Icon icon="hugeicons:audit-02" width="20" height="20" />;
const NotificationsIcon = () => <Icon icon="line-md:bell" width="20" height="20" />;
const SettingsIcon = () => <Icon icon="hugeicons:settings-01" width="20" height="20" />;
const CustomerSupportIcon = () => <Icon icon="hugeicons:customer-service-01" width="20" height="20" />;

const navigationItems = [
  { name: "Dashboard", icon: DashboardIcon, href: "/dashboard" },
  { name: "Transactions", icon: TransactionsIcon, href: "/dashboard/transactions" },
  { name: "Investments", icon: InvestmentsIcon, href: "/dashboard/investments" },
  { name: "Investors", icon: UsersIcon, href: "/investors" },
  { name: "Investment Partners", icon: UsersIcon, href: "/investment-partners" },
  { name: "Approvals", icon: ApprovalsIcon, href: "/dashboard/approvals" },
  { name: "Referral", icon: ReferralIcon, href: "/dashboard/referral" },
  { name: "Reports", icon: ReportsIcon, href: "/dashboard/reports" },
  { name: "Anti-Money Laundering", icon: AMLIcon, href: "/dashboard/aml" },
  { name: "Audit Trail", icon: AuditTrailIcon, href: "/dashboard/audit-trail" },
  { name: "Notifications", icon: NotificationsIcon, href: "/dashboard/notifications", badge: 2 },
  { name: "Settings", icon: SettingsIcon, href: "/dashboard/settings" },
  { name: "Customer Support", icon: CustomerSupportIcon, href: "/dashboard/support" },
];

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <aside
        className="hidden lg:flex lg:w-64 flex-col fixed left-0 top-0 h-screen overflow-y-auto scrollbar-hide"
        style={{ background: "linear-gradient(180deg, #FF5461 0%, #970A14 100%)" }}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/bucksfield-logo.svg"
              alt="Bucksfield - ASSET MANAGEMENT LIMITED"
              width={180}
              height={36}
              priority
            />
        
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-sofia ${
                    isActive
                      ? "bg-white/20 text-white font-medium"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <IconComponent />
                  <span className="text-sm">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="mt-auto pt-6 border-t border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                MS
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm font-sofia">Michael Smith</p>
                <p className="text-white/70 text-xs font-sofia">Investment Officer</p>
              </div>
            </div>
            <Link
              href="/signin"
              className="flex items-center gap-3 px-4 py-3 mt-4 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors font-sofia"
            >
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col overflow-hidden w-full">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 w-full">
          <div className="flex items-center gap-4">
            <h1 className="text-primary-black font-sofia text-2xl font-semibold leading-normal whitespace-nowrap">
              {(() => {
                if (pathname === "/dashboard") return "Dashboard";
                if (pathname.startsWith("/investors")) return "Investors";
                if (pathname.startsWith("/investment-partners")) return "Investment Partners";
                return navigationItems.find(item => pathname.startsWith(item.href))?.name || "Dashboard";
              })()}
            </h1>
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for something"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F5F7FA] rounded-[40px] focus:outline-none focus:ring-2 focus:ring-red-500 font-sofia"
                />
              </div>
              <button className="p-3 bg-[#F5F7FA] hover:bg-gray-200 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer">
                <span className="text-[#444444]">
                  <SettingsIcon />
                </span>
              </button>
              <button 
                onClick={() => setIsNotificationsOpen(true)}
                className="p-3 bg-[#F5F7FA] hover:bg-gray-200 rounded-full transition-all duration-200 relative flex items-center justify-center cursor-pointer"
              >
                <span className="text-[#444444]">
                  <NotificationsIcon />
                </span>
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold text-sm">
                  MS
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 w-full">{children}</main>
      </div>

      {/* Notifications Sidebar */}
      <NotificationsSidebar
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
