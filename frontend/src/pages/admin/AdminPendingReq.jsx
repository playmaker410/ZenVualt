import React, { useState } from "react";
import {
    Search,
    Download,
    Filter,
    Calendar,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    UserPlus,
    ShieldCheck,
    CreditCard,
    Landmark,
    Users,
} from "lucide-react";

const stats = [
    {
        label: "Total Pending",
        value: 73,
        sub: "All request types",
        icon: Users,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",

    },
    {
        label: "Registrations",
        value: 32,
        sub: "New user signups",
        icon: UserPlus,
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        iconColor: "text-zen-orange-600 dark:text-orange-400",
        subColor: "text-orange-600 dark:text-orange-400",
    },
    {
        label: "KYC Verifications",
        value: 17,
        sub: "Identity verification",
        icon: ShieldCheck,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-zen-green-600 dark:text-green-400",
        subColor: "text-green-600 dark:text-green-400",
    },
    {
        label: "Card Requests",
        value: 12,
        sub: "Debit/Credit cards",
        icon: CreditCard,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        subColor: "text-blue-600 dark:text-blue-400",
    },
    {
        label: "Loan Requests",
        value: 12,
        sub: "Loan applications",
        icon: Landmark,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-zen-purple-600 dark:text-purple-400",
        subColor: "text-purple-600 dark:text-purple-400",
    },
];

const typeBadge = {
    Registration: {
        icon: UserPlus,
        className:
            "bg-zen-orange-100 text-zen-orange-700 dark:bg-zen-orange-900/30 dark:text-zen-orange-400",
    },
    "KYC Verification": {
        icon: ShieldCheck,
        className:
            "bg-zen-green-100 text-zen-green-700 dark:bg-zen-green-900/30 dark:text-zen-green-400",
    },
    "Card Request": {
        icon: CreditCard,
        className:
            "bg-zen-blue-100 text-zen-blue-700 dark:bg-zen-blue-900/30 dark:text-zen-blue-400",
    },
    "Loan Request": {
        icon: Landmark,
        className:
            "bg-zen-purple-100 text-zen-purple-700 dark:bg-zen-purple-900/30 dark:text-zen-purple-400",
    },
};

const requests = [
    {
        id: "REQ-250729-001",
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1 234 567 8900",
        avatar: "https://i.pravatar.cc/80?img=12",
        type: "Registration",
        detailsTitle: "Individual",
        detailsSub: "Personal Account",
        date: "29 Jul 2026",
        time: "10:24 AM",
        status: "Pending Review",
    },
    {
        id: "REQ-250729-002",
        name: "Mary Jane",
        email: "mary.jane@email.com",
        phone: "+1 234 567 8901",
        avatar: "https://i.pravatar.cc/80?img=32",
        type: "KYC Verification",
        detailsTitle: "ID Type: Passport",
        detailsSub: "Country: United States",
        date: "29 Jul 2026",
        time: "09:45 AM",
        status: "Pending Review",
    },
    {
        id: "REQ-250729-003",
        name: "Michael Brown",
        email: "michael.b@email.com",
        phone: "+1 234 567 8902",
        avatar: "https://i.pravatar.cc/80?img=51",
        type: "Card Request",
        detailsTitle: "Card Type: Visa Debit",
        detailsSub: "Account: **** 5678",
        date: "29 Jul 2026",
        time: "09:15 AM",
        status: "Pending Review",
    },
    {
        id: "REQ-250729-004",
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 234 567 8903",
        avatar: "https://i.pravatar.cc/80?img=47",
        type: "Loan Request",
        detailsTitle: "Loan Type: Personal Loan",
        detailsSub: "Amount: $15,000",
        date: "29 Jul 2026",
        time: "08:50 AM",
        status: "Pending Review",
    },
];

function StatusPill({ status }) {
    return (
        <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
            {status}
        </span>
    );
}

