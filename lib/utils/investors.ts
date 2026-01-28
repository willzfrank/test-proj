export interface Investor {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  walletBalance: string;
  dateJoined: string;
  status: "Active" | "Inactive" | "Blacklisted";
}

export function generateMockInvestors(count: number): Investor[] {
  const names = [
    "Daniel Olumide",
    "Sarah Johnson",
    "Michael Chen",
    "Emily Rodriguez",
    "James Wilson",
    "Olivia Brown",
    "David Martinez",
    "Sophia Lee",
    "Robert Taylor",
    "Emma Anderson",
    "William Thomas",
    "Isabella Garcia",
    "Joseph White",
    "Ava Harris",
    "Christopher Clark",
  ];

  const statuses: ("Active" | "Inactive" | "Blacklisted")[] = ["Active", "Inactive", "Blacklisted"];

  return Array.from({ length: count }, (_, i) => ({
    id: `inv-${i + 1}`,
    name: names[i % names.length],
    email: `${names[i % names.length].toLowerCase().replace(/\s+/g, "")}@gmail.com`,
    phone: `090${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
    referralCode: `BI-${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
    walletBalance: `N ${(Math.random() * 1000000000).toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
    dateJoined: new Date(2025, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1)
      .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
      .replace(/\//g, "-"),
    status: statuses[Math.floor(Math.random() * statuses.length)] as "Active" | "Inactive" | "Blacklisted",
  }));
}
