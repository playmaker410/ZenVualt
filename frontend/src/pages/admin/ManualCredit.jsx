/**
 * ManualCreditDebit.jsx
 * ---------------------------------------------------------------------------
 * Admin tool for manually crediting (sending money to) or debiting
 * (removing money from) a user's account balance. Sibling to
 * KycVerification.jsx / CardRequests.jsx / AllUsers.jsx — same `zen-*`
 * token system, same overall visual language, but a different SHAPE of
 * page: this isn't a list-of-requests-to-review, it's a search-then-act
 * workflow. Read KycVerification.jsx's header comment first if you
 * haven't already; it explains the theme system in depth.
 *
 * FLOW ON THIS PAGE:
 *   1. Admin searches for a user (reuses a small mock user list — in a
 *      real app this would hit the same user search endpoint AllUsers
 *      uses).
 *   2. Selecting a user reveals their current balance + a Credit/Debit
 *      tab switcher.
 *   3. Admin fills in an amount + reason, then must type the exact
 *      amount into a confirm field before the button enables — this is
 *      a manual money movement with no paper trail beyond what you type
 *      here, so I made "did you mean to type this amount" a hard gate
 *      rather than a single click. (Same spirit as AllUsers.jsx's
 *      type-CONFIRM-to-close-account gate.)
 *   4. On confirm: balance updates locally, an entry is added to
 *      `manualTransactions` (the audit trail), and a notification is
 *      queued for the user via the same onSendMessage pattern used in
 *      CardRequests.jsx / AllUsers.jsx.
 *
 * WHY DEBIT HAS A "REASON CATEGORY" DROPDOWN INSTEAD OF JUST FREE TEXT:
 *   You specifically mentioned the deceased-customer case — removing
 *   funds from an account isn't a routine action, it's usually tied to a
 *   real-world event (estate settlement, fraud reversal, correction,
 *   etc.). A dropdown of categories:
 *     - keeps your audit trail consistent/searchable later ("show me all
 *       debits tagged 'Deceased customer'")
 *     - forces the admin to actually classify WHY before typing a
 *       reason, rather than every debit becoming a one-off freeform note
 *   "Deceased customer – estate settlement" is its own category, and
 *   selecting it reveals a dedicated "Debit full balance" shortcut,
 *   since zeroing the account out is the most common real action in
 *   that scenario (rather than the admin manually retyping the exact
 *   balance and risking a typo).
 *
 * SAFETY RAILS I ADDED (flag these if you want them removed/loosened):
 *   - Debit amount can never exceed the account's current balance —
 *     the debit form clamps/validates against it, no negative balances.
 *   - Credit and Debit are on separate tabs, not a single form with a
 *     +/- toggle, so there's no accidental sign-flip on a large amount.
 *   - Every manual transaction is logged in an on-page audit trail
 *     table (`manualTransactions`) that is NOT the same thing as your
 *     regular transactions ledger — when you wire this to your Go
 *     backend, this action should almost certainly hit a dedicated
 *     "admin adjustment" endpoint / table, not silently insert a normal
 *     user-initiated transaction row, so support/compliance can always
 *     tell manual admin actions apart from things the user did themselves.
 * ---------------------------------------------------------------------------
 */

import React, { useState } from "react";
import {
    Search,
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    ChevronLeft,
    AlertTriangle,
    User,
    History,
    Bell,
    Landmark,
    ShieldAlert,
} from "lucide-react";

/* ========================================================================
 * 1. STATS CARDS
 * ------------------------------------------------------------------------
 * These summarize activity ON THIS PAGE (manual adjustments only), not
 * platform-wide transaction stats — that belongs on a Transactions page.
 * They're computed live from `manualTransactions` state further down,
 * not hardcoded, since it wouldn't make sense to fake numbers for a tool
 * whose whole job is to be an accurate audit trail.
 * ==================================================================== */
