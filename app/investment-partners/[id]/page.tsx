'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Search,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Shield,
  FileImage,
  File,
  ChevronDown,
  Users,
  FileText,
} from 'lucide-react';
import { Icon } from '@iconify/react';
import Button from '@/components/Button';
import {
  SummaryCard,
  WalletBalanceIcon,
  TotalInvestmentsIcon,
} from '@/components/investors';
import TransactionDetailsSidebar from '@/components/TransactionDetailsSidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Transaction {
  id: string;
  transactionType: string;
  investmentType: string;
  debitSource: string;
  amount: string;
  transactionId: string;
  transactionDate: string;
  status: 'Successful' | 'Pending' | 'Failed';
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

// Mock partner data
const mockPartner = {
  id: '1',
  legalName: 'Afrinvest Asset Management',
  tradingName: 'Afrinvest Asset Management Limited',
  email: 'info@afrinvest.com.ng',
  phone: '09045675678',
  address: '24, Town planning, Lagos',
  lga: 'Ilupeju',
  state: 'Lagos',
  repEmail: 'akinolumide@gmail.com',
  repPhone: '09045675678',
  settlementBank: 'Alert Microfinance Bank',
  settlementAccountNumber: '00019876541',
  commission: '40%',
  dateJoined: '02-01-2024',
  status: 'Verified',
  profileImage: '/api/placeholder/120/120',
};

