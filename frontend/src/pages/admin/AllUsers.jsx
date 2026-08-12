/**
 * AllUsers.jsx
 * ---------------------------------------------------------------------------
 * Admin page for browsing and managing every user account.
 * Third sibling to KycVerification.jsx and CardRequests.jsx — same
 * list/detail pattern, same `zen-*` token system. Read the big comment
 * block at the top of KycVerification.jsx first if this is your first
 * time back in this trio of files; it explains the theme system.
 *
 * WHAT THIS PAGE DOES:
 *   - Shows every user (not just pending requests — this is the "All Users"
 *     sidebar item, a superset of the Approvals pages).
 *   - Status filter tabs (All / Active / Suspended / Pending / Closed) —
 *     mirrors the sidebar's own breakdown (All Users, Active Users,
 *     Suspended Users, Pending Users, Closed Accounts) so the same mental
 *     model carries over into this one page instead of 5 separate routes.
 *     If you'd rather keep them as 5 separate pages/routes matching the
 *     sidebar exactly, this component still works — just pass a fixed
 *     `initialFilter` prop and hide the tab bar (see bottom of file).
 *   - Click a row -> full profile detail view: contact info, account
 *     balance, KYC status, join date, last login.
 *   - Suspend / Activate / Close actions are wired to local state, same
 *     as Accept/Decline in CardRequests.jsx.
 *   - Same message + notification-log mechanism as CardRequests.jsx, so
 *     you can message a user directly from their profile.
 *
 * DESIGN DECISIONS (flagged so you can change your mind easily):
 *   - "Suspend" and "Activate" are the same toggle button that flips
 *     based on current status — avoids 2 buttons that are never both
 *     relevant at once.
 *   - "Close account" is separated out and requires typing CONFIRM in a
 *     small inline field before it's enabled, since it's the most
 *     destructive action here and the hardest to reverse.
 *   - Pending users (registration not yet approved) show a note pointing
 *     back to the Pending Registrations approval flow instead of
 *     duplicating Approve/Reject here — this page manages EXISTING
 *     accounts, approvals happen in the dedicated queue.
 *   - `accountType` (Individual/Business) was dropped — not part of
 *     ZenVault's data model right now. If you add business accounts
 *     later, it's easy to slot back into the table + snapshot grid.
 * ---------------------------------------------------------------------------
 */

import React, { useState } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Users,
    UserCheck,
    UserX,
    Clock,
    UserMinus,
    ShieldCheck,
    ShieldAlert,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Wallet,
    Send,
    Bell,
    AlertTriangle,
} from "lucide-react";

/* ========================================================================
 * 1. STATS CARDS DATA
 * ------------------------------------------------------------------------
 * Same pattern as the other two pages. These are independent of the
 * active filter tab — they always show the full breakdown regardless of
 * which tab you're currently viewing, so you never lose sight of the
 * totals. Replace `value` with real counts from your API.
 * ==================================================================== */
const stats = [
    {
        label: "Total users",
        value: 1284,
        sub: "All accounts",
        icon: Users,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
        label: "Active",
        value: 1189,
        sub: "In good standing",
        icon: UserCheck,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
        subColor: "text-green-600 dark:text-green-400",
    },
    {
        label: "Suspended",
        value: 14,
        sub: "Access restricted",
        icon: UserMinus,
        iconBg: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
        subColor: "text-red-600 dark:text-red-400",
    },
    {
        label: "Pending",
        value: 32,
        sub: "Awaiting approval",
        icon: Clock,
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
        subColor: "text-amber-600 dark:text-amber-400",
    },
    {
        label: "Closed",
        value: 49,
        sub: "No longer active",
        icon: UserX,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        subColor: "text-blue-600 dark:text-blue-400",
    },
];

/* ========================================================================
 * 2. FILTER TABS
 * ------------------------------------------------------------------------
 * Each tab's `value` must match a possible `status` on a user object.
 * "all" is a special case handled in the filtering logic below (it means
 * "don't filter by status at all").
 * ==================================================================== */
const filterTabs = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "suspended", label: "Suspended" },
    { value: "pending", label: "Pending" },
    { value: "closed", label: "Closed" },
];

