/**
 * Accounts.jsx
 * ---------------------------------------------------------------------------
 * Admin page for browsing and managing bank accounts. Sibling to
 * AllUsers.jsx, CardRequests.jsx, KycVerification.jsx, and
 * ManualCreditDebit.jsx — same `zen-*` token system, same list/detail
 * pattern. Read KycVerification.jsx's header comment first if this is
 * your first time back in this set of files.
 *
 * WHY THIS IS SEPARATE FROM AllUsers.jsx:
 *   AllUsers manages the PERSON (contact info, KYC, suspend/close the
 *   person's access). Accounts manages the ACCOUNTS themselves — and a
 *   single user can have more than one (e.g. a Checking + a Savings, or
 *   a Personal + a Business account). This page's list is therefore
 *   keyed by account, not by user — the same person's name can appear
 *   on more than one row if they hold multiple accounts.
 *
 *   Each account row still shows who holds it (avatar + name + email)
 *   so you don't lose that context, but the actions here are
 *   account-level (Freeze / Unfreeze / Close THIS account), not
 *   user-level (that's AllUsers' job).
 *
 * RELATIONSHIP TO ManualCreditDebit.jsx:
 *   That page is for moving money in/out of a balance. This page is for
 *   managing the account's STATE (frozen, active, closed) and viewing
 *   its details. The detail view here has an "Adjust balance" button
 *   that should eventually deep-link into ManualCreditDebit.jsx
 *   pre-filled with this account's holder — wire that up once you add
 *   real routing (see the TODO near that button).
 *
 * ACCOUNT STATUS MODEL (kept intentionally different from user status):
 *   active   – normal, fully usable
 *   frozen   – temporarily blocked (admin-initiated hold — e.g. fraud
 *              investigation, dispute, court order) — reversible
 *   dormant  – no activity for a long period, flagged for review, but
 *              NOT the same as frozen (dormant is a system observation,
 *              frozen is a deliberate admin action)
 *   closed   – permanently shut, terminal state
 * ---------------------------------------------------------------------------
 */

import React, { useState } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Landmark,
    Wallet,
    Snowflake,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    History,
    AlertTriangle,
} from "lucide-react";

/* ========================================================================
 * 1. STATS CARDS
 * ==================================================================== */
const stats = [
    {
        label: "Total accounts",
        value: 1342,
        sub: "Across all users",
        icon: Landmark,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
        label: "Active",
        value: 1260,
        sub: "In good standing",
        icon: CheckCircle2,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
        subColor: "text-green-600 dark:text-green-400",
    },
    {
        label: "Frozen",
        value: 9,
        sub: "Admin hold in place",
        icon: Snowflake,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        subColor: "text-blue-600 dark:text-blue-400",
    },
    {
        label: "Dormant",
        value: 41,
        sub: "No recent activity",
        icon: Clock,
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
        subColor: "text-amber-600 dark:text-amber-400",
    },
];

/* ========================================================================
 * 2. FILTER TABS
 * ==================================================================== */
const filterTabs = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "frozen", label: "Frozen" },
    { value: "dormant", label: "Dormant" },
    { value: "closed", label: "Closed" },
];

/* ========================================================================
 * 3. MOCK ACCOUNTS
 * ------------------------------------------------------------------------
 * SHAPE:
 *   id              string   – account id, e.g. "ACC-88213"
 *   accountNumber   string   – masked
 *   type            "Checking" | "Savings" | "Business"
 *   currency        "USD" etc.
 *   balance         number
 *   status          "active" | "frozen" | "dormant" | "closed"
 *   opened          display-formatted date
 *   lastActivity    display-formatted date
 *   holder          { name, email, avatar } — the account owner
 *   recentActivity  array of { label, amount, direction: "in"|"out", date }
 *                   — small illustrative list, NOT a full ledger. A real
 *                   transactions list belongs on a dedicated
 *                   Transactions page; this is just a glance.
 *   freezeReason    string | null
 * ==================================================================== */
