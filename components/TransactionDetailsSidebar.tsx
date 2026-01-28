"use client";

import { X } from "lucide-react";

interface TransactionDetailsSidebarProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly transaction: {
    id?: string;
    investor?: string;
    email?: string;
    phone?: string;
    accountNumber?: string;
    amount?: string;
    transactionType?: string;
    type?: string;
    investmentType?: string;
    transactionId?: string;
    transactionDate?: string;
    date?: string;
    status: "Successful" | "Pending" | "Failed";
    unitsPurchased?: string;
    ticker?: string;
    issuer?: string;
    sector?: string;
    maturityDate?: string;
    investmentStatus?: string;
    investmentDate?: string;
    source?: string;
    debitSource?: string;
  } | null;
}

const getStatusBadge = (status: string) => {
  if (status === "Successful") {
    return "bg-green-100 text-green-800";
  } else if (status === "Pending") {
    return "bg-orange-100 text-orange-800";
  } else {
    return "bg-red-100 text-red-800";
  }
};

interface DetailRowProps {
  readonly label: string;
  readonly value?: string;
  readonly isBadge?: boolean;
}

function DetailRow({ label, value, isBadge = false }: DetailRowProps) {
  if (value === undefined || value === null) return null;
  
  return (
    <div className="flex justify-between items-center px-6 py-4">
      <label
        className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F]"
        style={{
          fontFeatureSettings: "'liga' off, 'clig' off",
        }}
      >
        {label}
      </label>
      {isBadge ? (
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full font-sofia ${getStatusBadge(value)}`}>
          {value}
        </span>
      ) : (
        <p
          className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-primary-black"
          style={{
            fontFeatureSettings: "'liga' off, 'clig' off",
          }}
        >
          {value}
        </p>
      )}
    </div>
  );
}

export default function TransactionDetailsSidebar({
  isOpen,
  onClose,
  transaction,
}: TransactionDetailsSidebarProps) {
  if (!isOpen || !transaction) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
        role="button"
        tabIndex={0}
        style={{ height: '100vh', width: '100vw' }}
        aria-label="Close sidebar"
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
              onClick={onClose}
              className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors absolute right-6"
            >
              <X size={20} />
            </button>
          </div>

          {/* Details Container */}
          <div className="border border-gray-200 rounded-lg m-6">
            {/* Details */}
            <div className="divide-y divide-gray-200">
              <DetailRow label="Investor" value={transaction.investor} />
              <DetailRow label="Email Address" value={transaction.email} />
              <DetailRow label="Phone Number" value={transaction.phone} />
              <DetailRow label="Account Number" value={transaction.accountNumber} />
              <DetailRow label="Transaction type" value={transaction.transactionType || transaction.type} />
              <DetailRow label="Investment Type" value={transaction.investmentType} />
              <DetailRow label="Amount" value={transaction.amount} />
              <DetailRow label="Units Purchased" value={transaction.unitsPurchased} />
              <DetailRow label="Ticker" value={transaction.ticker} />
              <DetailRow label="Issuer" value={transaction.issuer} />
              <DetailRow label="Sector" value={transaction.sector} />
              <DetailRow label="Maturity Date" value={transaction.maturityDate} />
              <DetailRow label="Investment status" value={transaction.investmentStatus} isBadge={!!transaction.investmentStatus} />
              <DetailRow label="Transaction ID" value={transaction.transactionId} />
              <DetailRow label="Transaction Date" value={transaction.transactionDate || transaction.date} />
              <DetailRow label="Investment Date" value={transaction.investmentDate} />
              <DetailRow label="Transaction status" value={transaction.status} isBadge={true} />
              <DetailRow label="Source" value={transaction.source || transaction.debitSource} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
