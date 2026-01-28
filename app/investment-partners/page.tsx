"use client";

import { useState } from "react";
import {
  SummaryCard,
  Pagination,
} from "@/components/investors";
import { PartnersTable } from "@/components/investment-partners/PartnersTable";
import {
  TotalPartnersIcon,
  TotalInvestmentsIcon,
  ActivePartnersIcon,
  BlacklistedPartnersIcon,
} from "@/components/investment-partners/PartnerIcons";

export default function InvestmentPartnersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [investmentType, setInvestmentType] = useState("All");
  const [dateFrom, setDateFrom] = useState("2025-07-22");
  const [dateTo, setDateTo] = useState("2025-07-22");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPartners, setSelectedPartners] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;

  // Mock data - sample partners data
  const partners = [
    {
      id: "1",
      name: "Afrinvest Asset Management Limited",
      email: "info@afrinvest.com.ng",
      investmentType: "Mutual Fund Manager",
      totalProductsListed: "20",
      dateJoined: "24-05-2025",
      status: "Verified" as const,
    },
    {
      id: "2",
      name: "Afrinvest Asset Management Limited",
      email: "info@afrinvest.com.ng",
      investmentType: "Mutual Fund Manager",
      totalProductsListed: "20",
      dateJoined: "24-05-2025",
      status: "Verified" as const,
    },
    {
      id: "3",
      name: "Afrinvest Asset Management Limited",
      email: "info@afrinvest.com.ng",
      investmentType: "Mutual Fund Manager",
      totalProductsListed: "20",
      dateJoined: "24-05-2025",
      status: "Rejected" as const,
    },
    {
      id: "4",
      name: "Afrinvest Asset Management Limited",
      email: "info@afrinvest.com.ng",
      investmentType: "Mutual Fund Manager",
      totalProductsListed: "20",
      dateJoined: "24-05-2025",
      status: "Verified" as const,
    },
    {
      id: "5",
      name: "Afrinvest Asset Management Limited",
      email: "info@afrinvest.com.ng",
      investmentType: "Mutual Fund Manager",
      totalProductsListed: "20",
      dateJoined: "24-05-2025",
      status: "Verified" as const,
    },
  ];

  // Filter partners based on search and investment type
  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = investmentType === "All" || partner.investmentType === investmentType;

    return matchesSearch && matchesType;
  });

  // Paginate
  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPartners = filteredPartners.slice(startIndex, startIndex + itemsPerPage);

  // Select all checkbox handler
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPartners(new Set(paginatedPartners.map((p) => p.id)));
    } else {
      setSelectedPartners(new Set());
    }
  };

  // Individual checkbox handler
  const handleSelectPartner = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedPartners);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedPartners(newSelected);
  };

  // Filter handlers
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleInvestmentTypeChange = (value: string) => {
    setInvestmentType(value);
    setCurrentPage(1);
  };

  const summaryCards = [
    {
      title: "Total Partners",
      value: "20,689",
      trend: "8.5% Up from yesterday",
      icon: <TotalPartnersIcon />,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Investments",
      value: "40,800",
      trend: "8.5% Up from yesterday",
      icon: <TotalInvestmentsIcon />,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Active Partners",
      value: "39,689",
      trend: "8.5% Up from yesterday",
      icon: <ActivePartnersIcon />,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Blacklisted Partners",
      value: "40",
      trend: "4.3% Down from yesterday",
      icon: <BlacklistedPartnersIcon />,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <SummaryCard key={index} {...card} />
        ))}
      </div>

      {/* Partners Table Section */}
      <PartnersTable
        partners={paginatedPartners}
        selectedPartners={selectedPartners}
        onSelectAll={handleSelectAll}
        onSelectPartner={handleSelectPartner}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        investmentType={investmentType}
        onInvestmentTypeChange={handleInvestmentTypeChange}
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
