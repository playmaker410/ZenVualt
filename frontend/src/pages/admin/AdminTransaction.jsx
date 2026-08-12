/**
 * Transactions.jsx
 * ---------------------------------------------------------------------------
 * Admin page for browsing the platform's transaction ledger. Sibling to
 * AllUsers.jsx / Accounts.jsx / CardRequests.jsx / KycVerification.jsx /
 * ManualCreditDebit.jsx — same `zen-*` token system, same list/detail
 * pattern. Read KycVerification.jsx's header comment first if this is
 * your first time back in this set of files.
 *
 * WHY THIS IS THE "BACKBONE" PAGE:
 *   Accounts.jsx's "Recent activity" panel is a 2-3 item glance, not a
 *   real ledger — it says so in its own comments. THIS page is the real
 *   ledger: every transaction, filterable, searchable, with a full
 *   detail view. Once this exists for real (backed by your Go API),
 *   Accounts.jsx's glance panel and any user detail views elsewhere
 *   should both link into this page filtered by account/user, instead
 *   of carrying their own separate mock data.
 *
 * TRANSACTION TYPES MODELED HERE:
 *   deposit       – money entering the platform (e.g. bank transfer in)
 *   withdrawal    – money leaving the platform
 *   transfer      – money moving between two accounts ON the platform
 *                   (has both a `from` and a `to`)
 *   card_payment  – a purchase made with a Zenvault card
 *
 * STATUS MODEL:
 *   completed  – settled, final (unless reversed)
 *   pending    – still processing
 *   failed     – did not complete (e.g. insufficient funds) — terminal,
 *                nothing further to do
 *   reversed   – was completed, then reversed by an admin — terminal
 *
 * ADMIN ACTIONS ON THIS PAGE:
 *   - Flag for review: a lightweight, non-destructive toggle. Doesn't
 *     change status, just marks the transaction for follow-up. No hard
 *     confirmation gate since it's easily undone.
 *   - Reverse transaction: the serious one. Only available on
 *     `completed` transactions. Requires a typed reason (same pattern
 *     as decline/suspend/freeze reasons elsewhere in this codebase).
 *     Conceptually this should trigger an actual balance adjustment on
 *     the backend (essentially a Manual Credit/Debit under the hood)
 *     plus a notification to the affected user — both are stubbed here
 *     with the same notification-log pattern used in CardRequests.jsx /
 *     AllUsers.jsx / ManualCreditDebit.jsx. See the TODO inside
 *     handleReverse for the real integration point.
 * ---------------------------------------------------------------------------
 */

import React, { useState } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    ArrowDownCircle,
    ArrowUpCircle,
    Repeat,
    CreditCard,
    CheckCircle2,
    Clock,
    XCircle,
    RotateCcw,
    Flag,
    Bell,
    History,
    Hash,
    Landmark,
    AlertTriangle,
} from "lucide-react";

/* ========================================================================
 * 1. STATS CARDS
 * ==================================================================== */
const stats = [
    {
        label: "Total volume",
        value: "$482,910",
        sub: "Last 30 days",
        icon: Landmark,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
        label: "Completed",
        value: 3186,
        sub: "Settled successfully",
        icon: CheckCircle2,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
        subColor: "text-green-600 dark:text-green-400",
    },
    {
        label: "Pending",
        value: 24,
        sub: "Still processing",
        icon: Clock,
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
        subColor: "text-amber-600 dark:text-amber-400",
    },
    {
        label: "Failed / reversed",
        value: 19,
        sub: "Needs no further action",
        icon: XCircle,
        iconBg: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
        subColor: "text-red-600 dark:text-red-400",
    },
];

/* ========================================================================
 * 2. FILTER TABS — filter by status, mirroring AllUsers.jsx / Accounts.jsx
 * ==================================================================== */
const filterTabs = [
    { value: "all", label: "All" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "reversed", label: "Reversed" },
];

/* ========================================================================
 * 3. TYPE CONFIG — icon + label per transaction type
 * ==================================================================== */
