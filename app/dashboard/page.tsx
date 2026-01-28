"use client";

import { useState } from "react";
import { SummaryCard, Pagination } from "@/components/investors";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreVertical, Calendar } from "lucide-react";
import { Icon } from "@iconify/react";
import Button from "@/components/Button";
import InvestmentTypeCard from "@/components/InvestmentTypeCard";
import TransactionDetailsSidebar from "@/components/TransactionDetailsSidebar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, AreaChart, Area, BarChart, Bar } from "recharts";

type RechartsDotLikeProps = {
  cx?: number;
  cy?: number;
};

type RechartsTooltipLikeProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: number }>;
};

function InvestmentOverviewTooltip(props: unknown) {
  const { active, payload } = props as RechartsTooltipLikeProps & {
    payload?: ReadonlyArray<{ value?: number }>;
  };
  const value = payload?.[0]?.value;
  if (!active || typeof value !== "number") return null;

  return (
    <div className="bg-primary-red text-white px-3 py-2 rounded text-xs font-sofia">
      <p>₦{value.toLocaleString()}</p>
    </div>
  );
}

function InvestmentOverviewDot({ cx, cy }: RechartsDotLikeProps) {
  if (typeof cx !== "number" || typeof cy !== "number") return null;
  return <ellipse cx={cx} cy={cy} rx={10.0115} ry={8} fill="white" stroke="#BB0613" strokeWidth={4} />;
}