function TypeBadge({ type }) {
    const cfg = typeBadge[type];
    const Icon = cfg.icon;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${cfg.className}`}
        >
            <Icon size={13} />
            {type}
        </span>
    );
}

export const PendingRequests = () => {
    const [search, setSearch] = useState("");

    return (
        <div className="min-h-screen w-full bg-zen-light-bg-  p-6 dark:bg-zen-bg">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-zen-light-text dark:text-zen-text">
                        Pending Requests
                    </h1>
                    <p className="mt-1 text-sm text-zen-muted dark:text-zen-muted-dark">
                        Review and take action on all pending requests
                    </p>
                </div>
                <button className="flex items-center gap-2 rounded-lg border border-zen-border bg-white px-4 py-2 text-sm font-medium text-zen-light-text shadow-sm hover:bg-zen-bg dark:border-zen-border-dark dark:bg-zen-card-dark ">
                    <Download size={16} />
                    Export Report
                </button>
            </div>

            {/* Stat cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div
                            key={s.label}
                            className="flex items-start gap-3 rounded-2xl border border-zen-border bg-white p-4 shadow-sm dark:border-zen-light-border dark:bg-zen-bg"
                        >
                            <div className={`rounded-xl p-2.5 ${s.iconBg}`}>
                                <Icon size={20} className={s.iconColor} />
                            </div>
                            <div>
                                <p className="text-sm text-zen-muted dark:text-zen-muted-dark">
                                    {s.label}
                                </p>
                                <p className="text-xl font-semibold text-zen-light-text dark:text-zen-text">
                                    {s.value}
                                </p>
                                <p
                                    className={`text-xs ${s.subColor || "text-zen-light-muted dark:text-zen-muted"
                                        }`}
                                >
                                    {s.sub}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-zen-border bg-white p-3 shadow-sm dark:border-zen-border dark:bg-zen-card">
                <div className="relative min-w-[240px] flex-1">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zen-muted dark:text-zen-muted-dark"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email or phone..."
                        className="w-full rounded-lg border border-zen-border bg-zen-light-bg py-2 pl-9 pr-3 text-sm text-zen-text outline-none focus:border-zen-blue-400 dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                    />
                </div>

                <button className="flex items-center gap-2 rounded-lg border border-zen-border bg-white px-3 py-2 text-sm text-zen-light-text dark:border-zen-border dark:bg-zen-card dark:text-zen-text">
                    All Types
                    <ChevronRight size={14} className="rotate-90" />
                </button>

                <button className="flex items-center gap-2 rounded-lg border border-zen-border bg-white px-3 py-2 text-sm text-zen-light-text dark:border-zen-border dark:bg-zen-card dark:text-zen-text">
                    All Status
                    <ChevronRight size={14} className="rotate-90" />
                </button>

                <button className="flex items-center gap-2 rounded-lg border border-zen-border bg-white px-3 py-2 text-sm text-zen-light-text dark:border-zen-border dark:bg-zen-card dark:text-zen-text">
                    <Calendar size={14} />
                    Date Range
                </button>

                <button className="flex items-center gap-2 rounded-lg border border-zen-border bg-white px-3 py-2 text-sm text-zen-light-text dark:border-zen-border dark:bg-zen-card dark:text-zen-text">
                    <Filter size={14} />
                    Clear Filters
                </button>

                <div className="ml-auto flex items-center gap-2 text-sm text-zen-muted dark:text-zen-muted-dark">
                    Newest First
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-zen-border bg-white shadow-sm dark:border-zen-border-dark dark:bg-zen-card-dark">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-zen-border text-xs uppercase tracking-wide text-zen-muted dark:border-zen-border-dark dark:text-zen-muted-dark">
                                <th className="px-5 py-3 font-medium">Request ID</th>
                                <th className="px-5 py-3 font-medium">Requester</th>
                                <th className="px-5 py-3 font-medium">Type</th>
                                <th className="px-5 py-3 font-medium">Details</th>
                                <th className="px-5 py-3 font-medium">Submitted On</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((r) => (
                                <tr
                                    key={r.id}
                                    className="border-b border-zen-border last:border-0 hover:bg-zen-bg dark:border-zen-border-dark dark:hover:bg-zen-bg-dark/40"
                                >
                                    <td className="px-5 py-4 font-medium text-zen-text dark:text-zen-text-dark">
                                        {r.id}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={r.avatar}
                                                alt={r.name}
                                                className="h-9 w-9 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-zen-text dark:text-zen-text-dark">
                                                    {r.name}
                                                </p>
                                                <p className="text-xs text-zen-muted dark:text-zen-muted-dark">
                                                    {r.email}
                                                </p>
                                                <p className="text-xs text-zen-muted dark:text-zen-muted-dark">
                                                    {r.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <TypeBadge type={r.type} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-zen-text dark:text-zen-text-dark">
                                            {r.detailsTitle}
                                        </p>
                                        <p className="text-xs text-zen-muted dark:text-zen-muted-dark">
                                            {r.detailsSub}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-zen-text dark:text-zen-text-dark">
                                            {r.date}
                                        </p>
                                        <p className="text-xs text-zen-muted dark:text-zen-muted-dark">
                                            {r.time}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusPill status={r.status} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="rounded-lg bg-zen-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-zen-blue-700">
                                                Review
                                            </button>
                                            <button className="rounded-lg p-1.5 text-zen-muted hover:bg-zen-bg dark:text-zen-muted-dark dark:hover:bg-zen-bg-dark/40">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zen-light-border px-5 py-4 dark:border-zen-border">
                    <p className="text-sm text-zen-muted dark:text-zen-muted">
                        Showing 1 to 4 of 73 requests
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-zen-light-border text-zen-muted hover:bg-zen-bg dark:border-zen-border dark:text-zen-muted dark:hover:bg-dark/40">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-zen-blue-600 text-sm font-medium text-dark">
                            1
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-zen-light-border text-sm text-zen-light-text hover:bg-zen-bg dark:border-zen-border dark:text-zen-text dark:hover:bg-dark/40">
                            2
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-zen-light-border text-sm text-zen-light-text hover:bg-zen-bg dark:border-zen-border dark:text-zen-text dark:hover:bg-dark/40">
                            3
                        </button>
                        <span className="px-1 text-zen-muted dark:text-zen-muted-dark">
                            ...
                        </span>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-zen-light-border text-sm text-zen-light-text hover:bg-zen-bg dark:border-zen-border dark:text-zen-text dark:hover:bg-dark/40">
                            13
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-zen-border text-zen-muted hover:bg-zen-bg dark:border-zen-border-dark dark:text-zen-muted-dark dark:hover:bg-zen-bg-dark/40">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}