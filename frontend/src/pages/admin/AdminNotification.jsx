/**
 * NotificationCenter.jsx
 * ---------------------------------------------------------------------------
 * Admin page for composing messages that land in a user's notification
 * box. This is the "real" version of the notification-log panels you've
 * seen bolted onto the bottom of CardRequests.jsx / AllUsers.jsx /
 * ManualCreditDebit.jsx / Transactions.jsx — this page is where an admin
 * can send a message DIRECTLY, not just as a side-effect of another
 * action (approving a card, suspending an account, etc).
 *
 * HOW THIS ACTUALLY WORKS END TO END (read this before wiring the backend):
 *   1. Admin picks a recipient — either ONE user, or a BROADCAST to a
 *      group (All users / a status segment like "Active" or "Pending").
 *   2. Admin types a message and hits Send.
 *   3. Right now (mock mode): the message is appended to local
 *      `sentNotifications` state — that's it, nothing leaves the browser.
 *   4. For real: Send should call something like
 *        POST /api/admin/notifications
 *        body: { recipientType: "user"|"broadcast", userId?, segment?, message }
 *      Your Go backend inserts a row per affected user into a
 *      `notifications` table (id, user_id, message, read_at, created_at,
 *      created_by_admin_id). That table is what the USER-FACING app
 *      queries to populate their own notification bell/inbox — the bell
 *      icon with the badge count you already have in your admin topbar
 *      (and presumably a similar one in the customer-facing app) reads
 *      from that same table, just filtered to `read_at IS NULL` for the
 *      unread count.
 *   5. Optional but common: a WebSocket or polling endpoint so the
 *      user's bell updates live instead of only on page load. Not
 *      needed to ship a first version — polling every 30-60s is a fine
 *      starting point.
 *
 * WHY BROADCAST IS SEPARATE FROM A SINGLE USER:
 *   Broadcasting to "All users" or "All Active users" means your backend
 *   needs to fan out ONE admin action into MANY notification rows (one
 *   per matching user). That's a meaningfully different backend
 *   operation than a single insert, so the UI asks explicitly which mode
 *   you're in rather than guessing from whether a user is selected.
 *
 * THIS PAGE VS. THE OTHER "SEND MESSAGE" BOXES ELSEWHERE:
 *   CardRequests.jsx / AllUsers.jsx / Transactions.jsx / ManualCreditDebit.jsx
 *   all have their own small message box tied to a specific action on a
 *   specific record (approving a card, suspending a user, etc). Those
 *   stay as-is — they're contextual. THIS page is for standalone,
 *   proactive outreach: "hey, scheduled maintenance Sunday," "your
 *   monthly statement is ready," etc. Both ultimately write to the same
 *   `notifications` table on a real backend.
 * ---------------------------------------------------------------------------
 */

import React, { useState } from "react";
import {
    Search,
    Send,
    Bell,
    Users,
    User,
    Megaphone,
    CheckCircle2,
    Clock,
    Mail,
    History,
} from "lucide-react";

/* ========================================================================
 * 1. STATS CARDS
 * ------------------------------------------------------------------------
 * Computed live from `sentNotifications` rather than hardcoded, same
 * reasoning as ManualCreditDebit.jsx's computeStats — this page's whole
 * job is to be an accurate record of what's gone out.
 * ==================================================================== */
