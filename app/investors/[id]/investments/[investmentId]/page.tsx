"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Wallet,
  TrendingUp,
  ArrowDown,
  ArrowUp,
  Search,
  Filter,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Building2,
  X,
} from "lucide-react";
import Button from "@/components/Button";
import { SummaryCard } from "@/components/investors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";

interface Transaction {
  id: string;
  transactionType: string;
  investmentType: string;
  ticker: string;
  amount: string;
  transactionId: string;
  transactionDate: string;
  status: "Successful" | "Pending" | "Failed";
  // Additional details for transaction details panel
  investor?: string;
  email?: string;
  phone?: string;
  accountNumber?: string;
  unitsPurchased?: string;
  issuer?: string;
  sector?: string;
  maturityDate?: string;
  investmentStatus?: string;
  investmentDate?: string;
  source?: string;
}

interface InvestmentNote {
  id: string;
  name: string;
  amount: string;
  investmentDate: string;
  interestAccrued: string;
  maturityDate: string;
  interestRate: string;
  company: string;
  daysToGo: string;
}


// Generate mock transactions
function generateMockTransactions(count: number): Transaction[] {
  const transactionTypes = ["Investment", "Investment Withdrawal", "Instrument Purchase"];
  const investmentTypes = ["Equities", "Fixed Deposit", "Commercial Paper"];
  const tickers = ["ABBEYBDS", "CORDRS", "FBNH", ""];
  const statuses: ("Successful" | "Pending" | "Failed")[] = ["Successful", "Pending", "Failed"];
  const issuers = ["Abbey Mortgage Bank Plc", "Cordros Asset Mgt Limited", "FBN Holdings"];
  const sectors = ["Financial Services", "Technology", "Healthcare"];

  return Array.from({ length: count }, (_, i) => {
    const baseAmount = Math.random() * 1000000;
    const transactionDate = new Date(2025, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1);
    const maturityDate = new Date(transactionDate);
    maturityDate.setDate(maturityDate.getDate() + 100);

    return {
      id: `txn-${i + 1}`,
      transactionType: transactionTypes[i % transactionTypes.length],
      investmentType: investmentTypes[i % investmentTypes.length],
      ticker: tickers[i % tickers.length],
      amount: `₦ ${baseAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      transactionId: `BI-${String(Math.floor(Math.random() * 10000000000)).padStart(10, "0")}`,
      transactionDate: transactionDate
        .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
        .replace(/\//g, "-"),
      status: statuses[Math.floor(Math.random() * statuses.length)] as "Successful" | "Pending" | "Failed",
      // Additional details
      investor: "Daniel Olumide",
      email: "danielolumide@gmail.com",
      phone: "09087654321",
      accountNumber: "3124567890",
      unitsPurchased: String(Math.floor(baseAmount / 1000)),
      issuer: issuers[i % issuers.length],
      sector: sectors[i % sectors.length],
      maturityDate: maturityDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).replace(/,/g, ""),
      investmentStatus: "Active",
      investmentDate: transactionDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).replace(/,/g, ""),
      source: "Wallet",
    };
  });
}

// Mock investment notes
const mockInvestmentNotes: InvestmentNote[] = [
  {
    id: "1",
    name: "Bucksfield Frontier Note",
    amount: "₦1,000,000",
    investmentDate: "28/10/2025",
    interestAccrued: "₦10.50",
    maturityDate: "28/10/2025",
    interestRate: "19.58% p.a.",
    company: "Bucksfield Asset Mgt Limited",
    daysToGo: "100 days to go",
  },
  {
    id: "2",
    name: "Cordros Fixed Term Note",
    amount: "₦1,000,000",
    investmentDate: "28/10/2025",
    interestAccrued: "₦10.50",
    maturityDate: "28/10/2025",
    interestRate: "19.58% p.a.",
    company: "Cordros Asset Mgt Limited",
    daysToGo: "100 days to go",
  },
];

export default function InvestmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const investorId = params.id as string;
  const investmentId = params.investmentId as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [transactionType, setTransactionType] = useState("All");
  const [dateFrom, setDateFrom] = useState("2025-07-22");
  const [dateTo, setDateTo] = useState("2025-07-22");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const itemsPerPage = 10;

  // Generate mock transactions - memoized
  const allTransactions = useMemo(() => generateMockTransactions(50), []);

  // Filter transactions
  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.transactionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = transactionType === "All" || transaction.transactionType === transactionType;

    return matchesSearch && matchesType;
  });

  // Paginate
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Get investment type name
  const investmentTypeNames: Record<string, string> = {
    "fixed-deposit": "Fixed Deposit Note",
    "commercial-paper": "Commercial Paper",
    "equities": "Equities",
    "usd-bonds": "USD Bonds",
    "mutual-funds": "Mutual Funds",
    "ethical": "Ethical Investments",
  };

  const investmentName = investmentTypeNames[investmentId] || "Investment";

  const summaryCards = [
    {
      title: "Total Fixed Deposit Notes",
      value: "4",
      trend: "8.5% Up from yesterday",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.11111 24.8889H26.4444C27.3036 24.8889 28 25.5853 28 26.4444C28 27.3036 27.3036 28 26.4444 28H1.55556C0.696446 28 0 27.3036 0 26.4444V1.55556C0 0.696446 0.696446 0 1.55556 0C2.41467 0 3.11111 0.696446 3.11111 1.55556V24.8889Z" fill="#25A969"/>
          <path opacity="0.5" d="M8.91305 18.175C8.32547 18.8017 7.34106 18.8335 6.71431 18.2459C6.08756 17.6583 6.0558 16.6739 6.64338 16.0472L12.4767 9.82494C13.045 9.21879 13.9893 9.16623 14.6213 9.70555L19.2253 13.6343L25.224 6.03606C25.7563 5.36176 26.7345 5.24668 27.4088 5.77903C28.0831 6.31137 28.1982 7.28955 27.6658 7.96385L20.6658 16.8305C20.1191 17.5231 19.1063 17.6227 18.4351 17.0499L13.7311 13.0358L8.91305 18.175Z" fill="#25A969"/>
        </svg>
      ),
      iconBgColor: "bg-green-100",
    },
    {
      title: "Total Portfolio Value",
      value: "₦40,689,000",
      trend: "8.5% Up from yesterday",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.11111 24.8889H26.4444C27.3036 24.8889 28 25.5853 28 26.4444C28 27.3036 27.3036 28 26.4444 28H1.55556C0.696446 28 0 27.3036 0 26.4444V1.55556C0 0.696446 0.696446 0 1.55556 0C2.41467 0 3.11111 0.696446 3.11111 1.55556V24.8889Z" fill="#25A969"/>
          <path opacity="0.5" d="M8.91305 18.175C8.32547 18.8017 7.34106 18.8335 6.71431 18.2459C6.08756 17.6583 6.0558 16.6739 6.64338 16.0472L12.4767 9.82494C13.045 9.21879 13.9893 9.16623 14.6213 9.70555L19.2253 13.6343L25.224 6.03606C25.7563 5.36176 26.7345 5.24668 27.4088 5.77903C28.0831 6.31137 28.1982 7.28955 27.6658 7.96385L20.6658 16.8305C20.1191 17.5231 19.1063 17.6227 18.4351 17.0499L13.7311 13.0358L8.91305 18.175Z" fill="#25A969"/>
        </svg>
      ),
      iconBgColor: "bg-green-100",
    },
    {
      title: "Total Deposits",
      value: "₦40,689,000",
      trend: "8.5% Up from yesterday",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.11111 24.8889H26.4444C27.3036 24.8889 28 25.5853 28 26.4444C28 27.3036 27.3036 28 26.4444 28H1.55556C0.696446 28 0 27.3036 0 26.4444V1.55556C0 0.696446 0.696446 0 1.55556 0C2.41467 0 3.11111 0.696446 3.11111 1.55556V24.8889Z" fill="#25A969"/>
          <path opacity="0.5" d="M8.91305 18.175C8.32547 18.8017 7.34106 18.8335 6.71431 18.2459C6.08756 17.6583 6.0558 16.6739 6.64338 16.0472L12.4767 9.82494C13.045 9.21879 13.9893 9.16623 14.6213 9.70555L19.2253 13.6343L25.224 6.03606C25.7563 5.36176 26.7345 5.24668 27.4088 5.77903C28.0831 6.31137 28.1982 7.28955 27.6658 7.96385L20.6658 16.8305C20.1191 17.5231 19.1063 17.6227 18.4351 17.0499L13.7311 13.0358L8.91305 18.175Z" fill="#25A969"/>
        </svg>
      ),
      iconBgColor: "bg-green-100",
    },
    {
      title: "Total Withdrawals",
      value: "₦40,689,000",
      trend: "4.3% Down from yesterday",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.11111 24.8889H26.4444C27.3036 24.8889 28 25.5853 28 26.4444C28 27.3036 27.3036 28 26.4444 28H1.55556C0.696446 28 0 27.3036 0 26.4444V1.55556C0 0.696446 0.696446 0 1.55556 0C2.41467 0 3.11111 0.696446 3.11111 1.55556V24.8889Z" fill="#FE3939"/>
          <path opacity="0.5" d="M8.91256 18.176C8.32498 18.8027 7.34057 18.8345 6.71382 18.2469C6.08707 17.6593 6.05531 16.6749 6.64289 16.0481L12.4762 9.82591C13.0445 9.21977 13.9888 9.1672 14.6208 9.70653L19.2248 13.6353L25.2235 6.03704C25.7558 5.36274 26.734 5.24766 27.4083 5.78C28.0826 6.31235 28.1977 7.29052 27.6653 7.96482L20.6653 16.8315C20.1186 17.524 19.1059 17.6237 18.4347 17.0509L13.7306 13.0367L8.91256 18.176Z" fill="#FE3939"/>
        </svg>
      ),
      iconBgColor: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-sofia">
        <button
          onClick={() => router.push(`/investors/${investorId}`)}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <ChevronLeft size={18} />
          Customers
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">Daniel Olumide</span>
        <span className="text-gray-400">/</span>
        <button
          onClick={() => router.push(`/investors/${investorId}/investments`)}
          className="text-gray-600 hover:text-gray-900"
        >
          Investments
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">{investmentName}</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <SummaryCard key={index} {...card} />
        ))}
      </div>

      {/* Investment Notes Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockInvestmentNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-lg shadow-sm p-6">
            {/* Header with icon, title, amount, and annual percentage */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-2">
                {/* Red upward-sloping line graph icon */}
                <img 
                  src="/investment-chart-icon.svg" 
                  alt="Trending up" 
                  width={40} 
                  height={40} 
                  className="mt-1"
                />
                <div>
                  <h3 
                    className="text-sm font-normal font-sofia mb-2 leading-5 tracking-[0.14px]"
                    style={{ 
                      color: 'var(--Primary-black, #444)',
                      fontFeatureSettings: "'liga' off, 'clig' off"
                    }}
                  >
                    {note.name}
                  </h3>
                  <p  
                    className="text-sm font-bold font-sofia leading-[14px]"
                    style={{ 
                      color: 'var(--Primary-black, #444)',
                      fontFeatureSettings: "'liga' off, 'clig' off"
                    }}
                  >
                    {note.amount}
                  </p>
                </div>
              </div>
              {/* Annual percentage in top right */}
              <div className="text-right">
                <p 
                  className="text-xs font-bold font-sofia lowercase"
                  style={{ 
                    color: 'var(--Success, #25A969)',
                    fontSize: 'var(--body-x-small, 12px)',
                    lineHeight: 'normal'
                  }}
                >
                  {note.interestRate}
                </p>
                <p className="text-xs text-gray-500 mt-1 font-sofia">{note.company}</p>
              </div>
            </div>

            {/* Investment details with justify-between */}
            <div className="flex justify-between mb-4">
              <div>
                <label 
                  className="block text-xs font-normal mb-1 font-sofia leading-[14px]"
                  style={{ 
                    color: 'var(--field-text, #A1A7C4)',
                    fontFeatureSettings: "'liga' off, 'clig' off"
                  }}
                >
                  Investment Date
                </label>
                <p 
                  className="text-sm font-medium font-sofia leading-4"
                  style={{ 
                    color: 'var(--Primary-black, #444)',
                    fontFeatureSettings: "'liga' off, 'clig' off",
                    lineHeight: 'var(--line-height-12, 16px)'
                  }}
                >
                  {note.investmentDate}
                </p>
              </div>
              <div>
                <label 
                  className="block text-xs font-normal mb-1 font-sofia leading-[14px]"
                  style={{ 
                    color: 'var(--field-text, #A1A7C4)',
                    fontFeatureSettings: "'liga' off, 'clig' off"
                  }}
                >
                  Interest Accrued
                </label>
                <p 
                  className="text-sm font-medium font-sofia leading-4"
                  style={{ 
                    color: 'var(--Primary-black, #444)',
                    fontFeatureSettings: "'liga' off, 'clig' off",
                    lineHeight: 'var(--line-height-12, 16px)'
                  }}
                >
                  {note.interestAccrued}
                </p>
              </div>
              <div>
                <label 
                  className="block text-xs font-normal mb-1 font-sofia leading-[14px]"
                  style={{ 
                    color: 'var(--field-text, #A1A7C4)',
                    fontFeatureSettings: "'liga' off, 'clig' off"
                  }}
                >
                  Maturity Date
                </label>
                <p 
                  className="text-sm font-medium font-sofia leading-4"
                  style={{ 
                    color: 'var(--Primary-black, #444)',
                    fontFeatureSettings: "'liga' off, 'clig' off",
                    lineHeight: 'var(--line-height-12, 16px)'
                  }}
                >
                  {note.maturityDate}
                </p>
              </div>
            </div>

            {/* Progress bar with days to go on same line */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 transition-all duration-300"
                  style={{ 
                    width: '60%',
                    borderRadius: '8px',
                    background: 'var(--Primary-Green, #016644)'
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 font-sofia whitespace-nowrap">{note.daysToGo}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
            <div className="relative flex-1">
              <label className="block text-primary-black text-base font-normal font-sofia leading-6 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-sofia text-sm"
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-primary-black text-base font-normal font-sofia leading-6 mb-1">Transaction Type</label>
              <Select value={transactionType} onValueChange={(value) => {
                setTransactionType(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-full font-sofia text-sm">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Investment Withdrawal">Investment Withdrawal</SelectItem>
                  <SelectItem value="Dividend">Dividend</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex-1">
              <label className="block text-primary-black text-base font-normal font-sofia leading-6 mb-1">Show from</label>
              <Calendar className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-sofia text-sm"
              />
            </div>

            <div className="relative flex-1">
              <label className="block text-primary-black text-base font-normal font-sofia leading-6 mb-1">to</label>
              <Calendar className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-sofia text-sm"
              />
            </div>

            <div className="flex items-end flex-shrink-0">
              <button
                className="flex items-center justify-center gap-2 font-sofia rounded-[12px]"
                style={{
                  background: 'rgba(254, 57, 57, 0.10)',
                  width: '116px',
                  height: '48px',
                  padding: '16px',
                }}
                onClick={() => {
                  // Handle filter
                }}
              >
                <Icon icon="mage:filter-fill" width="24" height="24" className="text-[#BB0613]" />
                <span className="text-[#BB0613]">Filter</span>
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 font-sofia">Transactions</h2>
            <button
              className="px-4 py-2 text-white transition-colors font-sofia text-sm font-medium flex items-center gap-2 rounded-[8px]"
              style={{
                background: 'linear-gradient(180deg, #FF5461 0%, #970A14 100%)',
              }}
              onClick={() => {
                // Handle export
              }}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={paginatedTransactions.length > 0 && selectedTransactions.size === paginatedTransactions.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTransactions(new Set(paginatedTransactions.map((txn) => txn.id)));
                      } else {
                        setSelectedTransactions(new Set());
                      }
                    }}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#333] leading-5 uppercase tracking-wider font-sofia">
                  Transaction Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#333] leading-5 uppercase tracking-wider font-sofia">
                  Investment Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#333] leading-5 uppercase tracking-wider font-sofia">
                  Ticker
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#333] leading-5 uppercase tracking-wider font-sofia">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#333] leading-5 uppercase tracking-wider font-sofia">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#333] leading-5 uppercase tracking-wider font-sofia">
                  Transaction Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#333] leading-5 uppercase tracking-wider font-sofia">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#333] leading-5 uppercase tracking-wider font-sofia">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.has(transaction.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedTransactions);
                        if (e.target.checked) {
                          newSelected.add(transaction.id);
                        } else {
                          newSelected.delete(transaction.id);
                        }
                        setSelectedTransactions(newSelected);
                      }}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-[#333] leading-6 font-sofia">{transaction.transactionType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-[#333] leading-6 font-sofia">{transaction.investmentType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-[#333] leading-6 font-sofia">{transaction.ticker || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-[#333] leading-6 font-sofia">{transaction.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-[#333] leading-6 font-sofia">{transaction.transactionId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-[#333] leading-6 font-sofia">{transaction.transactionDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full font-sofia ${
                        transaction.status === "Successful"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "Pending"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedTransaction(transaction)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg font-sofia text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-red-600 text-white"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Transaction Details Sidebar */}
      {selectedTransaction && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setSelectedTransaction(null)}
            style={{ height: '100vh', width: '100vw' }}
          ></div>
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto rounded-l-lg">
            <div>
              {/* Header */}
              <div 
                className="flex items-center relative"
                style={{
                  padding: '16px 24px 12px 24px',
                  borderBottom: '1px solid var(--Neutral-Grey-100, #EEEEF1)'
                }}
              >
                <h2 
                  className="font-sofia text-lg font-semibold flex-1 leading-6 tracking-[-0.09px] text-[#333]"
                  style={{
                    fontFeatureSettings: "'liga' off, 'clig' off"
                  }}
                >
                  Transaction Details
                </h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors absolute right-6"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Details Container */}
              <div className="border border-gray-200 rounded-lg m-6">
                {/* Details */}
                <div className="divide-y divide-gray-200">
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Investor
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.investor}
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Email Address
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.email}
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Phone Number
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.phone}
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Account Number
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.accountNumber}
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Transaction type
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.transactionType}
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Investment Type
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.investmentType}
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Amount
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.amount}
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Units Purchased
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.unitsPurchased}
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Ticker
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.ticker || "-"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Issuer
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.issuer}
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Sector
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.sector}
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Maturity Date
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.maturityDate}
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Investment status
                    </label>
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 font-sofia">
                      {selectedTransaction.investmentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Transaction ID
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.transactionId}
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Investment Date
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.investmentDate}
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Transaction status
                    </label>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full font-sofia ${
                        selectedTransaction.status === "Successful"
                          ? "bg-green-100 text-green-800"
                          : selectedTransaction.status === "Pending"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedTransaction.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <label 
                      className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      Source
                    </label>
                    <p 
                      className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-[#333]"
                      style={{
                        fontFeatureSettings: "'liga' off, 'clig' off"
                      }}
                    >
                      {selectedTransaction.source}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
