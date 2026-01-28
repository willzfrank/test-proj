import React from "react";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor?: string;
  link?: string;
  onClick?: () => void;
}

export function SummaryCard({ title, value, trend, icon, iconBgColor, iconColor, link, onClick }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-[14px] p-6 flex flex-col h-full" style={{ boxShadow: '6px 6px 54px 0 rgba(0, 0, 0, 0.05)' }}>
      <div className="flex items-center justify-between flex-1 mb-4">
        {/* Left Section - Text Content */}
        <div className="flex flex-col flex-1">
          <h3 className="text-[#333] text-[15px] font-semibold font-sofia leading-normal opacity-70 mb-2">{title}</h3>
          <div className="flex items-center justify-between">
            <p className="text-primary-black text-[22px] font-bold font-sofia leading-normal tracking-[1px]">{value}</p>
            {link && trend !== "View All" && (
              <button
                onClick={onClick}
                className="text-sm text-red-600 hover:underline font-sofia cursor-pointer ml-4"
              >
                {link}
              </button>
            )}
          </div>
        </div>
        
        {/* Right Section - Circular Icon */}
        <div className={`${iconBgColor} rounded-[30%] w-15 h-15 flex items-center justify-center flex-shrink-0 ml-4`}>
          {icon}
        </div>
      </div>
      
      {/* Trend - Full Width at Bottom */}
      <div className="flex items-center gap-1 w-full">
        {trend === "View All" ? (
          <button
            onClick={onClick}
            className="flex items-center gap-1 cursor-pointer"
          >
            <span 
              className="text-[#25A969] text-base font-normal font-sofia leading-4 tracking-[-0.16px]"
              style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
            >
              View All
            </span>
            <ArrowRight size={16} className="text-[#25A969]" />
          </button>
        ) : trend.includes("Down") ? (
          <>
            <TrendingDown size={16} className="text-[#F93C65]" />
            <>
              <span className="text-[#F93C65] text-base font-semibold font-sofia leading-normal">
                {trend.split(" Down")[0]}
              </span>
              <span className="text-[#333] text-base font-semibold font-sofia leading-normal">
                {" Down" + trend.split(" Down")[1]}
              </span>
            </>
          </>
        ) : (
          <>
            <TrendingUp size={16} className="text-[#00B69B]" />
            {trend.includes("Up") ? (
              <>
                <span className="text-[#00B69B] text-base font-semibold font-sofia leading-normal">
                  {trend.split(" Up")[0]}
                </span>
                <span className="text-[#333] text-base font-semibold font-sofia leading-normal">
                  {" Up" + trend.split(" Up")[1]}
                </span>
              </>
            ) : (
              <span className="text-[#00B69B] text-base font-semibold font-sofia leading-normal">{trend}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