// Investment Overview Card
const InvestmentOverviewCard = () => {
  const months = ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB"];
  const chartData = [
    { month: "SEP", value: 20 },
    { month: "OCT", value: 35 },
    { month: "NOV", value: 45 },
    { month: "DEC", value: 60 },
    { month: "JAN", value: 75 },
    { month: "FEB", value: 80 },
  ];

  return (
    <div className="bg-white rounded-[14px] p-6" style={{ boxShadow: '6px 6px 54px 0 rgba(0, 0, 0, 0.05)' }}>
      <div className="flex items-center justify-between mb-6">
        <Select defaultValue="this-year">
          <SelectTrigger className="flex h-12 px-4 items-center gap-2 rounded-xl border border-neutral-grey-100 bg-white shadow-none">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-secondary-text" />
                <span className="text-secondary-text text-sm font-normal font-sofia leading-5">This year</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-year">This year</SelectItem>
            <SelectItem value="last-year">Last year</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex w-[33px] h-[33px] p-[5px_4px_4px_5px] justify-center items-center rounded-[10px] bg-[#F4F7FE]">
          <Icon icon="heroicons:chart-bar-solid" width="24" height="24" className="text-primary-red" />
        </div>
      </div>
      
      <div className="flex items-start gap-[60px] mb-6">
        {/* Left: Investment Amount Container */}
        <div className="shrink-0">
          <p className="text-primary-red text-[34px] font-bold font-sofia leading-[42px] tracking-[-0.68px] mb-2">₦37.5M</p>
          <div className="flex items-center gap-1">
            <p className="text-secondary-text text-sm font-normal font-sofia">Investments</p>
            <Icon icon="raphael:arrowup" width="17" height="17" style={{ color: "#25A969" }} />
            <span className="text-[#25A969] text-sm font-semibold font-sofia">+2.45%</span>
          </div>
        </div>

        {/* Right: Chart */}
        <div className="flex-1 h-[200px] -mx-6 px-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={false}
                hide={true}
              />
              <Tooltip content={InvestmentOverviewTooltip} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#BB0613" 
                strokeWidth={4}
                dot={InvestmentOverviewDot}
                activeDot={InvestmentOverviewDot}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flex justify-between mt-4 text-xs text-primary-black opacity-60 font-sofia">
        {months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
};

// Investment Growth Card
const InvestmentGrowthCard = ({ title, currency, data }: { title: string; currency: string; data: number[] }) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  // Treat incoming numbers as "k" units so it matches the Figma scale (0–500k)
  const chartData = months.map((month, index) => ({
    month,
    value: (data[index] || 0) * 1000,
  }));

  const lineColor = currency === "₦" ? "#00B69B" : "#F93C65";
  const gradientId = `gradient-${currency === "₦" ? "naira" : "dollar"}`;

  return (
    <div className="bg-white rounded-[14px] p-6" style={{ boxShadow: '6px 6px 54px 0 rgba(0, 0, 0, 0.05)' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 
          className="text-primary-black text-base font-normal font-sofia leading-6 tracking-[-0.16px]"
          style={{
            fontFeatureSettings: "'liga' off, 'clig' off",
          }}
        >
          {title}
        </h3>
        <Select defaultValue="this-year">
          <SelectTrigger className="flex h-12 px-4 items-center gap-2 rounded-xl border border-neutral-grey-100 bg-white shadow-none">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-secondary-text" />
                <span className="text-secondary-text text-sm font-normal font-sofia leading-5">This year</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-year">This year</SelectItem>
            <SelectItem value="last-year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 6" stroke="#EEEEF1" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#5A607F", fontSize: 14, fontFamily: "Sofia Pro" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={50}
              ticks={[0, 50000, 100000, 200000, 500000]}
              domain={[0, 500000]}
              tick={{ fill: "#5A607F", fontSize: 12, fontFamily: "Sofia Pro" }}
              tickFormatter={(v) => {
                if (v === 0) return "0";
                return `${Math.round(v / 1000)}k`;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={lineColor} 
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Wallet Withdrawals Card
const WalletWithdrawalsCard = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // Values in 0–30k range so bars are visible on Y-axis (0, 10k, 20k, 30k)
  const values = [5000, 12000, 8000, 15000, 10000, 22000, 7000, 18000, 9000, 14000, 6000, 25000];
  const chartData = months.map((month, index) => ({
    month,
    value: values[index] ?? 0,
  }));

  return (
    <div className="bg-white rounded-[14px] p-6" style={{ boxShadow: '6px 6px 54px 0 rgba(0, 0, 0, 0.05)' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 
          className="text-primary-black text-base font-semibold font-sofia leading-5"
          style={{
            fontFeatureSettings: "'liga' off, 'clig' off",
            letterSpacing: 0,
          }}
        >
          Wallet Withdrawals
        </h3>
        <Select defaultValue="this-year">
          <SelectTrigger className="flex h-12 px-4 items-center gap-2 rounded-xl border border-neutral-grey-100 bg-white shadow-none">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-secondary-text" />
                <span className="text-secondary-text text-sm font-normal font-sofia leading-5">This year</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-year">This year</SelectItem>
            <SelectItem value="last-year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="4 6" stroke="#EEEEF1" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#5A607F", fontSize: 12, fontFamily: "Sofia Pro" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={50}
              ticks={[0, 10000, 20000, 30000]}
              domain={[0, 30000]}
              tick={{ fill: "#5A607F", fontSize: 12, fontFamily: "Sofia Pro" }}
              tickFormatter={(v) => {
                if (v === 0) return "0";
                return `${Math.round(v / 1000)}k`;
              }}
            />
            <Bar 
              dataKey="value" 
              fill="#25A969" 
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<{
    id: string;
    investor: string;
    email: string;
    accountNumber: string;
    amount: string;
    type: string;
    date: string;
    status: "Successful" | "Pending" | "Failed";
  } | null>(null);
  const itemsPerPage = 10;

  // Mock transaction data
  const transactions: {
    id: string;
    investor: string;
    email: string;
    accountNumber: string;
    amount: string;
    type: string;
    date: string;
    status: "Successful" | "Pending" | "Failed";
  }[] = [
    {
      id: "1",
      investor: "Daniel Olumide",
      email: "danielolumide@gmail.com",
      accountNumber: "12345678901",
      amount: "₦1,000,000,000",
      type: "Wallet Topup",
      date: "24-05-2025",
      status: "Successful",
    },
    {
      id: "2",
      investor: "Daniel Olumide",
      email: "danielolumide@gmail.com",
      accountNumber: "12345678901",
      amount: "₦1,000,000,000",
      type: "Wallet Withdrawal",
      date: "24-05-2025",
      status: "Pending",
    },
    {
      id: "3",
      investor: "Daniel Olumide",
      email: "danielolumide@gmail.com",
      accountNumber: "12345678901",
      amount: "₦1,000,000,000",
      type: "Wallet Topup",
      date: "24-05-2025",
      status: "Failed",
    },
    {
      id: "4",
      investor: "Daniel Olumide",
      email: "danielolumide@gmail.com",
      accountNumber: "12345678901",
      amount: "₦1,000,000,000",
      type: "Wallet Topup",
      date: "24-05-2025",
      status: "Successful",
    },
  ];

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  // Summary cards data
  const summaryCards = [
    {
      title: "Total Investors",
      value: "40,689",
      trend: "8.5% Up from yesterday",
      icon: (
        <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.587821" d="M23.9995 6.66699C26.2087 6.66699 27.9995 8.45785 27.9995 10.667C27.9993 12.876 26.2085 14.667 23.9995 14.667C21.7906 14.6668 19.9997 12.8759 19.9995 10.667C19.9995 8.45796 21.7905 6.66717 23.9995 6.66699ZM11.9995 0C14.9449 0 17.3333 2.38764 17.3335 5.33301C17.3335 8.27853 14.945 10.667 11.9995 10.667C9.05414 10.6668 6.6665 8.27842 6.6665 5.33301C6.66668 2.38775 9.05425 0.000175999 11.9995 0Z" fill="#8280FF"/>
          <path d="M11.9774 13.3335C18.3611 13.3335 23.6061 16.391 23.997 22.9331C24.0125 23.1937 23.9966 24.0005 22.995 24.0005H0.969619C0.635144 24.0001 -0.0272745 23.2787 0.000869049 22.9321C0.517816 16.5688 5.68241 13.3336 11.9774 13.3335ZM23.4686 16.0024C28.0103 16.0523 31.7187 18.3471 31.9979 23.1997C32.0092 23.3952 31.9977 24.0005 31.2743 24.0005H26.1337C26.1337 20.9998 25.1416 18.2305 23.4686 16.0024Z" fill="#8280FF"/>
        </svg>
      ),
      iconBgColor: "bg-purple-100",
    },
    {
      title: "Total Investment Plans",
      value: "10,234",
      trend: "1.3% Up from past week",
      icon: (
        <svg width="30" height="34" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M0 11.3167L12.9005 18.7648C13.0394 18.845 13.1851 18.9029 13.3333 18.9397V33.3849L0.920065 26.0387C0.349784 25.7012 0 25.0878 0 24.4251V11.3167ZM30 11.1187V24.4251C30 25.0878 29.6502 25.7012 29.0799 26.0387L16.6667 33.3849V18.8131C16.6969 18.798 16.7269 18.7819 16.7566 18.7648L30 11.1187Z" fill="#FEC53D"/>
          <path opacity="0.499209" fillRule="evenodd" clipRule="evenodd" d="M0.405273 7.70142C0.562849 7.50244 0.761736 7.33426 0.993616 7.21076L14.1186 0.2201C14.6696 -0.0733665 15.3305 -0.0733665 15.8815 0.2201L29.0065 7.21076C29.1852 7.30596 29.3444 7.42771 29.4801 7.56966L15.0899 15.8778C14.9953 15.9325 14.9081 15.995 14.8286 16.064C14.7491 15.995 14.6618 15.9325 14.5672 15.8778L0.405273 7.70142Z" fill="#FEC53D"/>
        </svg>
      ),
      iconBgColor: "bg-yellow-100",
    },
    {
      title: "Naira Investments",
      value: "₦100,000,000",
      trend: "4.3% Down from yesterday",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.11111 24.8889H26.4444C27.3036 24.8889 28 25.5853 28 26.4444C28 27.3036 27.3036 28 26.4444 28H1.55556C0.696446 28 0 27.3036 0 26.4444V1.55556C0 0.696446 0.696446 0 1.55556 0C2.41467 0 3.11111 0.696446 3.11111 1.55556V24.8889Z" fill="#25A969"/>
          <path opacity="0.5" d="M8.91305 18.175C8.32547 18.8017 7.34106 18.8335 6.71431 18.2459C6.08756 17.6583 6.0558 16.6739 6.64338 16.0472L12.4767 9.82494C13.045 9.21879 13.9893 9.16623 14.6213 9.70555L19.2253 13.6343L25.224 6.03606C25.7563 5.36176 26.7345 5.24668 27.4088 5.77903C28.0831 6.31137 28.1982 7.28955 27.6658 7.96385L20.6658 16.8305C20.1191 17.5231 19.1063 17.6227 18.4351 17.0499L13.7311 13.0358L8.91305 18.175Z" fill="#25A969"/>
        </svg>
      ),
      iconBgColor: "bg-green-100",
    },
    {
      title: "Dollar Investments",
      value: "$100,000",
      trend: "4.3% Down from yesterday",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.11111 24.8889H26.4444C27.3036 24.8889 28 25.5853 28 26.4444C28 27.3036 27.3036 28 26.4444 28H1.55556C0.696446 28 0 27.3036 0 26.4444V1.55556C0 0.696446 0.696446 0 1.55556 0C2.41467 0 3.11111 0.696446 3.11111 1.55556V24.8889Z" fill="#F93C65"/>
          <path opacity="0.5" d="M8.91305 18.175C8.32547 18.8017 7.34106 18.8335 6.71431 18.2459C6.08756 17.6583 6.0558 16.6739 6.64338 16.0472L12.4767 9.82494C13.045 9.21879 13.9893 9.16623 14.6213 9.70555L19.2253 13.6343L25.224 6.03606C25.7563 5.36176 26.7345 5.24668 27.4088 5.77903C28.0831 6.31137 28.1982 7.28955 27.6658 7.96385L20.6658 16.8305C20.1191 17.5231 19.1063 17.6227 18.4351 17.0499L13.7311 13.0358L8.91305 18.175Z" fill="#F93C65"/>
        </svg>
      ),
      iconBgColor: "bg-red-100",
    },
  ];

  // Investment types data
  const investmentTypes = [
    { title: "Equities", investors: "200 Investors", value: "N1,000,000.00" },
    { title: "Commercial", investors: "200 Investors", value: "N1,000,000.00" },
    { title: "Fixed Deposit Note", investors: "200 Investors", value: "N1,000,000.00" },
    { title: "Mutual Funds", investors: "200 Investors", value: "N1,000,000.00" },
  ];

  // Chart data
  const nairaGrowthData = [20, 35, 45, 60, 75];
  const dollarGrowthData = [25, 40, 50, 65, 80];

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium font-sofia";
    if (status === "Successful") {
      return `${baseClasses} bg-[#E7F6EC] text-[#25A969]`;
    } else if (status === "Pending") {
      return `${baseClasses} bg-yellow-100 text-yellow-700`;
    } else {
      return `${baseClasses} bg-red-100 text-red-700`;
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <SummaryCard key={index} {...card} />
        ))}
      </div>

      {/* Investment Overview */}
      <InvestmentOverviewCard />

      {/* Investment Growth Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InvestmentGrowthCard title="Naira Investment Growth" currency="₦" data={nairaGrowthData} />
        <InvestmentGrowthCard title="Dollar Investment Growth" currency="$" data={dollarGrowthData} />
      </div>

      {/* Wallet Withdrawals */}
      <WalletWithdrawalsCard />

      {/* Investment Types Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 
            className="text-[#444] text-lg font-semibold font-sofia leading-6 tracking-[-0.18px]"
            style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
          >
            Investment Types
          </h2>
          <div className="flex items-end gap-3">
            <Button 
              variant="secondary" 
              className="!w-auto !border !border-[#BB0613] !text-[#BB0613] !bg-transparent hover:!bg-red-50"
              style={{ backgroundColor: 'transparent', color: '#BB0613', border: '1px solid #BB0613' }}
            >
              Interest Settings
            </Button>
            <Button variant="primary" className="!w-auto">
              Add New Investment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {investmentTypes.map((type, index) => (
            <InvestmentTypeCard
              key={index}
              title={type.title}
              investors={type.investors}
              value={type.value}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <button 
            className="text-[#BB0613] text-sm font-normal font-sofia leading-5 tracking-[-0.14px] flex items-center gap-1 hover:underline cursor-pointer"
            style={{
              fontFeatureSettings: "'liga' off, 'clig' off",
            }}
          >
            View All Investment Types
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="#BB0613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <h2 className="text-[#333] text-base font-bold font-sofia leading-6">Recent Transactions</h2>
        
        <div className="bg-white rounded-[14px] overflow-hidden" style={{ boxShadow: '6px 6px 54px 0 rgba(0, 0, 0, 0.05)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-4 text-left text-primary-black text-sm font-semibold font-sofia">Investor</th>
                  <th className="px-6 py-4 text-left text-primary-black text-sm font-semibold font-sofia">Email Address</th>
                  <th className="px-6 py-4 text-left text-primary-black text-sm font-semibold font-sofia">Account Number</th>
                  <th className="px-6 py-4 text-left text-primary-black text-sm font-semibold font-sofia">Amount</th>
                  <th className="px-6 py-4 text-left text-primary-black text-sm font-semibold font-sofia">Transaction Type</th>
                  <th className="px-6 py-4 text-left text-primary-black text-sm font-semibold font-sofia">Transaction Date</th>
                  <th className="px-6 py-4 text-left text-primary-black text-sm font-semibold font-sofia">Status</th>
                  <th className="px-6 py-4 text-left text-primary-black text-sm font-semibold font-sofia">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-4 text-primary-black text-sm font-normal font-sofia">{transaction.investor}</td>
                    <td className="px-6 py-4 text-primary-black text-sm font-normal font-sofia">{transaction.email}</td>
                    <td className="px-6 py-4 text-primary-black text-sm font-normal font-sofia">{transaction.accountNumber}</td>
                    <td className="px-6 py-4 text-primary-black text-sm font-normal font-sofia">{transaction.amount}</td>
                    <td className="px-6 py-4 text-primary-black text-sm font-normal font-sofia">{transaction.type}</td>
                    <td className="px-6 py-4 text-primary-black text-sm font-normal font-sofia">{transaction.date}</td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(transaction.status)}>{transaction.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedTransaction(transaction)}
                        className="text-primary-black opacity-50 hover:opacity-100 cursor-pointer"
                      >
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Transaction Details Sidebar */}
      <TransactionDetailsSidebar
        isOpen={selectedTransaction !== null}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />
    </div>
  );
}
