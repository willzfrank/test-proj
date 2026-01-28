'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, MoreHorizontal, Eye, Search, Calendar } from 'lucide-react';
import { Icon } from '@iconify/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyStateIcon } from './PartnerIcons';

export interface Partner {
  id: string;
  name: string;
  email: string;
  investmentType: string;
  totalProductsListed: string;
  dateJoined: string;
  status: 'Verified' | 'Rejected';
}

interface PartnersTableProps {
  partners: Partner[];
  selectedPartners: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectPartner: (id: string, checked: boolean) => void;
  pagination?: React.ReactNode;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  investmentType: string;
  onInvestmentTypeChange: (value: string) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  onFilter: () => void;
}

export function PartnersTable({
  partners,
  selectedPartners,
  onSelectAll,
  onSelectPartner,
  pagination,
  searchQuery,
  onSearchChange,
  investmentType,
  onInvestmentTypeChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onFilter,
}: PartnersTableProps) {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    }

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-sofia text-sm"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-primary-black text-base font-normal font-sofia leading-6 mb-1">
              Investment Type
            </label>
            <Select
              value={investmentType}
              onValueChange={onInvestmentTypeChange}
            >
              <SelectTrigger className="w-full font-sofia text-sm">
                <SelectValue placeholder="Select investment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Equities">Equities</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Fixed Deposit Note">
                  Fixed Deposit Note
                </SelectItem>
                <SelectItem value="Mutual Funds">Mutual Funds</SelectItem>
                <SelectItem value="Mutual Fund Manager">
                  Mutual Fund Manager
                </SelectItem>
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
              onChange={(e) => onDateFromChange(e.target.value)}
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
              onChange={(e) => onDateToChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-sofia text-sm"
            />
          </div>

          <div className="flex items-end gap-2 flex-shrink-0">
            <button
              className="flex items-center justify-center gap-2 font-sofia rounded-[12px]"
              style={{
                background: 'rgba(254, 57, 57, 0.10)',
                width: '116px',
                height: '48px',
                padding: '16px',
              }}
              onClick={onFilter}
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
            Investment Partners
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
      {partners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="mb-6">
            <EmptyStateIcon />
          </div>
          <p className="text-gray-500 text-base font-normal font-sofia">
            Nothing to see yet.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        partners.length > 0 &&
                        selectedPartners.size === partners.length
                      }
                      onChange={(e) => onSelectAll(e.target.checked)}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#333] leading-5 uppercase tracking-wider font-sofia">
                    Partner
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#333] leading-5 uppercase tracking-wider font-sofia">
                    Email Address
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#333] leading-5 uppercase tracking-wider font-sofia">
                    Investment Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#333] leading-5 uppercase tracking-wider font-sofia">
                    Total Products Listed
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#333] leading-5 uppercase tracking-wider font-sofia">
                    Date Joined
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
                {partners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedPartners.has(partner.id)}
                        onChange={(e) =>
                          onSelectPartner(partner.id, e.target.checked)
                        }
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-normal text-[#333] leading-6 font-sofia">
                        {partner.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-normal text-[#333] leading-6 font-sofia">
                        {partner.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-normal text-[#333] leading-6 font-sofia">
                        {partner.investmentType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-normal text-[#333] leading-6 font-sofia">
                        {partner.totalProductsListed}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-normal text-[#333] leading-6 font-sofia">
                        {partner.dateJoined}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full font-sofia ${
                          partner.status === 'Verified'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {partner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative dropdown-container">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === partner.id ? null : partner.id,
                            )
                          }
                          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        {openDropdown === partner.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(
                                  `/investment-partners/${partner.id}`,
                                );
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-sofia cursor-pointer"
                            >
                              <Eye size={16} />
                              View Details
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination}
        </>
      )}
    </div>
  );
}