function computeStats(sentNotifications) {
    const today = sentNotifications.filter((n) => n.sentAt === "just now").length;
    const broadcasts = sentNotifications.filter((n) => n.recipientType === "broadcast").length;
    const uniqueRecipients = new Set(
        sentNotifications.flatMap((n) => (n.recipientType === "user" ? [n.recipientLabel] : []))
    ).size;

    return [
        {
            label: "Sent this session",
            value: sentNotifications.length,
            sub: "Total notifications",
            icon: Bell,
            iconBg: "bg-purple-100 dark:bg-purple-900/30",
            iconColor: "text-purple-600 dark:text-purple-400",
        },
        {
            label: "Sent today",
            value: today,
            sub: "Since you opened this page",
            icon: Clock,
            iconBg: "bg-blue-100 dark:bg-blue-900/30",
            iconColor: "text-blue-600 dark:text-blue-400",
            subColor: "text-blue-600 dark:text-blue-400",
        },
        {
            label: "Broadcasts",
            value: broadcasts,
            sub: "Sent to a group",
            icon: Megaphone,
            iconBg: "bg-amber-100 dark:bg-amber-900/30",
            iconColor: "text-amber-600 dark:text-amber-400",
            subColor: "text-amber-600 dark:text-amber-400",
        },
        {
            label: "Individual recipients",
            value: uniqueRecipients,
            sub: "Distinct users messaged directly",
            icon: Users,
            iconBg: "bg-green-100 dark:bg-green-900/30",
            iconColor: "text-green-600 dark:text-green-400",
            subColor: "text-green-600 dark:text-green-400",
        },
    ];
}

/* ========================================================================
 * 2. MOCK USERS — for the "single user" recipient search
 * ==================================================================== */
const mockUsers = [
    { id: "USR-10231", name: "John Doe", email: "john.doe@email.com", avatar: "https://i.pravatar.cc/120?img=12" },
    { id: "USR-10198", name: "Grace Obi", email: "grace.obi@email.com", avatar: "https://i.pravatar.cc/120?img=48" },
    { id: "USR-10305", name: "Sarah Johnson", email: "sarah.j@email.com", avatar: "https://i.pravatar.cc/120?img=47" },
    { id: "USR-09876", name: "Michael Brown", email: "michael.b@email.com", avatar: "https://i.pravatar.cc/120?img=51" },
];

/* ========================================================================
 * 3. BROADCAST SEGMENTS
 * ------------------------------------------------------------------------
 * These should match the status values you're already using in
 * AllUsers.jsx so a real backend can filter WHERE status = :segment.
 * "all" is the special "everyone, no filter" case.
 * ==================================================================== */
const segments = [
    { value: "all", label: "All users" },
    { value: "active", label: "Active users" },
    { value: "suspended", label: "Suspended users" },
    { value: "pending", label: "Pending users" },
];

/* ========================================================================
 * 4. COMPOSE PANEL
 * ------------------------------------------------------------------------
 * Props:
 *   onSend – (payload) => void, where payload is either
 *     { recipientType: "user", recipient: {id,name,email}, message }
 *     { recipientType: "broadcast", segment: "all"|"active"|..., message }
 * ==================================================================== */