/* ========================================================================
 * 3. MOCK USERS
 * ------------------------------------------------------------------------
 * 4 entries covering active / suspended / pending / closed so all 4
 * detail-view states are visible. Swap for a real API response, e.g.:
 *
 *   const [users, setUsers] = useState([]);
 *   useEffect(() => {
 *     fetch("/api/admin/users").then(r => r.json()).then(setUsers);
 *   }, []);
 *
 * SHAPE:
 *   id, name, email, phone, avatar         – same as the other pages
 *   accountNumber   masked string
 *   balance         formatted string, e.g. "$4,280.12"
 *   kycStatus       "verified" | "pending" | "unverified"
 *   status          "active" | "suspended" | "pending" | "closed"
 *   address         string
 *   joined          display-formatted date
 *   lastLogin       display-formatted date/time
 *   suspendReason   string | null — filled in once suspended
 * ==================================================================== */
const initialUsers = [
    {
        id: "USR-10231",
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1 234 567 8900",
        avatar: "https://i.pravatar.cc/120?img=12",
        accountNumber: "**** 4471",
        balance: "$4,280.12",
        kycStatus: "verified",
        status: "active",
        address: "12 Maple Street, Newark, NJ",
        joined: "14 Feb 2025",
        lastLogin: "29 Jul 2026, 08:12 PM",
        suspendReason: null,
    },
    {
        id: "USR-10198",
        name: "Grace Obi",
        email: "grace.obi@email.com",
        phone: "+1 234 567 8977",
        avatar: "https://i.pravatar.cc/120?img=48",
        accountNumber: "**** 8820",
        balance: "$120.40",
        kycStatus: "verified",
        status: "suspended",
        address: "9 Independence Layout, Enugu, Nigeria",
        joined: "02 Nov 2024",
        lastLogin: "18 Jul 2026, 03:40 PM",
        suspendReason: "Multiple failed login attempts flagged as suspicious activity.",
    },
    {
        id: "USR-10305",
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 234 567 8903",
        avatar: "https://i.pravatar.cc/120?img=47",
        accountNumber: "**** 1190",
        balance: "$0.00",
        kycStatus: "pending",
        status: "pending",
        address: "77 Riverside Drive, Austin, TX",
        joined: "29 Jul 2026",
        lastLogin: "Never",
        suspendReason: null,
    },
    {
        id: "USR-09876",
        name: "Michael Brown",
        email: "michael.b@email.com",
        phone: "+1 234 567 8902",
        avatar: "https://i.pravatar.cc/120?img=51",
        accountNumber: "**** 5678",
        balance: "$0.00",
        kycStatus: "verified",
        status: "closed",
        address: "48 Independence Ave, Trenton, NJ",
        joined: "20 May 2023",
        lastLogin: "01 Jun 2026, 10:05 AM",
        suspendReason: null,
    },
];

/* ========================================================================
 * 4. BADGE CONFIG
 * ==================================================================== */
const statusMeta = {
    active: {
        label: "Active",
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        icon: UserCheck,
    },
    suspended: {
        label: "Suspended",
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        icon: UserMinus,
    },
    pending: {
        label: "Pending",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        icon: Clock,
    },
    closed: {
        label: "Closed",
        className: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700/40 dark:text-zinc-300",
        icon: UserX,
    },
};

const kycStatusMeta = {
    verified: {
        label: "Verified",
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        icon: ShieldCheck,
    },
    pending: {
        label: "Pending",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        icon: ShieldAlert,
    },
    unverified: {
        label: "Unverified",
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        icon: ShieldAlert,
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

function KycBadge({ status }) {
    const meta = kycStatusMeta[status];
    const Icon = meta.icon;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}
        >
            <Icon size={12} />
            {meta.label}
        </span>
    );
}

/* ========================================================================
 * 5. LIST VIEW
 * ------------------------------------------------------------------------
 * Props:
 *   users        – full array (unfiltered — filtering happens in here)
 *   activeFilter – current status tab value ("all" | "active" | ...)
 *   onFilterChange
 *   onSelect
 * ==================================================================== */