// Generate mock transactions
function generateMockTransactions(count: number): Transaction[] {
  const transactionTypes = [
    'Wallet Topup',
    'Investment',
    'Withdrawal',
    'Dividend',
    'Instrument Purchase',
  ];
  const investmentTypes = [
    'Commercial Paper',
    'Treasury Bills',
    'Bonds',
    'Equities',
    '',
  ];
  const debitSources = ['Wallet', '12345678901', ''];
  const statuses: ('Successful' | 'Pending' | 'Failed')[] = [
    'Successful',
    'Pending',
    'Failed',
  ];
  const issuers = [
    'Abbey Mortgage Bank Plc',
    'Cordros Asset Mgt Limited',
    'FBN Holdings',
  ];
  const sectors = ['Financial Services', 'Technology', 'Healthcare'];
  const tickers = ['ABBEYBDS', 'CORDRS', 'FBNH', ''];

  return Array.from({ length: count }, (_, i) => {
    const baseAmount = Math.random() * 1000000;
    const transactionDate = new Date(
      2025,
      Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 28) + 1,
    );
    const maturityDate = new Date(transactionDate);
    maturityDate.setDate(maturityDate.getDate() + 100);

    return {
      id: `txn-${i + 1}`,
      transactionType: transactionTypes[i % transactionTypes.length],
      investmentType: investmentTypes[i % investmentTypes.length],
      debitSource: debitSources[i % debitSources.length],
      amount: `N ${baseAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
      transactionId: `BI-${String(Math.floor(Math.random() * 10000000000)).padStart(10, '0')}`,
      transactionDate: transactionDate
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .replace(/\//g, '-'),
      status: statuses[Math.floor(Math.random() * statuses.length)] as
        | 'Successful'
        | 'Pending'
        | 'Failed',
      investor: mockPartner.tradingName,
      email: mockPartner.email,
      phone: mockPartner.phone,
      accountNumber: mockPartner.settlementAccountNumber,
      unitsPurchased: String(Math.floor(baseAmount / 1000)),
      ticker: tickers[i % tickers.length],
      issuer: issuers[i % issuers.length],
      sector: sectors[i % sectors.length],
      maturityDate: maturityDate
        .toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(/,/g, ''),
      investmentStatus: 'Active',
      investmentDate: transactionDate
        .toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(/,/g, ''),
      source: 'Wallet',
    };
  });
}

export default function PartnerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const partnerId = params.id as string;

  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [dateFrom, setDateFrom] = useState('2025-07-22');
  const [dateTo, setDateTo] = useState('2025-07-22');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
    new Set(),
  );
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [showKYBDropdown, setShowKYBDropdown] = useState(false);
  const [showSignatoriesDropdown, setShowSignatoriesDropdown] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const kycDropdownRef = useRef<HTMLDivElement>(null);
  const signatoriesDropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 10;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        kycDropdownRef.current &&
        !kycDropdownRef.current.contains(event.target as Node)
      ) {
        setShowKYBDropdown(false);
      }
      if (
        signatoriesDropdownRef.current &&
        !signatoriesDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSignatoriesDropdown(false);
      }
    }

    if (showKYBDropdown || showSignatoriesDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showKYBDropdown, showSignatoriesDropdown]);

  // Generate mock transactions - memoized to prevent regeneration on re-render
  const allTransactions = useMemo(() => generateMockTransactions(50), []);

  // Filter transactions
  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.transactionType
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.transactionId
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = status === 'All' || transaction.status === status;

    return matchesSearch && matchesStatus;
  });

  // Paginate
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const summaryCards = [
    {
      title: 'Total Wallet Balance',
      value: '₦200,000',
      trend: '1.3% Up from past week',
      icon: <WalletBalanceIcon />,
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Total Funds Raised',
      value: '₦200,000',
      trend: '1.3% Up from past week',
      icon: <WalletBalanceIcon />,
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Average Yield Offered',
      value: '12%',
      trend: '1.3% Up from past week',
      icon: <WalletBalanceIcon />,
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Total Products Listed',
      value: '4',
      trend: 'View All',
      icon: <TotalInvestmentsIcon />,
      iconBgColor: 'bg-yellow-100',
      onClick: () => {
        // Navigate to products list
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-sofia">
        <button
          onClick={() => router.push('/investment-partners')}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <ChevronLeft size={18} />
          Investment Partners
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">
          {mockPartner.tradingName}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <SummaryCard key={index} {...card} />
        ))}
      </div>

      {/* Partner Information Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 font-sofia">
            Partner Information
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative" ref={signatoriesDropdownRef}>
              <Button
                variant="secondary"
                className="!w-auto px-4 py-2 flex items-center gap-2 font-sofia !border !border-[#BB0613] !text-[#BB0613] !bg-transparent hover:!bg-red-50"
                onClick={() =>
                  setShowSignatoriesDropdown(!showSignatoriesDropdown)
                }
              >
                <Users size={18} />
                View Authorized Signatories
              </Button>
              {showSignatoriesDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 font-sofia">
                      Authorized Signatories
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 font-sofia">
                              Signatory 1
                            </p>
                            <p className="text-xs text-gray-500 font-sofia">
                              Authorized
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            // Handle view details
                            console.log('Viewing signatory details');
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
            <div className="relative" ref={kycDropdownRef}>
              <Button
                variant="secondary"
                className="!w-auto px-4 py-2 flex items-center gap-2 font-sofia !border !border-[#BB0613] !text-[#BB0613] !bg-transparent hover:!bg-red-50"
                onClick={() => setShowKYBDropdown(!showKYBDropdown)}
              >
                <FileText size={18} />
                View KYB Documents
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showKYBDropdown ? 'rotate-180' : ''}`}
                />
              </Button>
              {showKYBDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 font-sofia">
                      KYB Documents
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileImage className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 font-sofia">
                              CAC.pdf
                            </p>
                            <p className="text-xs text-gray-500 font-sofia">
                              PDF
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            // Handle download
                            console.log('Downloading CAC.pdf');
                          }}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <File className="text-red-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 font-sofia">
                              MOI
                            </p>
                            <p className="text-xs text-gray-500 font-sofia">
                              Document
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            // Handle download
                            console.log('Downloading MOI');
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
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-green-200 flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-green-700 font-sofia">
                {mockPartner.tradingName.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <span
              className={`px-4 py-1 text-xs font-medium rounded-full font-sofia ${
                mockPartner.status === 'Verified'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {mockPartner.status}
            </span>
          </div>

          {/* Details Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">
                Legal Name
              </label>
              <p className="text-sm text-gray-900 font-sofia">
                {mockPartner.legalName}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">
                Trading Name
              </label>
              <p className="text-sm text-gray-900 font-sofia">
                {mockPartner.tradingName}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">
                Email address
              </label>
              <p className="text-sm text-gray-900 font-sofia">
                {mockPartner.email}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">
                Phone number
              </label>
              <p className="text-sm text-gray-900 font-sofia">
                {mockPartner.phone}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">
                Address
              </label>
              <p className="text-sm text-gray-900 font-sofia">
                {mockPartner.address}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">
                LGA
              </label>
              <p className="text-sm text-gray-900 font-sofia">
                {mockPartner.lga}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">
                State
              </label>
              <p className="text-sm text-gray-900 font-sofia">
                {mockPartner.state}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">
                Rep Email
              </label>
              <p className="text-sm text-gray-900 font-sofia">
                {mockPartner.repEmail}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">
                Rep Phone number
              </label>
              <p className="text-sm text-gray-900 font-sofia">
                {mockPartner.repPhone}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">
                Settlement Bank
              </label>
              <p className="text-sm text-gray-900 font-sofia">
                {mockPartner.settlementBank}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">
                Settlement Account Number
              </label>
              <p className="text-sm text-gray-900 font-sofia">
                {mockPartner.settlementAccountNumber}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">
                Commission
              </label>
              <p className="text-sm text-green-600 font-sofia font-semibold">
                {mockPartner.commission}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-sofia">
                Date Joined
              </label>
              <p className="text-sm text-gray-900 font-sofia">
                {mockPartner.dateJoined}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-end gap-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-sofia text-sm font-medium flex items-center gap-2 whitespace-nowrap cursor-pointer">
            Freeze Partner
          </button>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <label className="text-sm text-gray-700 font-sofia">
              Blacklist Partner
            </label>
            <button
              onClick={() => setIsBlacklisted(!isBlacklisted)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                isBlacklisted ? 'bg-red-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isBlacklisted ? 'translate-x-6' : 'translate-x-1'
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
              <label className="block text-primary-black text-base font-normal font-sofia leading-6 mb-1">
                Search
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
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
              <label className="block text-primary-black text-base font-normal font-sofia leading-6 mb-1">
                Status
              </label>
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
              <label className="block text-primary-black text-base font-normal font-sofia leading-6 mb-1">
                Show from
              </label>
              <Calendar
                className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-sofia text-sm"
              />
            </div>

            <div className="relative flex-1">
              <label className="block text-primary-black text-base font-normal font-sofia leading-6 mb-1">
                to
              </label>
              <Calendar
                className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 text-gray-400"
                size={18}
              />
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
                <Icon
                  icon="mage:filter-fill"
                  width="24"
                  height="24"
                  className="text-[#BB0613]"
                />
                <span className="text-[#BB0613]">Filter</span>
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 font-sofia">
              Transactions
            </h2>
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
                    checked={
                      paginatedTransactions.length > 0 &&
                      selectedTransactions.size === paginatedTransactions.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTransactions(
                          new Set(paginatedTransactions.map((txn) => txn.id)),
                        );
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
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 transition-colors"
                >
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
                    <div className="text-sm font-normal text-[#333] leading-6 font-sofia">
                      {transaction.transactionType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-[#333] leading-6 font-sofia">
                      {transaction.investmentType || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-[#333] leading-6 font-sofia">
                      {transaction.debitSource || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-[#333] leading-6 font-sofia">
                      {transaction.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-[#333] leading-6 font-sofia">
                      {transaction.transactionId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-[#333] leading-6 font-sofia">
                      {transaction.transactionDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full font-sofia ${
                        transaction.status === 'Successful'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'Pending'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
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
                      ? 'bg-red-600 text-white'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
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

