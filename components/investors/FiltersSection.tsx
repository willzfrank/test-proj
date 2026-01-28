"use client";

import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  onFilter: () => void;
}

export function FiltersSection({
  searchQuery,
  onSearchChange,
  status,
  onStatusChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onFilter,
}: FiltersSectionProps) {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="relative flex-1">
          <label className="block text-primary-black text-base font-normal font-sofia leading-6 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
          <label className="block text-primary-black text-base font-normal font-sofia leading-6 mb-1">Status</label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full font-sofia text-sm">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Blacklisted">Blacklisted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex-1">
          <label className="block text-primary-black text-base font-normal font-sofia leading-6 mb-1">Show from</label>
          <Calendar className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-sofia text-sm"
          />
        </div>

        <div className="relative flex-1">
          <label className="block text-primary-black text-base font-normal font-sofia leading-6 mb-1">to</label>
          <Calendar className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
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
            onClick={onFilter}
          >
            <Icon icon="mage:filter-fill" width="24" height="24" className="text-[#BB0613]" />
            <span className="text-[#BB0613]">Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
