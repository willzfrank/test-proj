"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Search,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  UserX,
  Ban,
  Shield,
  FileImage,
  File,
  ChevronDown,
  X,
} from "lucide-react";
import { Icon } from "@iconify/react";
import Button from "@/components/Button";
import { SummaryCard, WalletBalanceIcon, TotalInvestmentsIcon } from "@/components/investors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Transaction {
  id: string;
  transactionType: string;
  investmentType: string;
  debitSource: string;
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
  ticker?: string;
  issuer?: string;
  sector?: string;
  maturityDate?: string;
  investmentStatus?: string;
  investmentDate?: string;
  source?: string;
}


// Mock investor data
const mockInvestor = {
  id: "1",
  firstName: "Daniel",
  lastName: "Olumide",
  email: "danielolumide@gmail.com",
  phone: "09045675678",
  bvn: "11233445557",
  nin: "11233445557",
  gender: "Male",
  dateOfBirth: "02-01-2000",
  address: "24, Town planning, Lagos",
  lga: "Ilupeju",
  state: "Lagos",
  nextOfKinName: "Akin Olumide",
  nextOfKinEmail: "akinolumide@gmail.com",
  nextOfKinPhone: "09045675678",
  dateJoined: "02-01-2024",
  referralCode: "IB567890",
  status: "Active",
  profileImage: "/api/placeholder/120/120",
};