const typeMeta = {
    deposit: { label: "Deposit", icon: ArrowDownCircle, className: "text-green-600 dark:text-green-400" },
    withdrawal: { label: "Withdrawal", icon: ArrowUpCircle, className: "text-red-600 dark:text-red-400" },
    transfer: { label: "Transfer", icon: Repeat, className: "text-blue-600 dark:text-blue-400" },
    card_payment: { label: "Card payment", icon: CreditCard, className: "text-purple-600 dark:text-purple-400" },
};

/* ========================================================================
 * 4. MOCK TRANSACTIONS
 * ------------------------------------------------------------------------
 * SHAPE:
 *   id             string   – e.g. "TXN-902341"
 *   type           "deposit" | "withdrawal" | "transfer" | "card_payment"
 *   amount         number
 *   fee            number (0 if none)
 *   status         "completed" | "pending" | "failed" | "reversed"
 *   date           display-formatted date/time
 *   from           { name, accountNumber } | null — null for pure deposits
 *   to             { name, accountNumber } | null — null for pure withdrawals
 *   description    string — merchant name / memo / transfer note
 *   reference      string — external reference id, e.g. bank rail ref
 *   flagged        boolean
 *   flagReason     string | null
 *   reversedReason string | null
 * ==================================================================== */
const initialTransactions = [
    {
        id: "TXN-902341",
        type: "deposit",
        amount: 2100.0,
        fee: 0,
        status: "completed",
        date: "29 Jul 2026, 08:30 AM",
        from: null,
        to: { name: "John Doe", accountNumber: "**** 4471" },
        description: "Payroll deposit — Acme Corp",
        reference: "ACH-88213409",
        flagged: false,
        flagReason: null,
        reversedReason: null,
    },
    {
        id: "TXN-902298",
        type: "card_payment",
        amount: 84.2,
        fee: 0,
        status: "completed",
        date: "28 Jul 2026, 06:14 PM",
        from: { name: "John Doe", accountNumber: "**** 4471" },
        to: null,
        description: "Grocery Mart — POS purchase",
        reference: "CARD-55210981",
        flagged: false,
        flagReason: null,
        reversedReason: null,
    },
    {
        id: "TXN-902187",
        type: "transfer",
        amount: 500.0,
        fee: 0,
        status: "pending",
        date: "29 Jul 2026, 07:02 AM",
        from: { name: "John Doe", accountNumber: "**** 4471" },
        to: { name: "John Doe", accountNumber: "**** 4472" },
        description: "Internal transfer — Checking to Savings",
        reference: "XFER-33210044",
        flagged: false,
        flagReason: null,
        reversedReason: null,
    },
    {
        id: "TXN-901902",
        type: "withdrawal",
        amount: 400.0,
        fee: 2.5,
        status: "completed",
        date: "18 Jul 2026, 11:47 PM",
        from: { name: "Grace Obi", accountNumber: "**** 8820" },
        to: null,
        description: "ATM withdrawal — flagged by fraud system",
        reference: "ATM-71029384",
        flagged: true,
        flagReason: "Unusual location and time-of-day pattern.",
        reversedReason: null,
    },
    {
        id: "TXN-901544",
        type: "card_payment",
        amount: 640.0,
        fee: 0,
        status: "failed",
        date: "01 Jun 2026, 09:12 AM",
        from: { name: "Michael Brown", accountNumber: "**** 5678" },
        to: null,
        description: "Office supply order — declined, insufficient funds",
        reference: "CARD-40918822",
        flagged: false,
        flagReason: null,
        reversedReason: null,
    },
];

/* ========================================================================
 * 5. STATUS BADGE
 * ==================================================================== */