function computeStats(manualTransactions) {
    const credits = manualTransactions.filter((t) => t.type === "credit");
    const debits = manualTransactions.filter((t) => t.type === "debit");
    const totalCredited = credits.reduce((sum, t) => sum + t.amount, 0);
    const totalDebited = debits.reduce((sum, t) => sum + t.amount, 0);

    return [
        {
            label: "Total credited",
            value: `$${totalCredited.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            sub: `${credits.length} manual credits`,
            icon: ArrowUpCircle,
            iconBg: "bg-green-100 dark:bg-green-900/30",
            iconColor: "text-green-600 dark:text-green-400",
            subColor: "text-green-600 dark:text-green-400",
        },
        {
            label: "Total debited",
            value: `$${totalDebited.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            sub: `${debits.length} manual debits`,
            icon: ArrowDownCircle,
            iconBg: "bg-red-100 dark:bg-red-900/30",
            iconColor: "text-red-600 dark:text-red-400",
            subColor: "text-red-600 dark:text-red-400",
        },
        {
            label: "Manual adjustments",
            value: manualTransactions.length,
            sub: "All time, this session",
            icon: History,
            iconBg: "bg-purple-100 dark:bg-purple-900/30",
            iconColor: "text-purple-600 dark:text-purple-400",
        },
        {
            label: "Estate settlements",
            value: manualTransactions.filter((t) => t.category === "deceased").length,
            sub: "Deceased customer debits",
            icon: ShieldAlert,
            iconBg: "bg-amber-100 dark:bg-amber-900/30",
            iconColor: "text-amber-600 dark:text-amber-400",
            subColor: "text-amber-600 dark:text-amber-400",
        },
    ];
}

/* ========================================================================
 * 2. MOCK USERS
 * ------------------------------------------------------------------------
 * Small, focused subset — just enough to search/select for this tool.
 * In a real app, replace the client-side filter below with a debounced
 * call to your existing user-search endpoint (the same one AllUsers.jsx
 * would eventually use).
 * ==================================================================== */
const initialUsers = [
    {
        id: "USR-10231",
        name: "John Doe",
        email: "john.doe@email.com",
        avatar: "https://i.pravatar.cc/120?img=12",
        accountNumber: "**** 4471",
        balance: 4280.12,
    },
    {
        id: "USR-10198",
        name: "Grace Obi",
        email: "grace.obi@email.com",
        avatar: "https://i.pravatar.cc/120?img=48",
        accountNumber: "**** 8820",
        balance: 120.4,
    },
    {
        id: "USR-10305",
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        avatar: "https://i.pravatar.cc/120?img=47",
        accountNumber: "**** 1190",
        balance: 890.0,
    },
];

/* ========================================================================
 * 3. DEBIT REASON CATEGORIES
 * ------------------------------------------------------------------------
 * See the "WHY DEBIT HAS A REASON CATEGORY DROPDOWN" note at the top of
 * the file for the reasoning. Add more categories here as your ops team
 * needs them — everything downstream (the audit table, the "Estate
 * settlements" stat card) keys off the `value`, so keep those stable
 * once you're using this for real.
 * ==================================================================== */
const debitCategories = [
    { value: "deceased", label: "Deceased customer – estate settlement" },
    { value: "fraud_reversal", label: "Fraud / chargeback reversal" },
    { value: "correction", label: "Balance correction" },
    { value: "compliance_hold", label: "Compliance / legal hold" },
    { value: "other", label: "Other" },
];

/* ========================================================================
 * 4. USER SEARCH PANEL — shown before a user is selected
 * ==================================================================== */
function UserSearchPanel({ users, onSelect }) {
    const [search, setSearch] = useState("");

    const filtered = users.filter((u) =>
        `${u.name} ${u.email} ${u.id} ${u.accountNumber}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card">
            <p className="mb-3 text-sm font-medium text-zen-light-text dark:text-zen-text">
                Find an account to adjust
            </p>
            <div className="relative mb-4">
                <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted"
                />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email, user ID or account number..."
                    className="w-full rounded-lg border border-zen-light-border bg-zen-light-bg py-2 pl-9 pr-3 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                />
            </div>

            <div className="flex flex-col divide-y divide-zen-light-border dark:divide-zen-border">
                {filtered.map((u) => (
                    <button
                        key={u.id}
                        onClick={() => onSelect(u)}
                        className="flex items-center justify-between gap-3 py-3 text-left first:pt-0 last:pb-0 hover:opacity-80"
                    >
                        <div className="flex items-center gap-3">
                            <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                            <div>
                                <p className="font-medium text-zen-light-text dark:text-zen-text">{u.name}</p>
                                <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                    {u.email} &middot; {u.accountNumber}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-zen-light-text dark:text-zen-text">
                            ${u.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </button>
                ))}
                {filtered.length === 0 && (
                    <p className="py-6 text-center text-sm text-zen-light-muted dark:text-zen-muted">
                        No matching accounts.
                    </p>
                )}
            </div>
        </div>
    );
}

/* ========================================================================
 * 5. ADJUSTMENT FORM — shown once a user is selected
 * ------------------------------------------------------------------------
 * Props:
 *   user     – selected user object (with live `balance`)
 *   onBack   – clear selection, return to search panel
 *   onSubmit – (userId, { type, amount, reason, category }) => void
 *              parent applies the balance change + logs it + notifies
 * ==================================================================== */
function AdjustmentForm({ user, onBack, onSubmit }) {
    const [tab, setTab] = useState("credit"); // "credit" | "debit"
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [category, setCategory] = useState(debitCategories[0].value);
    const [confirmAmount, setConfirmAmount] = useState("");

    const numericAmount = parseFloat(amount) || 0;
    const isDebit = tab === "debit";
    const isDeceasedCase = isDebit && category === "deceased";

    // Validation gates — all must be true before the button enables.
    const amountValid = numericAmount > 0;
    const debitWithinBalance = !isDebit || numericAmount <= user.balance;
    const reasonFilled = reason.trim().length > 0;
    // Confirm field must exactly match the typed amount (as a string) —
    // this is the "did you really mean to type this number" gate.
    const confirmMatches = confirmAmount.trim() === amount.trim() && amount.trim() !== "";

    const canSubmit = amountValid && debitWithinBalance && reasonFilled && confirmMatches;

    function resetForm() {
        setAmount("");
        setReason("");
        setConfirmAmount("");
        setCategory(debitCategories[0].value);
    }

    function handleSwitchTab(nextTab) {
        setTab(nextTab);
        resetForm();
    }

    function handleFillFullBalance() {
        setAmount(user.balance.toFixed(2));
        setConfirmAmount(""); // still must retype to confirm — no shortcuts on the safety gate
    }

    function handleSubmit() {
        if (!canSubmit) return;
        onSubmit(user.id, {
            type: tab,
            amount: numericAmount,
            reason: reason.trim(),
            category: isDebit ? category : null,
        });
        resetForm();
    }

    return (
        <div>
            {/* --- Header --- */}
            <div className="mb-6 flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-zen-light-border text-zen-light-muted hover:bg-zen-light-bg dark:border-zen-border dark:text-zen-muted dark:hover:bg-zen-bg/60"
                >
                    <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                        <p className="font-medium text-zen-light-text dark:text-zen-text">{user.name}</p>
                        <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                            {user.email} &middot; {user.accountNumber}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* ================= Current balance card ================= */}
                <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card lg:col-span-1">
                    <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                        <Landmark size={13} />
                        Current balance
                    </p>
                    <p className="text-3xl font-semibold text-zen-light-text dark:text-zen-text">
                        ${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    {amountValid && (
                        <p className="mt-2 text-sm text-zen-light-muted dark:text-zen-muted">
                            Balance after this action:{" "}
                            <span className="font-medium text-zen-light-text dark:text-zen-text">
                                $
                                {(isDebit ? user.balance - numericAmount : user.balance + numericAmount).toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 2 }
                                )}
                            </span>
                        </p>
                    )}
                </div>

                {/* ================= Form ================= */}
                <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card lg:col-span-2">
                    {/* Credit / Debit tab switcher */}
                    <div className="mb-4 flex gap-2">
                        <button
                            onClick={() => handleSwitchTab("credit")}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${tab === "credit"
                                ? "bg-green-600 text-white"
                                : "border border-zen-light-border text-zen-light-text hover:bg-zen-light-bg dark:border-zen-border dark:text-zen-text dark:hover:bg-zen-bg/60"
                                }`}
                        >
                            <ArrowUpCircle size={16} />
                            Send money (credit)
                        </button>
                        <button
                            onClick={() => handleSwitchTab("debit")}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${tab === "debit"
                                ? "bg-red-600 text-white"
                                : "border border-zen-light-border text-zen-light-text hover:bg-zen-light-bg dark:border-zen-border dark:text-zen-text dark:hover:bg-zen-bg/60"
                                }`}
                        >
                            <ArrowDownCircle size={16} />
                            Remove money (debit)
                        </button>
                    </div>

                    {/* Debit-only: reason category dropdown */}
                    {isDebit && (
                        <div className="mb-3">
                            <label className="mb-1.5 block text-xs font-medium text-zen-light-muted dark:text-zen-muted">
                                Reason category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-lg border border-zen-light-border bg-zen-light-bg px-3 py-2 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                            >
                                {debitCategories.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Deceased-customer callout + full-balance shortcut */}
                    {isDeceasedCase && (
                        <div className="mb-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 dark:bg-amber-900/20">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                            <div className="flex-1">
                                <p className="text-sm text-amber-700 dark:text-amber-400">
                                    Confirm this action follows your institution's estate/legal settlement
                                    procedure before proceeding. This is typically a full-balance withdrawal.
                                </p>
                                <button
                                    onClick={handleFillFullBalance}
                                    className="mt-2 rounded-lg border border-amber-400 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30"
                                >
                                    Fill full balance (${user.balance.toFixed(2)})
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Amount */}
                    <div className="mb-3">
                        <label className="mb-1.5 block text-xs font-medium text-zen-light-muted dark:text-zen-muted">
                            Amount (USD)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full rounded-lg border border-zen-light-border bg-zen-light-bg px-3 py-2 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                        />
                        {isDebit && !debitWithinBalance && amountValid && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                Amount exceeds the account's current balance.
                            </p>
                        )}
                    </div>

                    {/* Reason */}
                    <div className="mb-3">
                        <label className="mb-1.5 block text-xs font-medium text-zen-light-muted dark:text-zen-muted">
                            {isDebit ? "Reason (required, sent to user)" : "Note to user (required)"}
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={2}
                            placeholder={
                                isDebit
                                    ? "e.g. Full balance withdrawn per estate settlement instructions dated..."
                                    : "e.g. Manual credit for service adjustment"
                            }
                            className="w-full resize-none rounded-lg border border-zen-light-border bg-zen-light-bg p-3 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                        />
                    </div>

                    {/* Confirm-amount safety gate */}
                    <div className="mb-4">
                        <label className="mb-1.5 block text-xs font-medium text-zen-light-muted dark:text-zen-muted">
                            Retype the amount to confirm
                        </label>
                        <input
                            value={confirmAmount}
                            onChange={(e) => setConfirmAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full rounded-lg border border-zen-light-border bg-zen-light-bg px-3 py-2 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 ${isDebit ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        {isDebit ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                        {isDebit
                            ? `Remove $${numericAmount ? numericAmount.toFixed(2) : "0.00"} from account`
                            : `Send $${numericAmount ? numericAmount.toFixed(2) : "0.00"} to account`}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ========================================================================
 * 6. MAIN EXPORTED COMPONENT
 * ==================================================================== */
export const ManualCreditDebit = () => {
    const [users, setUsers] = useState(initialUsers);
    const [selectedUser, setSelectedUser] = useState(null);
    const [manualTransactions, setManualTransactions] = useState([]);
    const [notifications, setNotifications] = useState([]);

    function handleSubmit(userId, { type, amount, reason, category }) {
        // 1. Update the user's live balance
        setUsers((prev) => {
            const next = prev.map((u) =>
                u.id === userId
                    ? { ...u, balance: type === "debit" ? u.balance - amount : u.balance + amount }
                    : u
            );
            const updated = next.find((u) => u.id === userId);
            setSelectedUser(updated); // keep the open form in sync with the new balance
            return next;
        });

        // 2. Append to the audit trail
        const user = users.find((u) => u.id === userId);
        setManualTransactions((prev) => [
            {
                id: `ADJ-${Date.now()}`,
                userId,
                userName: user?.name,
                type,
                amount,
                reason,
                category,
                performedAt: "just now",
            },
            ...prev,
        ]);

        // 3. Notify the user
        // TODO: replace with a real API call — this should hit a dedicated
        // "admin adjustment" endpoint on your Go backend so the resulting
        // ledger entry is clearly tagged as admin-initiated, not a normal
        // user transaction. See the file header note for why that distinction matters.
        const notifyMessage =
            type === "debit"
                ? `$${amount.toFixed(2)} was removed from your account. Reason: ${reason}`
                : `$${amount.toFixed(2)} was added to your account. Note: ${reason}`;
        setNotifications((prev) => [
            {
                id: `${userId}-${Date.now()}`,
                userName: user?.name,
                message: notifyMessage,
                sentAt: "just now",
            },
            ...prev,
        ]);
    }

    const stats = computeStats(manualTransactions);

    return (
        <div className="min-h-screen w-full bg-zen-light-bg p-6 dark:bg-zen-bg">
            {/* --- Page header --- */}
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-zen-light-text dark:text-zen-text">
                        Manual Credit / Debit
                    </h1>
                    <p className="mt-1 text-sm text-zen-light-muted dark:text-zen-muted">
                        {selectedUser
                            ? "Adjusting account balance"
                            : "Send money to or remove money from a user's account"}
                    </p>
                </div>
            </div>

            {/* --- Stats cards --- */}
            {!selectedUser && (
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

            {/* --- Search / Form switch --- */}
            {selectedUser ? (
                <AdjustmentForm
                    user={selectedUser}
                    onBack={() => setSelectedUser(null)}
                    onSubmit={handleSubmit}
                />
            ) : (
                <UserSearchPanel users={users} onSelect={setSelectedUser} />
            )}

            {/* --- Audit trail: every manual adjustment made this session --- */}
            {manualTransactions.length > 0 && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-zen-light-border bg-zen-light-card shadow-sm dark:border-zen-border dark:bg-zen-card">
                    <p className="flex items-center gap-2 border-b border-zen-light-border px-5 py-3 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:border-zen-border dark:text-zen-muted">
                        <History size={13} />
                        Manual adjustment history
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-zen-light-border text-xs uppercase tracking-wide text-zen-light-muted dark:border-zen-border dark:text-zen-muted">
                                    <th className="px-5 py-2 font-medium">User</th>
                                    <th className="px-5 py-2 font-medium">Type</th>
                                    <th className="px-5 py-2 font-medium">Amount</th>
                                    <th className="px-5 py-2 font-medium">Reason</th>
                                    <th className="px-5 py-2 font-medium">When</th>
                                </tr>
                            </thead>
                            <tbody>
                                {manualTransactions.map((t) => (
                                    <tr
                                        key={t.id}
                                        className="border-b border-zen-light-border last:border-0 dark:border-zen-border"
                                    >
                                        <td className="px-5 py-3 text-zen-light-text dark:text-zen-text">
                                            {t.userName}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`inline-flex items-center gap-1 text-xs font-medium ${t.type === "debit"
                                                    ? "text-red-600 dark:text-red-400"
                                                    : "text-green-600 dark:text-green-400"
                                                    }`}
                                            >
                                                {t.type === "debit" ? (
                                                    <ArrowDownCircle size={13} />
                                                ) : (
                                                    <ArrowUpCircle size={13} />
                                                )}
                                                {t.type === "debit" ? "Debit" : "Credit"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-zen-light-text dark:text-zen-text">
                                            ${t.amount.toFixed(2)}
                                        </td>
                                        <td className="px-5 py-3 text-zen-light-muted dark:text-zen-muted">
                                            {t.reason}
                                        </td>
                                        <td className="px-5 py-3 text-zen-light-muted dark:text-zen-muted">
                                            {t.performedAt}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- Notification log (admin-facing only, same pattern as
          CardRequests.jsx / AllUsers.jsx) --- */}
            {/* {notifications.length > 0 && (
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
            )} */}
        </div>
    );
};