// Generate mock transactions
function generateMockTransactions(count: number): Transaction[] {
  const transactionTypes = ["Wallet Topup", "Investment", "Withdrawal", "Dividend", "Instrument Purchase"];
  const investmentTypes = ["Commercial Paper", "Treasury Bills", "Bonds", "Equities", ""];
  const debitSources = ["Wallet", "12345678901", ""];
  const statuses: ("Successful" | "Pending" | "Failed")[] = ["Successful", "Pending", "Failed"];
  const issuers = ["Abbey Mortgage Bank Plc", "Cordros Asset Mgt Limited", "FBN Holdings"];
  const sectors = ["Financial Services", "Technology", "Healthcare"];
  const tickers = ["ABBEYBDS", "CORDRS", "FBNH", ""];

  return Array.from({ length: count }, (_, i) => {
    const baseAmount = Math.random() * 1000000;
    const transactionDate = new Date(2025, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1);
    const maturityDate = new Date(transactionDate);
    maturityDate.setDate(maturityDate.getDate() + 100);

    return {
      id: `txn-${i + 1}`,
      transactionType: transactionTypes[i % transactionTypes.length],
      investmentType: investmentTypes[i % investmentTypes.length],
      debitSource: debitSources[i % debitSources.length],
      amount: `N ${baseAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
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
      ticker: tickers[i % tickers.length],
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

export default function InvestorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const investorId = params.id as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [dateFrom, setDateFrom] = useState("2025-07-22");
  const [dateTo, setDateTo] = useState("2025-07-22");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [showKYCDropdown, setShowKYCDropdown] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const kycDropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 10;

  // Close KYC dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (kycDropdownRef.current && !kycDropdownRef.current.contains(event.target as Node)) {
        setShowKYCDropdown(false);
      }
    }

    if (showKYCDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showKYCDropdown]);

  // Generate mock transactions - memoized to prevent regeneration on re-render
  const allTransactions = useMemo(() => generateMockTransactions(50), []);

  // Filter transactions
  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.transactionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = status === "All" || transaction.status === status;

    return matchesSearch && matchesStatus;
  });

  // Paginate
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const summaryCards = [
    {
      title: "Total Wallet Balance",
      value: "₦200,000",
      trend: "1.3% Up from last week",
      icon: <WalletBalanceIcon />,
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Total Deposits",
      value: "₦200,000",
      trend: "1.3% Up from last week",
      icon: <WalletBalanceIcon />,
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Total Withdrawals",
      value: "₦200,000",
      trend: "1.3% Up from last week",
      icon: <WalletBalanceIcon />,
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Total Investments",
      value: "4",
      trend: "View All",
      icon: <TotalInvestmentsIcon />,
      iconBgColor: "bg-yellow-100",
      onClick: () => router.push(`/investors/${investorId}/investments`),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-sofia">
        <button
          onClick={() => router.push("/investors")}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <ChevronLeft size={18} />
          Investors
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">
          {mockInvestor.firstName} {mockInvestor.lastName}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <SummaryCard key={index} {...card} />
        ))}
      </div>

      {/* Investor Information Section */}
      <div className="bg-white  p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 font-sofia">Investor Information</h2>
          <div className="relative" ref={kycDropdownRef}>
            <Button
              className="w-auto px-4 py-2 flex items-center gap-2 font-sofia"
              onClick={() => setShowKYCDropdown(!showKYCDropdown)}
            >
              <Icon icon="material-symbols-light:list-alt-outline-sharp" width="24" height="24" />
              View KYC Documents
              <ChevronDown
                size={16}
                className={`transition-transform ${showKYCDropdown ? "rotate-180" : ""}`}
              />
            </Button>
            {showKYCDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 font-sofia">KYC Documents</h3>
                  <div className="space-y-3">
                    {/* NIN Document */}
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileImage className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 font-sofia">Nin.img</p>
                          <p className="text-xs text-gray-500 font-sofia">PNG</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          // Handle download
                          console.log("Downloading Nin.img");
                        }}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Download size={18} />
                      </button>
                    </div>

                    {/* Utility Bill Document */}
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <File className="text-red-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 font-sofia">Utility bill.pdf</p>
                          <p className="text-xs text-gray-500 font-sofia">PDF</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          // Handle download
                          console.log("Downloading Utility bill.pdf");
                        }}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <span className="text-4xl font-bold text-gray-400 font-sofia">
                {mockInvestor.firstName[0]}
                {mockInvestor.lastName[0]}
              </span>
            </div>
            <span
              className={`px-4 py-1 text-xs font-medium rounded-full font-sofia ${
                mockInvestor.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {mockInvestor.status}
            </span>
          </div>

          {/* Details Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">First Name</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.firstName}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">Last Name</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.lastName}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">BVN</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.bvn}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">NIN</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.nin}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">Gender</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.gender}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">Email address</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.email}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">Phone number</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.phone}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">Date of Birth</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.dateOfBirth}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">Address</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.address}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">LGA</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.lga}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">State</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.state}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">Next of Kin Name</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.nextOfKinName}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">Next of Kin Email</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.nextOfKinEmail}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">Next of Kin Phone number</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.nextOfKinPhone}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">Date Joined</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.dateJoined}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">Referral Code</label>
              <p className="text-sm text-gray-900 font-sofia">{mockInvestor.referralCode}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-end gap-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-sofia text-sm font-medium flex items-center gap-2 whitespace-nowrap cursor-pointer">
            Freeze Investor
          </button>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <label className="text-sm text-gray-700 font-sofia">Blacklist Investor</label>
            <button
              onClick={() => setIsBlacklisted(!isBlacklisted)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                isBlacklisted ? "bg-red-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isBlacklisted ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <Button className="!w-auto px-4 py-2 flex items-center gap-2 font-sofia whitespace-nowrap !text-white text-sm font-normal leading-5 cursor-pointer">
            <Shield size={16} />
            Activate PND
          </Button>
        </div>
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
              <label className="block text-primary-black text-base font-normal font-sofia leading-6 mb-1">Status</label>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full font-sofia text-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Successful">Successful</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
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
                  Debit Source
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
                    <div className="text-sm font-normal text-[#333] leading-6 font-sofia">{transaction.investmentType || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-[#333] leading-6 font-sofia">{transaction.debitSource || "-"}</div>
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
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      <MoreHorizontal size={18} />
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
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setSelectedTransaction(null)}
          ></div>
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 font-sofia">Transaction Details</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-sofia">Investor</label>
                  <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.investor}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-sofia">Email Address</label>
                  <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.email}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-sofia">Phone Number</label>
                  <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.phone}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-sofia">Account Number</label>
                  <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.accountNumber}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-sofia">Transaction type</label>
                  <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.transactionType}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-sofia">Investment Type</label>
                  <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.investmentType || "-"}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-sofia">Amount</label>
                  <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.amount}</p>
                </div>
                {selectedTransaction.unitsPurchased && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-sofia">Units Purchased</label>
                    <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.unitsPurchased}</p>
                  </div>
                )}
                {selectedTransaction.ticker && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-sofia">Ticker</label>
                    <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.ticker}</p>
                  </div>
                )}
                {selectedTransaction.issuer && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-sofia">Issuer</label>
                    <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.issuer}</p>
                  </div>
                )}
                {selectedTransaction.sector && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-sofia">Sector</label>
                    <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.sector}</p>
                  </div>
                )}
                {selectedTransaction.maturityDate && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-sofia">Maturity Date</label>
                    <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.maturityDate}</p>
                  </div>
                )}
                {selectedTransaction.investmentStatus && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-sofia">Investment status</label>
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 font-sofia">
                      {selectedTransaction.investmentStatus}
                    </span>
                  </div>
                )}
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-sofia">Transaction ID</label>
                  <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.transactionId}</p>
                </div>
                {selectedTransaction.investmentDate && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-sofia">Investment Date</label>
                    <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.investmentDate}</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-sofia">Transaction status</label>
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
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-sofia">Source</label>
                  <p className="text-sm text-gray-900 font-sofia">{selectedTransaction.source || selectedTransaction.debitSource}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