const initialAccounts = [
    {
        id: "ACC-88213",
        accountNumber: "**** 4471",
        type: "Checking",
        currency: "USD",
        balance: 4280.12,
        status: "active",
        opened: "14 Feb 2025",
        lastActivity: "29 Jul 2026",
        holder: {
            name: "John Doe",
            email: "john.doe@email.com",
            avatar: "https://i.pravatar.cc/120?img=12",
        },
        recentActivity: [
            { label: "Grocery Mart", amount: 84.2, direction: "out", date: "28 Jul" },
            { label: "Payroll deposit", amount: 2100.0, direction: "in", date: "25 Jul" },
            { label: "Electric bill", amount: 96.5, direction: "out", date: "22 Jul" },
        ],
        freezeReason: null,
    },
    {
        id: "ACC-88214",
        accountNumber: "**** 4472",
        type: "Savings",
        currency: "USD",
        balance: 12800.0,
        status: "active",
        opened: "14 Feb 2025",
        lastActivity: "18 Jul 2026",
        holder: {
            name: "John Doe",
            email: "john.doe@email.com",
            avatar: "https://i.pravatar.cc/120?img=12",
        },
        recentActivity: [
            { label: "Transfer from Checking", amount: 500.0, direction: "in", date: "18 Jul" },
            { label: "Interest payment", amount: 12.4, direction: "in", date: "01 Jul" },
        ],
        freezeReason: null,
    },
    {
        id: "ACC-79045",
        accountNumber: "**** 8820",
        type: "Checking",
        currency: "USD",
        balance: 120.4,
        status: "frozen",
        opened: "02 Nov 2024",
        lastActivity: "18 Jul 2026",
        holder: {
            name: "Grace Obi",
            email: "grace.obi@email.com",
            avatar: "https://i.pravatar.cc/120?img=48",
        },
        recentActivity: [
            { label: "ATM withdrawal (flagged)", amount: 400.0, direction: "out", date: "18 Jul" },
            { label: "POS purchase (flagged)", amount: 210.0, direction: "out", date: "17 Jul" },
        ],
        freezeReason: "Multiple flagged transactions under fraud review.",
    },
    {
        id: "ACC-60312",
        accountNumber: "**** 5678",
        type: "Business",
        currency: "USD",
        balance: 0.0,
        status: "closed",
        opened: "20 May 2023",
        lastActivity: "01 Jun 2026",
        holder: {
            name: "Michael Brown",
            email: "michael.b@email.com",
            avatar: "https://i.pravatar.cc/120?img=51",
        },
        recentActivity: [{ label: "Final balance withdrawal", amount: 640.0, direction: "out", date: "01 Jun" }],
        freezeReason: null,
    },
    {
        id: "ACC-51190",
        accountNumber: "**** 1190",
        type: "Savings",
        currency: "USD",
        balance: 890.0,
        status: "dormant",
        opened: "10 Jan 2022",
        lastActivity: "03 Feb 2025",
        holder: {
            name: "Sarah Johnson",
            email: "sarah.j@email.com",
            avatar: "https://i.pravatar.cc/120?img=47",
        },
        recentActivity: [{ label: "Interest payment", amount: 1.1, direction: "in", date: "01 Feb 2025" }],
        freezeReason: null,
    },
];

/* ========================================================================
 * 4. BADGE CONFIG
 * ==================================================================== */
const statusMeta = {
    active: {
        label: "Active",
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        icon: CheckCircle2,
    },
    frozen: {
        label: "Frozen",
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        icon: Snowflake,
    },
    dormant: {
        label: "Dormant",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        icon: Clock,
    },
    closed: {
        label: "Closed",
        className: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700/40 dark:text-zinc-300",
        icon: XCircle,
    },
};