const statusMeta = {
    completed: {
        label: "Completed",
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        icon: CheckCircle2,
    },
    pending: {
        label: "Pending",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        icon: Clock,
    },
    failed: {
        label: "Failed",
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        icon: XCircle,
    },
    reversed: {
        label: "Reversed",
        className: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700/40 dark:text-zinc-300",
        icon: RotateCcw,
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

function TypeTag({ type }) {
    const meta = typeMeta[type];
    const Icon = meta.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${meta.className}`}>
            <Icon size={15} />
            {meta.label}
        </span>
    );
}

/* ========================================================================
 * 6. LIST VIEW
 * ==================================================================== */
function TransactionsList({ transactions, activeFilter, onFilterChange, onSelect }) {
    const [search, setSearch] = useState("");

    const filtered = transactions
        .filter((t) => activeFilter === "all" || t.status === activeFilter)
        .filter((t) =>
            `${t.id} ${t.description} ${t.reference} ${t.from?.name ?? ""} ${t.to?.name ?? ""}`
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
                        placeholder="Search by transaction ID, reference, or name..."
                        className="w-full rounded-lg border border-zen-light-border bg-zen-light-bg py-2 pl-9 pr-3 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                    />
                </div>
            </div>

            {/* --- Table --- */}
            <div className="overflow-hidden rounded-2xl border border-zen-light-border bg-zen-light-card shadow-sm dark:border-zen-border dark:bg-zen-card">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[920px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-zen-light-border text-xs uppercase tracking-wide text-zen-light-muted dark:border-zen-border dark:text-zen-muted">
                                <th className="px-5 py-3 font-medium">Transaction</th>
                                <th className="px-5 py-3 font-medium">Type</th>
                                <th className="px-5 py-3 font-medium">Parties</th>
                                <th className="px-5 py-3 font-medium">Amount</th>
                                <th className="px-5 py-3 font-medium">Date</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((t) => (
                                <tr
                                    key={t.id}
                                    onClick={() => onSelect(t)}
                                    className="cursor-pointer border-b border-zen-light-border last:border-0 hover:bg-zen-light-bg dark:border-zen-border dark:hover:bg-zen-bg/60"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <p className="font-medium text-zen-light-text dark:text-zen-text">{t.id}</p>
                                            {t.flagged && (
                                                <Flag size={13} className="text-amber-600 dark:text-amber-400" />
                                            )}
                                        </div>
                                        <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                            {t.description}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <TypeTag type={t.type} />
                                    </td>
                                    <td className="px-5 py-4 text-zen-light-text dark:text-zen-text">
                                        {t.from ? t.from.name : "External"} &rarr; {t.to ? t.to.name : "External"}
                                    </td>
                                    <td className="px-5 py-4 text-zen-light-text dark:text-zen-text">
                                        ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-5 py-4 text-zen-light-muted dark:text-zen-muted">{t.date}</td>
                                    <td className="px-5 py-4">
                                        <StatusBadge status={t.status} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelect(t);
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
                                        No transactions match your search or filter.
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
 * 7. DETAIL VIEW
 * ------------------------------------------------------------------------
 * Props:
 *   transaction  – selected transaction object
 *   onBack
 *   onToggleFlag – (txnId, flagged: boolean, reason) => void
 *   onReverse    – (txnId, reason) => void
 * ==================================================================== */
function TransactionDetail({ transaction, onBack, onToggleFlag, onReverse }) {
    const [flagReason, setFlagReason] = useState("");
    const [showFlagReason, setShowFlagReason] = useState(false);
    const [reverseReason, setReverseReason] = useState("");
    const [showReverseReason, setShowReverseReason] = useState(false);

    const canReverse = transaction.status === "completed";
    const TypeIcon = typeMeta[transaction.type].icon;

    function handleFlag() {
        onToggleFlag(transaction.id, true, flagReason.trim() || null);
        setFlagReason("");
        setShowFlagReason(false);
    }

    function handleUnflag() {
        onToggleFlag(transaction.id, false, null);
    }

    function handleReverse() {
        if (!reverseReason.trim()) return;
        onReverse(transaction.id, reverseReason.trim());
        setReverseReason("");
        setShowReverseReason(false);
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
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zen-light-bg dark:bg-zen-bg">
                            <TypeIcon size={18} className={typeMeta[transaction.type].className} />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-zen-light-text dark:text-zen-text">
                                {transaction.id}
                            </h1>
                            <p className="text-xs text-zen-light-muted dark:text-zen-muted">{transaction.date}</p>
                        </div>
                    </div>
                </div>
                <StatusBadge status={transaction.status} />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* ================= COLUMN 1: Amount + parties ================= */}
                <div className="flex flex-col gap-5 rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card lg:col-span-1">
                    <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            Amount
                        </p>
                        <p className="text-3xl font-semibold text-zen-light-text dark:text-zen-text">
                            ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        {transaction.fee > 0 && (
                            <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                Includes ${transaction.fee.toFixed(2)} fee
                            </p>
                        )}
                    </div>

                    <div className="border-t border-zen-light-border pt-4 dark:border-zen-border">
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            From
                        </p>
                        <p className="text-sm text-zen-light-text dark:text-zen-text">
                            {transaction.from ? `${transaction.from.name} · ${transaction.from.accountNumber}` : "External source"}
                        </p>
                    </div>

                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            To
                        </p>
                        <p className="text-sm text-zen-light-text dark:text-zen-text">
                            {transaction.to ? `${transaction.to.name} · ${transaction.to.accountNumber}` : "External destination"}
                        </p>
                    </div>

                    <div className="border-t border-zen-light-border pt-4 dark:border-zen-border">
                        <p className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            <Hash size={13} />
                            Reference
                        </p>
                        <p className="font-mono text-sm text-zen-light-text dark:text-zen-text">
                            {transaction.reference}
                        </p>
                    </div>
                </div>

                {/* ================= COLUMN 2: Description + flag status ================= */}
                <div className="flex flex-col gap-5 lg:col-span-1">
                    <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card">
                        <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            <History size={13} />
                            Description
                        </p>
                        <p className="text-sm text-zen-light-text dark:text-zen-text">{transaction.description}</p>
                    </div>

                    {transaction.flagged && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-900/10">
                            <p className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
                                <Flag size={13} />
                                Flagged for review
                            </p>
                            {transaction.flagReason && (
                                <p className="text-sm text-amber-700 dark:text-amber-400">{transaction.flagReason}</p>
                            )}
                            <button
                                onClick={handleUnflag}
                                className="mt-3 rounded-lg border border-amber-400 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30"
                            >
                                Remove flag
                            </button>
                        </div>
                    )}

                    {transaction.status === "reversed" && transaction.reversedReason && (
                        <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card">
                            <p className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                                <RotateCcw size={13} />
                                Reversal reason
                            </p>
                            <p className="text-sm text-zen-light-text dark:text-zen-text">
                                {transaction.reversedReason}
                            </p>
                        </div>
                    )}
                </div>

                {/* ================= COLUMN 3: Actions ================= */}
                <div className="flex flex-col gap-5 lg:col-span-1">
                    <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card">
                        <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            <AlertTriangle size={13} />
                            Actions
                        </p>

                        {/* Flag toggle — lightweight, no hard gate */}
                        {!transaction.flagged &&
                            (!showFlagReason ? (
                                <button
                                    onClick={() => setShowFlagReason(true)}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-500 py-2.5 text-sm font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                >
                                    <Flag size={16} />
                                    Flag for review
                                </button>
                            ) : (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-900/10">
                                    <label className="mb-1.5 block text-xs font-medium text-amber-700 dark:text-amber-400">
                                        Note (optional)
                                    </label>
                                    <textarea
                                        value={flagReason}
                                        onChange={(e) => setFlagReason(e.target.value)}
                                        rows={2}
                                        placeholder="e.g. Unusual amount for this account's history"
                                        className="w-full resize-none rounded-lg border border-amber-200 bg-white p-2 text-sm text-zen-light-text outline-none focus:border-amber-400 dark:border-amber-900/40 dark:bg-zen-bg dark:text-zen-text"
                                    />
                                    <button
                                        onClick={handleFlag}
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 py-2 text-sm font-medium text-white hover:bg-amber-700"
                                    >
                                        Confirm flag
                                    </button>
                                </div>
                            ))}

                        {/* Reverse — only possible on completed transactions, hard gate
                with required reason, same pattern as decline/suspend/freeze */}
                        {canReverse && (
                            <div className={transaction.flagged ? "" : "mt-3"}>
                                {!showReverseReason ? (
                                    <button
                                        onClick={() => setShowReverseReason(true)}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <RotateCcw size={16} />
                                        Reverse transaction
                                    </button>
                                ) : (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/40 dark:bg-red-900/10">
                                        <label className="mb-1.5 block text-xs font-medium text-red-700 dark:text-red-400">
                                            Reason for reversal (required, sent to affected user)
                                        </label>
                                        <textarea
                                            value={reverseReason}
                                            onChange={(e) => setReverseReason(e.target.value)}
                                            rows={2}
                                            placeholder="e.g. Duplicate charge confirmed by merchant"
                                            className="w-full resize-none rounded-lg border border-red-200 bg-white p-2 text-sm text-zen-light-text outline-none focus:border-red-400 dark:border-red-900/40 dark:bg-zen-bg dark:text-zen-text"
                                        />
                                        <button
                                            onClick={handleReverse}
                                            disabled={!reverseReason.trim()}
                                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Confirm reversal
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {!canReverse && (
                            <p className="mt-3 text-center text-xs text-zen-light-muted dark:text-zen-muted">
                                {transaction.status === "reversed"
                                    ? "This transaction has already been reversed."
                                    : "Only completed transactions can be reversed."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ========================================================================
 * 8. MAIN EXPORTED COMPONENT
 * ==================================================================== */
export const AdminTransactions = () => {
    const [transactions, setTransactions] = useState(initialTransactions);
    const [selected, setSelected] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [notifications, setNotifications] = useState([]);

    function syncSelected(updatedList, id) {
        const updated = updatedList.find((t) => t.id === id);
        if (updated) setSelected(updated);
    }

    function handleToggleFlag(id, flagged, reason) {
        setTransactions((prev) => {
            const next = prev.map((t) =>
                t.id === id ? { ...t, flagged, flagReason: flagged ? reason : null } : t
            );
            syncSelected(next, id);
            return next;
        });
    }

    function handleReverse(id, reason) {
        const txn = transactions.find((t) => t.id === id);

        setTransactions((prev) => {
            const next = prev.map((t) =>
                t.id === id ? { ...t, status: "reversed", reversedReason: reason } : t
            );
            syncSelected(next, id);
            return next;
        });

        // TODO: this is where the REAL work happens once wired to your Go
        // backend — reversing a transaction should trigger an actual balance
        // adjustment (the inverse of the original transaction) on the
        // affected account(s), ideally through the same admin-adjustment
        // pathway as ManualCreditDebit.jsx, so it's tagged consistently in
        // your ledger as an admin-initiated reversal rather than a normal
        // transaction. Right now this only flips the status label — no
        // money actually moves, since there's no backend to move it.
        const affectedUser = txn?.from?.name || txn?.to?.name || "the user";
        setNotifications((prev) => [
            {
                id: `${id}-${Date.now()}`,
                userName: affectedUser,
                message: `Transaction ${id} for $${txn?.amount.toFixed(2)} was reversed. Reason: ${reason}`,
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
                        Transactions
                    </h1>
                    <p className="mt-1 text-sm text-zen-light-muted dark:text-zen-muted">
                        {selected
                            ? "Viewing transaction"
                            : "The full ledger — deposits, withdrawals, transfers, and card payments"}
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
                <TransactionDetail
                    transaction={selected}
                    onBack={() => setSelected(null)}
                    onToggleFlag={handleToggleFlag}
                    onReverse={handleReverse}
                />
            ) : (
                <TransactionsList
                    transactions={transactions}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    onSelect={setSelected}
                />
            )}

            {/* --- Notification log — same pattern as CardRequests.jsx /
          AllUsers.jsx / ManualCreditDebit.jsx --- */}
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
                                        <span className="font-medium">{n.userName}</span>
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