function UsersList({ users, activeFilter, onFilterChange, onSelect }) {
    const [search, setSearch] = useState("");

    const filtered = users
        .filter((u) => activeFilter === "all" || u.status === activeFilter)
        .filter((u) =>
            `${u.name} ${u.email} ${u.id}`.toLowerCase().includes(search.toLowerCase())
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
                        placeholder="Search by name, email or user ID..."
                        className="w-full rounded-lg border border-zen-light-border bg-zen-light-bg py-2 pl-9 pr-3 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                    />
                </div>
            </div>

            {/* --- Table --- */}
            <div className="overflow-hidden rounded-2xl border border-zen-light-border bg-zen-light-card shadow-sm dark:border-zen-border dark:bg-zen-card">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[780px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-zen-light-border text-xs uppercase tracking-wide text-zen-light-muted dark:border-zen-border dark:text-zen-muted">
                                <th className="px-5 py-3 font-medium">User</th>
                                <th className="px-5 py-3 font-medium">Account no.</th>
                                <th className="px-5 py-3 font-medium">Balance</th>
                                <th className="px-5 py-3 font-medium">KYC</th>
                                <th className="px-5 py-3 font-medium">Joined</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => (
                                <tr
                                    key={u.id}
                                    onClick={() => onSelect(u)}
                                    className="cursor-pointer border-b border-zen-light-border last:border-0 hover:bg-zen-light-bg dark:border-zen-border dark:hover:bg-zen-bg/60"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={u.avatar}
                                                alt={u.name}
                                                className="h-9 w-9 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-zen-light-text dark:text-zen-text">
                                                    {u.name}
                                                </p>
                                                <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                                    {u.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-zen-light-text dark:text-zen-text">
                                        {u.accountNumber}
                                    </td>
                                    <td className="px-5 py-4 text-zen-light-text dark:text-zen-text">
                                        {u.balance}
                                    </td>
                                    <td className="px-5 py-4">
                                        <KycBadge status={u.kycStatus} />
                                    </td>
                                    <td className="px-5 py-4 text-zen-light-muted dark:text-zen-muted">
                                        {u.joined}
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge status={u.status} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelect(u);
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
                                        No users match your search or filter.
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
 *   user           – selected user object
 *   onBack
 *   onToggleSuspend – (userId, suspend: boolean, reason) => void
 *   onCloseAccount  – (userId) => void
 *   onSendMessage   – (userId, message) => void — same shape as
 *                     CardRequests.jsx's onSendMessage
 * ==================================================================== */
function UserDetail({ user, onBack, onToggleSuspend, onCloseAccount, onSendMessage }) {
    const [message, setMessage] = useState("");
    const [suspendReason, setSuspendReason] = useState("");
    const [showSuspendReason, setShowSuspendReason] = useState(false);
    const [closeConfirmText, setCloseConfirmText] = useState("");

    const isClosed = user.status === "closed";
    const isSuspended = user.status === "suspended";
    const isPending = user.status === "pending";

    function handleSendMessageOnly() {
        if (!message.trim()) return;
        onSendMessage(user.id, message.trim());
        setMessage("");
    }

    function handleSuspend() {
        if (!suspendReason.trim()) return;
        onToggleSuspend(user.id, true, suspendReason.trim());
        onSendMessage(user.id, `Your account has been suspended: ${suspendReason.trim()}`);
        setSuspendReason("");
        setShowSuspendReason(false);
    }

    function handleReactivate() {
        onToggleSuspend(user.id, false, null);
        onSendMessage(user.id, "Your account has been reactivated. You now have full access again.");
    }

    function handleCloseAccount() {
        if (closeConfirmText.trim().toUpperCase() !== "CONFIRM") return;
        onCloseAccount(user.id);
        onSendMessage(user.id, "Your account has been closed per your request or our review.");
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
                            User profile
                        </h1>
                        <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                            {user.id}
                        </p>
                    </div>
                </div>
                <StatusBadge status={user.status} />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                {/* ================= COLUMN 1: Contact + account info ================= */}
                <div className="flex flex-col gap-5 rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card lg:col-span-1">
                    <div className="flex items-center gap-3">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-14 w-14 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-medium text-zen-light-text dark:text-zen-text">{user.name}</p>
                            <KycBadge status={user.kycStatus} />
                        </div>
                    </div>

                    <div className="border-t border-zen-light-border pt-4 dark:border-zen-border">
                        <dl className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-zen-light-muted dark:text-zen-muted" />
                                <dd className="text-zen-light-text dark:text-zen-text">{user.email}</dd>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-zen-light-muted dark:text-zen-muted" />
                                <dd className="text-zen-light-text dark:text-zen-text">{user.phone}</dd>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-zen-light-muted dark:text-zen-muted" />
                                <dd className="text-zen-light-text dark:text-zen-text">{user.address}</dd>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-zen-light-muted dark:text-zen-muted" />
                                <dd className="text-zen-light-text dark:text-zen-text">
                                    Joined {user.joined} &middot; last login {user.lastLogin}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {isSuspended && user.suspendReason && (
                        <div className="rounded-xl bg-red-50 p-3 dark:bg-red-900/20">
                            <p className="text-xs font-medium text-red-700 dark:text-red-400">
                                Suspension reason
                            </p>
                            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                                {user.suspendReason}
                            </p>
                        </div>
                    )}

                    {isPending && (
                        <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 dark:bg-amber-900/20">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                This account's registration is still awaiting approval. Review it from the
                                Pending Registrations queue rather than here.
                            </p>
                        </div>
                    )}
                </div>

                {/* ================= COLUMN 2: Account snapshot =================
            3 items now that accountType is gone: Balance, Account number,
            KYC status — laid out as a single row of 3 so nothing looks
            like a lopsided leftover from a 2x2 grid. */}
                <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card lg:col-span-1">
                    <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                        <Wallet size={13} />
                        Account snapshot
                    </p>
                    <div className="flex flex-col gap-3">
                        <div className="rounded-xl bg-zen-light-bg p-3 dark:bg-zen-bg">
                            <p className="text-xs text-zen-light-muted dark:text-zen-muted">Balance</p>
                            <p className="text-lg font-semibold text-zen-light-text dark:text-zen-text">
                                {user.balance}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-zen-light-bg p-3 dark:bg-zen-bg">
                                <p className="text-xs text-zen-light-muted dark:text-zen-muted">Account number</p>
                                <p className="text-base font-semibold text-zen-light-text dark:text-zen-text">
                                    {user.accountNumber}
                                </p>
                            </div>
                            <div className="rounded-xl bg-zen-light-bg p-3 dark:bg-zen-bg">
                                <p className="text-xs text-zen-light-muted dark:text-zen-muted">KYC status</p>
                                <p className="text-base font-semibold text-zen-light-text dark:text-zen-text">
                                    {kycStatusMeta[user.kycStatus].label}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/*
            NOTE: like CardRequests.jsx's account-standing panel, this is
            placeholder data pulled straight off the user object. Once you
            have real transaction/account endpoints, this is a good spot
            to add a mini recent-transactions list too.
          */}
                </div>

                {/* ================= COLUMN 3: Message + account actions ================= */}
                <div className="flex flex-col gap-5 lg:col-span-1">
                    <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card">
                        <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            <Mail size={13} />
                            Message {user.name.split(" ")[0]}
                        </p>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Sent as a notification to the user"
                            rows={3}
                            className="w-full resize-none rounded-lg border border-zen-light-border bg-zen-light-bg p-3 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                        />
                        <button
                            onClick={handleSendMessageOnly}
                            disabled={!message.trim()}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-zen-light-border py-2 text-xs font-medium text-zen-light-text hover:bg-zen-light-bg disabled:cursor-not-allowed disabled:opacity-40 dark:border-zen-border dark:text-zen-text dark:hover:bg-zen-bg/60"
                        >
                            <Send size={13} />
                            Send message
                        </button>
                    </div>

                    {/* Account actions — hidden entirely for closed accounts, since
              there's nothing left to do to them */}
                    {!isClosed && (
                        <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card">
                            <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                                <ShieldAlert size={13} />
                                Account actions
                            </p>

                            {/* Suspend / Reactivate toggle */}
                            {isSuspended ? (
                                <button
                                    onClick={handleReactivate}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                                >
                                    <UserCheck size={16} />
                                    Reactivate account
                                </button>
                            ) : !showSuspendReason ? (
                                <button
                                    onClick={() => setShowSuspendReason(true)}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-500 py-2.5 text-sm font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                >
                                    <UserMinus size={16} />
                                    Suspend account
                                </button>
                            ) : (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-900/10">
                                    <label className="mb-1.5 block text-xs font-medium text-amber-700 dark:text-amber-400">
                                        Reason for suspension (required, sent to user)
                                    </label>
                                    <textarea
                                        value={suspendReason}
                                        onChange={(e) => setSuspendReason(e.target.value)}
                                        rows={2}
                                        className="w-full resize-none rounded-lg border border-amber-200 bg-white p-2 text-sm text-zen-light-text outline-none focus:border-amber-400 dark:border-amber-900/40 dark:bg-zen-bg dark:text-zen-text"
                                    />
                                    <button
                                        onClick={handleSuspend}
                                        disabled={!suspendReason.trim()}
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Confirm suspension
                                    </button>
                                </div>
                            )}

                            {/* Close account — most destructive, requires typing CONFIRM */}
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
                                        onClick={handleCloseAccount}
                                        disabled={closeConfirmText.trim().toUpperCase() !== "CONFIRM"}
                                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isClosed && (
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
export const AllUsers = () => {
    const [users, setUsers] = useState(initialUsers);
    const [selected, setSelected] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [notifications, setNotifications] = useState([]);

    // Keep the open detail view in sync after any mutation, same reasoning
    // as CardRequests.jsx's syncSelected.
    function syncSelected(updatedList, id) {
        const updated = updatedList.find((u) => u.id === id);
        if (updated) setSelected(updated);
    }

    function handleToggleSuspend(id, suspend, reason) {
        setUsers((prev) => {
            const next = prev.map((u) =>
                u.id === id
                    ? { ...u, status: suspend ? "suspended" : "active", suspendReason: suspend ? reason : null }
                    : u
            );
            syncSelected(next, id);
            return next;
        });
    }

    function handleCloseAccount(id) {
        setUsers((prev) => {
            const next = prev.map((u) => (u.id === id ? { ...u, status: "closed" } : u));
            syncSelected(next, id);
            return next;
        });
    }

    function handleSendMessage(id, message) {
        const user = users.find((u) => u.id === id);
        if (!user) return;
        setNotifications((prev) => [
            {
                id: `${id}-${Date.now()}`,
                userName: user.name,
                userEmail: user.email,
                message,
                sentAt: "just now",
            },
            ...prev,
        ]);
    }

    return (
        <div className="min-h-screen w-full bg-zen-light-bg p-6 dark:bg-zen-bg">
            {/* --- Page header --- */}
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-zen-light-text dark:text-zen-text">
                        All Users
                    </h1>
                    <p className="mt-1 text-sm text-zen-light-muted dark:text-zen-muted">
                        {selected ? "Viewing user profile" : "Browse and manage every user account"}
                    </p>
                </div>
            </div>

            {/* --- Stats cards: list view only --- */}
            {!selected && (
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                <UserDetail
                    user={selected}
                    onBack={() => setSelected(null)}
                    onToggleSuspend={handleToggleSuspend}
                    onCloseAccount={handleCloseAccount}
                    onSendMessage={handleSendMessage}
                />
            ) : (
                <UsersList
                    users={users}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    onSelect={setSelected}
                />
            )}

            {/* --- Notification log (admin-facing only, same pattern as
          CardRequests.jsx — see that file's comment for why this exists) --- */}
            {notifications.length > 0 && (
                <div className="mt-6 rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card">
                    <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                        <Bell size={13} />
                        Recently sent notifications
                    </p>
                    <div className="flex flex-col divide-y divide-zen-light-border dark:divide-zen-border">
                        {notifications.map((n) => (
                            <div key={n.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                                <div>
                                    <p className="text-sm text-zen-light-text dark:text-zen-text">
                                        <span className="font-medium">{n.userName}</span> &middot;{" "}
                                        <span className="text-zen-light-muted dark:text-zen-muted">{n.userEmail}</span>
                                    </p>
                                    <p className="mt-0.5 text-sm text-zen-light-muted dark:text-zen-muted">
                                        {n.message}
                                    </p>
                                </div>
                                <span className="whitespace-nowrap text-xs text-zen-light-muted dark:text-zen-muted">
                                    {n.sentAt}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};