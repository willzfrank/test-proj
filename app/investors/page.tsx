"use client";

import { useState, useMemo } from "react";
import {
  SummaryCard,
  TotalInvestorsIcon,
  ActiveInvestorsIcon,
  InactiveInvestorsIcon,
  InvestorsTable,
  Pagination,
} from "@/components/investors";
import { generateMockInvestors } from "@/lib/utils/investors";

export default function InvestorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [dateFrom, setDateFrom] = useState("2025-07-22");
  const [dateTo, setDateTo] = useState("2025-07-22");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvestors, setSelectedInvestors] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;

  // Generate mock data (100 investors total) - memoized to prevent regeneration on re-render
  const allInvestors = useMemo(() => generateMockInvestors(100), []);

  // Filter investors based on search and status
  const filteredInvestors = allInvestors.filter((investor) => {
    const matchesSearch =
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.phone.includes(searchQuery) ||
      investor.referralCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = status === "All" || investor.status === status;

    return matchesSearch && matchesStatus;
  });

  // Paginate
  const totalPages = Math.ceil(filteredInvestors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvestors = filteredInvestors.slice(startIndex, startIndex + itemsPerPage);

  // Select all checkbox handler
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvestors(new Set(paginatedInvestors.map((inv) => inv.id)));
    } else {
      setSelectedInvestors(new Set());
    }
  };

  // Individual checkbox handler
  const handleSelectInvestor = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedInvestors);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedInvestors(newSelected);
  };

  // Filter handlers
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const summaryCards = [
    {
      title: "Total Investors",
      value: "10,000",
      trend: "8.5% Up from yesterday",
      icon: <TotalInvestorsIcon />,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Active Investors",
      value: "5,000",
      trend: "8.5% Up from yesterday",
      icon: <ActiveInvestorsIcon />,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Inactive Investors",
      value: "400",
      trend: "8.5% Up from yesterday",
      icon: <InactiveInvestorsIcon />,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Blacklisted Investors",
      value: "40",
      trend: "8.5% Up from yesterday",
      icon: <InactiveInvestorsIcon />,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <SummaryCard key={index} {...card} />
        ))}
      </div>

      {/* Investors Table Section */}
      <InvestorsTable
        investors={paginatedInvestors}
        selectedInvestors={selectedInvestors}
        onSelectAll={handleSelectAll}
        onSelectInvestor={handleSelectInvestor}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onFilter={() => {
          // Handle filter
        }}
        pagination={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        }
      />
    </div>
  );
}