function StatusBadge({ status }) {
    const meta = statusMeta[status];
    const Icon = meta.icon;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${meta.className}`}
        >
            <Icon size={13} />
            {meta.label}
        </span>
    );
}

/* ========================================================================
 * 5. LIST VIEW
 * ==================================================================== */
function AccountsList({ accounts, activeFilter, onFilterChange, onSelect }) {
    const [search, setSearch] = useState("");

    const filtered = accounts
        .filter((a) => activeFilter === "all" || a.status === activeFilter)
        .filter((a) =>
            `${a.holder.name} ${a.holder.email} ${a.accountNumber} ${a.id} ${a.type}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    return (
        <>
            {/* --- Status filter tabs --- */}
            <div className="mb-4 flex flex-wrap gap-2">
                {filterTabs.map((tab) => {
                    const isActive = activeFilter === tab.value;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => onFilterChange(tab.value)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${isActive
                                ? "bg-zen-primary text-white"
                                : "border border-zen-light-border bg-zen-light-card text-zen-light-text hover:bg-zen-light-bg dark:border-zen-border dark:bg-zen-card dark:text-zen-text dark:hover:bg-zen-bg/60"
                                }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* --- Search bar --- */}
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-zen-light-border bg-zen-light-card p-3 shadow-sm dark:border-zen-border dark:bg-zen-card">
                <div className="relative min-w-[240px] flex-1">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by holder, email, account number or ID..."
                        className="w-full rounded-lg border border-zen-light-border bg-zen-light-bg py-2 pl-9 pr-3 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                    />
                </div>
            </div>

            {/* --- Table --- */}
            <div className="overflow-hidden rounded-2xl border border-zen-light-border bg-zen-light-card shadow-sm dark:border-zen-border dark:bg-zen-card">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-zen-light-border text-xs uppercase tracking-wide text-zen-light-muted dark:border-zen-border dark:text-zen-muted">
                                <th className="px-5 py-3 font-medium">Account</th>
                                <th className="px-5 py-3 font-medium">Holder</th>
                                <th className="px-5 py-3 font-medium">Type</th>
                                <th className="px-5 py-3 font-medium">Balance</th>
                                <th className="px-5 py-3 font-medium">Last activity</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((a) => (
                                <tr
                                    key={a.id}
                                    onClick={() => onSelect(a)}
                                    className="cursor-pointer border-b border-zen-light-border last:border-0 hover:bg-zen-light-bg dark:border-zen-border dark:hover:bg-zen-bg/60"
                                >
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-zen-light-text dark:text-zen-text">{a.id}</p>
                                        <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                            {a.accountNumber}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={a.holder.avatar}
                                                alt={a.holder.name}
                                                className="h-9 w-9 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-zen-light-text dark:text-zen-text">
                                                    {a.holder.name}
                                                </p>
                                                <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                                    {a.holder.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-zen-light-text dark:text-zen-text">{a.type}</td>
                                    <td className="px-5 py-4 text-zen-light-text dark:text-zen-text">
                                        ${a.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-5 py-4 text-zen-light-muted dark:text-zen-muted">
                                        {a.lastActivity}
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge status={a.status} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelect(a);
                                            }}
                                            className="flex items-center gap-1.5 rounded-lg bg-zen-primary px-4 py-1.5 text-xs font-medium text-white hover:bg-zen-secondary"
                                        >
                                            View
                                            <ChevronRight size={13} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-5 py-10 text-center text-sm text-zen-light-muted dark:text-zen-muted"
                                    >
                                        No accounts match your search or filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

/* ========================================================================
 * 6. DETAIL VIEW
 * ------------------------------------------------------------------------
 * Props:
 *   account         – selected account object
 *   onBack
 *   onToggleFreeze  – (accountId, freeze: boolean, reason) => void
 *   onCloseAccount  – (accountId) => void
 * ==================================================================== */
function AccountDetail({ account, onBack, onToggleFreeze, onCloseAccount }) {
    const [freezeReason, setFreezeReason] = useState("");
    const [showFreezeReason, setShowFreezeReason] = useState(false);
    const [closeConfirmText, setCloseConfirmText] = useState("");

    const isClosed = account.status === "closed";
    const isFrozen = account.status === "frozen";

    function handleFreeze() {
        if (!freezeReason.trim()) return;
        onToggleFreeze(account.id, true, freezeReason.trim());
        setFreezeReason("");
        setShowFreezeReason(false);
    }

    function handleUnfreeze() {
        onToggleFreeze(account.id, false, null);
    }

    function handleClose() {
        if (closeConfirmText.trim().toUpperCase() !== "CONFIRM") return;
        onCloseAccount(account.id);
        setCloseConfirmText("");
    }

    return (
        <div>
            {/* --- Header --- */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-zen-light-border text-zen-light-muted hover:bg-zen-light-bg dark:border-zen-border dark:text-zen-muted dark:hover:bg-zen-bg/60"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-zen-light-text dark:text-zen-text">
                            {account.id}
                        </h1>
                        <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                            {account.type} &middot; {account.accountNumber}
                        </p>
                    </div>
                </div>
                <StatusBadge status={account.status} />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* ================= COLUMN 1: Balance + holder ================= */}
                <div className="flex flex-col gap-5 rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card lg:col-span-1">
                    <div>
                        <p className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            <Wallet size={13} />
                            Current balance
                        </p>
                        <p className="text-3xl font-semibold text-zen-light-text dark:text-zen-text">
                            ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-zen-light-muted dark:text-zen-muted">{account.currency}</p>
                    </div>

                    <div className="border-t border-zen-light-border pt-4 dark:border-zen-border">
                        <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            <User size={13} />
                            Account holder
                        </p>
                        <div className="flex items-center gap-3">
                            <img
                                src={account.holder.avatar}
                                alt={account.holder.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-sm font-medium text-zen-light-text dark:text-zen-text">
                                    {account.holder.name}
                                </p>
                                <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                    {account.holder.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-zen-light-border pt-4 dark:border-zen-border">
                        <div className="flex items-center gap-2 text-sm text-zen-light-text dark:text-zen-text">
                            <Calendar size={14} className="text-zen-light-muted dark:text-zen-muted" />
                            Opened {account.opened}
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 text-sm text-zen-light-text dark:text-zen-text">
                            <Clock size={14} className="text-zen-light-muted dark:text-zen-muted" />
                            Last activity {account.lastActivity}
                        </div>
                    </div>

                    {isFrozen && account.freezeReason && (
                        <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Freeze reason</p>
                            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{account.freezeReason}</p>
                        </div>
                    )}
                </div>

                {/* ================= COLUMN 2: Recent activity glance ================= */}
                <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card lg:col-span-1">
                    <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                        <History size={13} />
                        Recent activity
                    </p>
                    {/*
            NOTE: this is a small illustrative glance, not a full ledger.
            Once you build the dedicated Transactions page, swap this for
            a "View all transactions" link filtered to this account, and
            keep only the last 3-5 here.
          */}
                    <div className="flex flex-col divide-y divide-zen-light-border dark:divide-zen-border">
                        {account.recentActivity.map((tx, i) => (
                            <div key={i} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full ${tx.direction === "in"
                                            ? "bg-green-100 dark:bg-green-900/30"
                                            : "bg-red-100 dark:bg-red-900/30"
                                            }`}
                                    >
                                        {tx.direction === "in" ? (
                                            <ArrowDownRight size={14} className="text-green-600 dark:text-green-400" />
                                        ) : (
                                            <ArrowUpRight size={14} className="text-red-600 dark:text-red-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-zen-light-text dark:text-zen-text">{tx.label}</p>
                                        <p className="text-xs text-zen-light-muted dark:text-zen-muted">{tx.date}</p>
                                    </div>
                                </div>
                                <p
                                    className={`text-sm font-medium ${tx.direction === "in"
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                        }`}
                                >
                                    {tx.direction === "in" ? "+" : "-"}${tx.amount.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* TODO: wire this to real navigation once ManualCreditDebit is
              routed — should deep-link there pre-filled with this
              account's holder, e.g. navigate(`/admin/manual-credit?user=${account.holder.email}`) */}
                    <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-zen-light-border py-2 text-xs font-medium text-zen-light-text hover:bg-zen-light-bg dark:border-zen-border dark:text-zen-text dark:hover:bg-zen-bg/60">
                        <Wallet size={13} />
                        Adjust balance
                    </button>
                </div>

                {/* ================= COLUMN 3: Account actions ================= */}
                <div className="flex flex-col gap-5 lg:col-span-1">
                    {!isClosed ? (
                        <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card">
                            <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                                <Snowflake size={13} />
                                Account actions
                            </p>

                            {/* Freeze / Unfreeze toggle */}
                            {isFrozen ? (
                                <button
                                    onClick={handleUnfreeze}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                                >
                                    <CheckCircle2 size={16} />
                                    Unfreeze account
                                </button>
                            ) : !showFreezeReason ? (
                                <button
                                    onClick={() => setShowFreezeReason(true)}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-500 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                    <Snowflake size={16} />
                                    Freeze account
                                </button>
                            ) : (
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900/40 dark:bg-blue-900/10">
                                    <label className="mb-1.5 block text-xs font-medium text-blue-700 dark:text-blue-400">
                                        Reason for freezing (required)
                                    </label>
                                    <textarea
                                        value={freezeReason}
                                        onChange={(e) => setFreezeReason(e.target.value)}
                                        rows={2}
                                        placeholder="e.g. Fraud investigation, dispute hold, court order"
                                        className="w-full resize-none rounded-lg border border-blue-200 bg-white p-2 text-sm text-zen-light-text outline-none focus:border-blue-400 dark:border-blue-900/40 dark:bg-zen-bg dark:text-zen-text"
                                    />
                                    <button
                                        onClick={handleFreeze}
                                        disabled={!freezeReason.trim()}
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Confirm freeze
                                    </button>
                                </div>
                            )}

                            {/* Close account — requires typing CONFIRM, same gate as
                  AllUsers.jsx's account closure */}
                            <div className="mt-3 border-t border-zen-light-border pt-3 dark:border-zen-border">
                                <p className="mb-1.5 text-xs text-zen-light-muted dark:text-zen-muted">
                                    Type <span className="font-mono font-medium">CONFIRM</span> to permanently close this account
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        value={closeConfirmText}
                                        onChange={(e) => setCloseConfirmText(e.target.value)}
                                        placeholder="CONFIRM"
                                        className="flex-1 rounded-lg border border-zen-light-border bg-zen-light-bg px-3 py-2 text-sm text-zen-light-text outline-none focus:border-red-400 dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                                    />
                                    <button
                                        onClick={handleClose}
                                        disabled={closeConfirmText.trim().toUpperCase() !== "CONFIRM"}
                                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Close
                                    </button>
                                </div>
                                {account.balance > 0 && (
                                    <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                                        <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                                        This account still has a balance of $
                                        {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}.
                                        Consider adjusting the balance before closing.
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="rounded-2xl border border-zen-light-border bg-zen-light-card p-4 text-center text-sm text-zen-light-muted shadow-sm dark:border-zen-border dark:bg-zen-card dark:text-zen-muted">
                            This account is closed. No further actions available.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ========================================================================
 * 7. MAIN EXPORTED COMPONENT
 * ==================================================================== */
export const Accounts = () => {
    const [accounts, setAccounts] = useState(initialAccounts);
    const [selected, setSelected] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");

    function syncSelected(updatedList, id) {
        const updated = updatedList.find((a) => a.id === id);
        if (updated) setSelected(updated);
    }

    function handleToggleFreeze(id, freeze, reason) {
        setAccounts((prev) => {
            const next = prev.map((a) =>
                a.id === id
                    ? { ...a, status: freeze ? "frozen" : "active", freezeReason: freeze ? reason : null }
                    : a
            );
            syncSelected(next, id);
            return next;
        });
    }

    function handleCloseAccount(id) {
        setAccounts((prev) => {
            const next = prev.map((a) => (a.id === id ? { ...a, status: "closed" } : a));
            syncSelected(next, id);
            return next;
        });
    }

    return (
        <div className="min-h-screen w-full bg-zen-light-bg p-6 dark:bg-zen-bg">
            {/* --- Page header --- */}
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-zen-light-text dark:text-zen-text">
                        Accounts
                    </h1>
                    <p className="mt-1 text-sm text-zen-light-muted dark:text-zen-muted">
                        {selected ? "Viewing account" : "Browse and manage all bank accounts"}
                    </p>
                </div>
            </div>

            {/* --- Stats cards --- */}
            {!selected && (
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={s.label}
                                className="flex items-start gap-3 rounded-2xl border border-zen-light-border bg-zen-light-card p-4 shadow-sm dark:border-zen-border dark:bg-zen-card"
                            >
                                <div className={`rounded-xl p-2.5 ${s.iconBg}`}>
                                    <Icon size={20} className={s.iconColor} />
                                </div>
                                <div>
                                    <p className="text-sm text-zen-light-muted dark:text-zen-muted">{s.label}</p>
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
            )}

            {/* --- List / Detail switch --- */}
            {selected ? (
                <AccountDetail
                    account={selected}
                    onBack={() => setSelected(null)}
                    onToggleFreeze={handleToggleFreeze}
                    onCloseAccount={handleCloseAccount}
                />
            ) : (
                <AccountsList
                    accounts={accounts}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    onSelect={setSelected}
                />
            )}
        </div>
    );
};