function ComposePanel({ onSend }) {
    const [mode, setMode] = useState("user"); // "user" | "broadcast"
    const [userSearch, setUserSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [segment, setSegment] = useState("all");
    const [message, setMessage] = useState("");
    const [justSent, setJustSent] = useState(false);

    const filteredUsers = mockUsers.filter((u) =>
        `${u.name} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())
    );

    const canSend =
        message.trim().length > 0 && (mode === "broadcast" || (mode === "user" && selectedUser));

    function handleSend() {
        if (!canSend) return;

        if (mode === "user") {
            onSend({ recipientType: "user", recipient: selectedUser, message: message.trim() });
        } else {
            onSend({ recipientType: "broadcast", segment, message: message.trim() });
        }

        setMessage("");
        setSelectedUser(null);
        setUserSearch("");
        // Small inline confirmation instead of a toast library — fades out
        // on its own via the timeout below. Replace with a real toast
        // component if you add one to the project later.
        setJustSent(true);
        setTimeout(() => setJustSent(false), 2500);
    }

    function handleSwitchMode(nextMode) {
        setMode(nextMode);
        setSelectedUser(null);
        setUserSearch("");
    }

    return (
        <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-zen-light-text dark:text-zen-text">
                <Mail size={16} />
                Compose notification
            </p>

            {/* Recipient mode tabs */}
            <div className="mb-4 flex gap-2">
                <button
                    onClick={() => handleSwitchMode("user")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${mode === "user"
                        ? "bg-zen-primary text-white"
                        : "border border-zen-light-border text-zen-light-text hover:bg-zen-light-bg dark:border-zen-border dark:text-zen-text dark:hover:bg-zen-bg/60"
                        }`}
                >
                    <User size={16} />
                    Single user
                </button>
                <button
                    onClick={() => handleSwitchMode("broadcast")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${mode === "broadcast"
                        ? "bg-zen-primary text-white"
                        : "border border-zen-light-border text-zen-light-text hover:bg-zen-light-bg dark:border-zen-border dark:text-zen-text dark:hover:bg-zen-bg/60"
                        }`}
                >
                    <Megaphone size={16} />
                    Broadcast
                </button>
            </div>

            {/* --- Single user mode: search + select --- */}
            {mode === "user" && (
                <div className="mb-4">
                    <label className="mb-1.5 block text-xs font-medium text-zen-light-muted dark:text-zen-muted">
                        Recipient
                    </label>

                    {selectedUser ? (
                        <div className="flex items-center justify-between rounded-lg border border-zen-light-border bg-zen-light-bg p-2.5 dark:border-zen-border dark:bg-zen-bg">
                            <div className="flex items-center gap-2.5">
                                <img
                                    src={selectedUser.avatar}
                                    alt={selectedUser.name}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-sm font-medium text-zen-light-text dark:text-zen-text">
                                        {selectedUser.name}
                                    </p>
                                    <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                        {selectedUser.email}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-xs font-medium text-zen-light-muted underline hover:text-zen-light-text dark:text-zen-muted dark:hover:text-zen-text"
                            >
                                Change
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="relative mb-2">
                                <Search
                                    size={15}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted"
                                />
                                <input
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full rounded-lg border border-zen-light-border bg-zen-light-bg py-2 pl-8 pr-3 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                                />
                            </div>
                            {userSearch && (
                                <div className="max-h-40 overflow-y-auto rounded-lg border border-zen-light-border dark:border-zen-border">
                                    {filteredUsers.map((u) => (
                                        <button
                                            key={u.id}
                                            onClick={() => {
                                                setSelectedUser(u);
                                                setUserSearch("");
                                            }}
                                            className="flex w-full items-center gap-2.5 border-b border-zen-light-border p-2.5 text-left last:border-0 hover:bg-zen-light-bg dark:border-zen-border dark:hover:bg-zen-bg/60"
                                        >
                                            <img src={u.avatar} alt={u.name} className="h-7 w-7 rounded-full object-cover" />
                                            <div>
                                                <p className="text-sm text-zen-light-text dark:text-zen-text">{u.name}</p>
                                                <p className="text-xs text-zen-light-muted dark:text-zen-muted">{u.email}</p>
                                            </div>
                                        </button>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <p className="p-2.5 text-center text-xs text-zen-light-muted dark:text-zen-muted">
                                            No matches.
                                        </p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* --- Broadcast mode: segment picker --- */}
            {mode === "broadcast" && (
                <div className="mb-4">
                    <label className="mb-1.5 block text-xs font-medium text-zen-light-muted dark:text-zen-muted">
                        Send to
                    </label>
                    <select
                        value={segment}
                        onChange={(e) => setSegment(e.target.value)}
                        className="w-full rounded-lg border border-zen-light-border bg-zen-light-bg px-3 py-2 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                    >
                        {segments.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                        <Megaphone size={12} />
                        This sends one notification to every matching user — double-check the segment.
                    </p>
                </div>
            )}

            {/* Message */}
            <div className="mb-4">
                <label className="mb-1.5 block text-xs font-medium text-zen-light-muted dark:text-zen-muted">
                    Message
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Type the notification message..."
                    className="w-full resize-none rounded-lg border border-zen-light-border bg-zen-light-bg p-3 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                />
            </div>

            <button
                onClick={handleSend}
                disabled={!canSend}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-zen-primary py-2.5 text-sm font-medium text-white hover:bg-zen-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
                <Send size={16} />
                {mode === "broadcast" ? "Send to segment" : "Send notification"}
            </button>

            {justSent && (
                <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                    <CheckCircle2 size={13} />
                    Sent
                </p>
            )}
        </div>
    );
}

/* ========================================================================
 * 5. MAIN EXPORTED COMPONENT
 * ==================================================================== */
export const NotificationCenter = () => {
    const [sentNotifications, setSentNotifications] = useState([]);

    function handleSend(payload) {
        const entry =
            payload.recipientType === "user"
                ? {
                    id: `NTF-${Date.now()}`,
                    recipientType: "user",
                    recipientLabel: payload.recipient.name,
                    recipientSub: payload.recipient.email,
                    message: payload.message,
                    sentAt: "just now",
                }
                : {
                    id: `NTF-${Date.now()}`,
                    recipientType: "broadcast",
                    recipientLabel: segments.find((s) => s.value === payload.segment)?.label ?? "All users",
                    recipientSub: "Broadcast",
                    message: payload.message,
                    sentAt: "just now",
                };

        // TODO: replace with a real API call, e.g.
        //   await fetch("/api/admin/notifications", {
        //     method: "POST",
        //     body: JSON.stringify(payload),
        //   })
        // Your Go backend fans this out into one row per matching user in a
        // `notifications` table (see the file header comment for the full
        // shape). The user-facing bell icon reads from that same table.
        setSentNotifications((prev) => [entry, ...prev]);
    }

    const stats = computeStats(sentNotifications);

    return (
        <div className="min-h-screen w-full bg-zen-light-bg p-6 dark:bg-zen-bg">
            {/* --- Page header --- */}
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-zen-light-text dark:text-zen-text">
                        Notifications
                    </h1>
                    <p className="mt-1 text-sm text-zen-light-muted dark:text-zen-muted">
                        Send a message directly to a user's notification box, or broadcast to a group
                    </p>
                </div>
            </div>

            {/* --- Stats cards --- */}
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

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Compose panel */}
                <div className="lg:col-span-1">
                    <ComposePanel onSend={handleSend} />
                </div>

                {/* History */}
                <div className="lg:col-span-2">
                    <div className="overflow-hidden rounded-2xl border border-zen-light-border bg-zen-light-card shadow-sm dark:border-zen-border dark:bg-zen-card">
                        <p className="flex items-center gap-2 border-b border-zen-light-border px-5 py-3 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:border-zen-border dark:text-zen-muted">
                            <History size={13} />
                            Sent history
                        </p>

                        {sentNotifications.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
                                <Bell size={28} className="text-zen-light-muted dark:text-zen-muted" />
                                <p className="text-sm text-zen-light-muted dark:text-zen-muted">
                                    Nothing sent yet. Compose your first notification on the left.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col divide-y divide-zen-light-border dark:divide-zen-border">
                                {sentNotifications.map((n) => (
                                    <div key={n.id} className="flex items-start justify-between gap-4 px-5 py-4">
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.recipientType === "broadcast"
                                                    ? "bg-amber-100 dark:bg-amber-900/30"
                                                    : "bg-blue-100 dark:bg-blue-900/30"
                                                    }`}
                                            >
                                                {n.recipientType === "broadcast" ? (
                                                    <Megaphone size={14} className="text-amber-600 dark:text-amber-400" />
                                                ) : (
                                                    <User size={14} className="text-blue-600 dark:text-blue-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-zen-light-text dark:text-zen-text">
                                                    {n.recipientLabel}
                                                    {n.recipientType === "broadcast" && (
                                                        <span className="ml-1.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                            Broadcast
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                                    {n.recipientSub}
                                                </p>
                                                <p className="mt-1 text-sm text-zen-light-text dark:text-zen-text">
                                                    {n.message}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="whitespace-nowrap text-xs text-zen-light-muted dark:text-zen-muted">
                                            {n.sentAt}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};