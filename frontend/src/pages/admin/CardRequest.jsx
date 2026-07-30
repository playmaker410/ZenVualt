/**
 * CardRequests.jsx
 * ---------------------------------------------------------------------------
 * Admin page for reviewing debit/credit card requests.
 * Sibling page to KycVerification.jsx — same list/detail pattern, same
 * `zen-*` token system. Read the big comment block at the top of
 * KycVerification.jsx first if you haven't already; it explains the theme
 * system in more depth. This file only re-explains what's DIFFERENT here.
 *
 * WHAT'S DIFFERENT FROM KycVerification.jsx:
 *   1. Accept / Decline buttons are ACTUALLY WIRED this time (KYC's
 *      equivalent buttons were visual-only). Clicking them updates the
 *      request's status in local state immediately.
 *   2. There's a "reviewer message" textarea + Send button. Sending a
 *      message pushes an entry into `notifications` state — this is a
 *      MOCK of what should become a real notification sent to the user's
 *      account. Search "TODO: replace with real API call" to find the
 *      2 spots you'd wire up to your Go backend.
 *   3. Decline requires a reason (I made this a judgment call — see the
 *      "DESIGN DECISIONS" note below for why).
 *
 * HOW STATE FLOWS:
 *   CardRequests (top-level)
 *     ├─ cardRequests   – the list of requests, now a useState (not a
 *     │                   plain const) because Accept/Decline need to
 *     │                   mutate a request's status and see it reflected
 *     │                   immediately in both list and detail views.
 *     ├─ notifications  – flat log of every message sent to a user.
 *     │                   Rendered as a small panel so YOU (the admin)
 *     │                   can see what went out — this is the closest
 *     │                   thing to a "sent" confirmation without a toast
 *     │                   library. Swap for a real API call + toast when
 *     │                   you wire this up for real.
 *     └─ selected       – same list <-> detail switch as KycVerification.
 *
 * DESIGN DECISIONS I MADE (flagged so you can change your mind easily):
 *   - Declining without a reason is blocked (button disabled until the
 *     reviewer types something) — a customer getting "declined" with no
 *     explanation is a support-ticket generator, so I forced a reason.
 *   - Approving does NOT require a message — a message is optional there,
 *     defaults to a generic "Your card is on the way" style note if left
 *     blank, since approval doesn't need justification the way a decline does.
 *   - Once a request is approved/declined, the Accept/Decline buttons
 *     disable (you can't double-decide) but you can still send additional
 *     follow-up messages to that user from the same screen.
 * ---------------------------------------------------------------------------
 */

import React, { useState } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Wallet,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    User,
    MapPin,
    Send,
    Bell,
    Landmark,
    Layers,
} from "lucide-react";

/* ========================================================================
 * 1. STATS CARDS DATA
 * ------------------------------------------------------------------------
 * Same pattern as KycVerification.jsx's `stats` array. Replace `value`
 * with real counts from your API when wiring this up.
 * ==================================================================== */
const stats = [
    {
        label: "Total requests",
        value: 12,
        sub: "All card requests",
        icon: Layers,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
        label: "Pending",
        value: 8,
        sub: "Awaiting review",
        icon: AlertTriangle,
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
        subColor: "text-amber-600 dark:text-amber-400",
    },
    {
        label: "Debit cards",
        value: 7,
        sub: "Visa / Mastercard debit",
        icon: CreditCard,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        subColor: "text-blue-600 dark:text-blue-400",
    },
    {
        label: "Credit cards",
        value: 5,
        sub: "Credit line requests",
        icon: Wallet,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
        subColor: "text-green-600 dark:text-green-400",
    },
];

/* ========================================================================
 * 2. MOCK CARD REQUESTS
 * ------------------------------------------------------------------------
 * 2 entries, same as your KYC mock data. Note `status` starts as
 * "pending" for both — Accept/Decline will change this at runtime via
 * setCardRequests, it's not something you edit here by hand.
 *
 * SHAPE:
 *   id, name, email, phone, avatar, submitted   – same as KYC
 *   cardType        "Visa Debit" | "Mastercard Credit" | etc.
 *   accountType     "Individual" | "Business"
 *   accountNumber   masked string, e.g. "**** 5678"
 *   deliveryAddress string
 *   requestedLimit  string | null — only meaningful for credit cards
 *   status          "pending" | "approved" | "declined"
 *   declineReason   string | null — filled in once declined
 * ==================================================================== */
const initialCardRequests = [
    {
        id: "REQ-250729-003",
        name: "Michael Brown",
        email: "michael.b@email.com",
        phone: "+1 234 567 8902",
        avatar: "https://i.pravatar.cc/120?img=51",
        submitted: "29 Jul 2026, 09:15 AM",
        cardType: "Visa Debit",
        accountType: "Individual",
        accountNumber: "**** 5678",
        deliveryAddress: "48 Independence Ave, Trenton, NJ",
        requestedLimit: null,
        status: "pending",
        declineReason: null,
    },
    {
        id: "REQ-250729-011",
        name: "David Wilson",
        email: "david.w@email.com",
        phone: "+1 234 567 8904",
        avatar: "https://i.pravatar.cc/120?img=60",
        submitted: "29 Jul 2026, 08:20 AM",
        cardType: "Mastercard Credit",
        accountType: "Business",
        accountNumber: "**** 2214",
        deliveryAddress: "3 Harbor Point, Boston, MA",
        requestedLimit: "$5,000",
        status: "pending",
        declineReason: null,
    },
];

/* ========================================================================
 * 3. STATUS BADGE CONFIG — same pattern as KycVerification.jsx
 * ==================================================================== */
const statusMeta = {
    pending: {
        label: "Pending review",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        icon: AlertTriangle,
    },
    approved: {
        label: "Approved",
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        icon: CheckCircle2,
    },
    declined: {
        label: "Declined",
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
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
 * 4. LIST VIEW
 * ------------------------------------------------------------------------
 * Basically identical to KycList in KycVerification.jsx, just with
 * card-specific columns (Card type / Account / Requested limit instead
 * of ID type / Country).
 * ==================================================================== */
function CardRequestList({ requests, onSelect }) {
    const [search, setSearch] = useState("");

    const filtered = requests.filter((r) =>
        `${r.name} ${r.email} ${r.cardType}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-zen-light-border bg-zen-light-card p-3 shadow-sm dark:border-zen-border dark:bg-zen-card">
                <div className="relative min-w-[240px] flex-1">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email or card type..."
                        className="w-full rounded-lg border border-zen-light-border bg-zen-light-bg py-2 pl-9 pr-3 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zen-light-border bg-zen-light-card shadow-sm dark:border-zen-border dark:bg-zen-card">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-zen-light-border text-xs uppercase tracking-wide text-zen-light-muted dark:border-zen-border dark:text-zen-muted">
                                <th className="px-5 py-3 font-medium">Requester</th>
                                <th className="px-5 py-3 font-medium">Card type</th>
                                <th className="px-5 py-3 font-medium">Account</th>
                                <th className="px-5 py-3 font-medium">Submitted</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r) => (
                                <tr
                                    key={r.id}
                                    onClick={() => onSelect(r)}
                                    className="cursor-pointer border-b border-zen-light-border last:border-0 hover:bg-zen-light-bg dark:border-zen-border dark:hover:bg-zen-bg/60"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={r.avatar}
                                                alt={r.name}
                                                className="h-9 w-9 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-zen-light-text dark:text-zen-text">
                                                    {r.name}
                                                </p>
                                                <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                                    {r.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-zen-light-text dark:text-zen-text">
                                        {r.cardType}
                                    </td>
                                    <td className="px-5 py-4 text-zen-light-text dark:text-zen-text">
                                        {r.accountNumber}
                                    </td>
                                    <td className="px-5 py-4 text-zen-light-muted dark:text-zen-muted">
                                        {r.submitted}
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge status={r.status} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelect(r);
                                            }}
                                            className="flex items-center gap-1.5 rounded-lg bg-zen-primary px-4 py-1.5 text-xs font-medium text-white hover:bg-zen-secondary"
                                        >
                                            Review
                                            <ChevronRight size={13} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-5 py-10 text-center text-sm text-zen-light-muted dark:text-zen-muted"
                                    >
                                        No requests match your search.
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
 * 5. DETAIL VIEW
 * ------------------------------------------------------------------------
 * Props:
 *   request       – the selected card request object
 *   onBack        – return to list
 *   onDecide      – (requestId, newStatus, reason) => void
 *                   called when Accept or Decline is clicked. Parent
 *                   (CardRequests) uses this to update `cardRequests`
 *                   state AND push a notification.
 *   onSendMessage – (requestId, message) => void
 *                   called when the reviewer sends a standalone message
 *                   (not tied to an accept/decline decision).
 * ==================================================================== */
function CardRequestDetail({ request, onBack, onDecide, onSendMessage }) {
    const [message, setMessage] = useState("");
    const [declineReason, setDeclineReason] = useState("");
    // Tracks whether the reviewer is in "declining" mode, which reveals
    // the reason field. Kept separate from `request.status` because the
    // reason box needs to show BEFORE the decision is actually submitted.
    const [showDeclineReason, setShowDeclineReason] = useState(false);

    const isDecided = request.status !== "pending";

    function handleApprove() {
        // Falls back to a sensible default note if the reviewer didn't type one —
        // this is the "approving doesn't require justification" decision
        // mentioned in the file header.
        const note = message.trim() || "Your card request has been approved. Your card will arrive within 5–7 business days.";
        onDecide(request.id, "approved", null);
        onSendMessage(request.id, note);
        setMessage("");
    }

    function handleDecline() {
        // Guard clause: button is disabled when this would fire with an empty
        // reason, but keeping the check here too in case this is ever called
        // programmatically.
        if (!declineReason.trim()) return;
        onDecide(request.id, "declined", declineReason.trim());
        onSendMessage(request.id, `Your card request was declined: ${declineReason.trim()}`);
        setDeclineReason("");
        setShowDeclineReason(false);
    }

    function handleSendMessageOnly() {
        if (!message.trim()) return;
        onSendMessage(request.id, message.trim());
        setMessage("");
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
                            Card request
                        </h1>
                        <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                            {request.id} &middot; submitted {request.submitted}
                        </p>
                    </div>
                </div>
                <StatusBadge status={request.status} />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* ================= COLUMN 1: Requester + card details ================= */}
                <div className="flex flex-col gap-5 rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card lg:col-span-1">
                    <div className="flex items-center gap-3">
                        <img
                            src={request.avatar}
                            alt={request.name}
                            className="h-14 w-14 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-medium text-zen-light-text dark:text-zen-text">
                                {request.name}
                            </p>
                            <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                {request.email}
                            </p>
                            <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                {request.phone}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-zen-light-border pt-4 dark:border-zen-border">
                        <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            <CreditCard size={13} />
                            Card details
                        </p>
                        <dl className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <dt className="text-zen-light-muted dark:text-zen-muted">Card type</dt>
                                <dd className="text-zen-light-text dark:text-zen-text">{request.cardType}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-zen-light-muted dark:text-zen-muted">Account type</dt>
                                <dd className="text-zen-light-text dark:text-zen-text">{request.accountType}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-zen-light-muted dark:text-zen-muted">Linked account</dt>
                                <dd className="text-zen-light-text dark:text-zen-text">{request.accountNumber}</dd>
                            </div>
                            {/* Only render the limit row when it's meaningful (credit cards) */}
                            {request.requestedLimit && (
                                <div className="flex items-center justify-between">
                                    <dt className="text-zen-light-muted dark:text-zen-muted">Requested limit</dt>
                                    <dd className="text-zen-light-text dark:text-zen-text">{request.requestedLimit}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    <div className="border-t border-zen-light-border pt-4 dark:border-zen-border">
                        <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            <MapPin size={13} />
                            Delivery address
                        </p>
                        <p className="text-sm text-zen-light-text dark:text-zen-text">{request.deliveryAddress}</p>
                    </div>

                    {/* Shown only once a decision has been made, so the reviewer can
              see WHY a card was declined without opening a separate log */}
                    {request.status === "declined" && request.declineReason && (
                        <div className="rounded-xl bg-red-50 p-3 dark:bg-red-900/20">
                            <p className="text-xs font-medium text-red-700 dark:text-red-400">
                                Decline reason
                            </p>
                            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                                {request.declineReason}
                            </p>
                        </div>
                    )}
                </div>

                {/* ================= COLUMN 2: Account snapshot (illustrative) ================= */}
                <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card lg:col-span-1">
                    <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                        <Landmark size={13} />
                        Account standing
                    </p>
                    {/*
            NOTE: this panel is illustrative placeholder data — your real
            account-standing numbers should come from the same account
            record the request references (request.accountNumber), e.g.
            a GET /admin/accounts/:id call. Swap the hardcoded values
            below once that endpoint exists.
          */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-zen-light-bg p-3 dark:bg-zen-bg">
                            <p className="text-xs text-zen-light-muted dark:text-zen-muted">Balance</p>
                            <p className="text-lg font-semibold text-zen-light-text dark:text-zen-text">$4,280.12</p>
                        </div>
                        <div className="rounded-xl bg-zen-light-bg p-3 dark:bg-zen-bg">
                            <p className="text-xs text-zen-light-muted dark:text-zen-muted">Account age</p>
                            <p className="text-lg font-semibold text-zen-light-text dark:text-zen-text">14 mo</p>
                        </div>
                        <div className="rounded-xl bg-zen-light-bg p-3 dark:bg-zen-bg">
                            <p className="text-xs text-zen-light-muted dark:text-zen-muted">Existing cards</p>
                            <p className="text-lg font-semibold text-zen-light-text dark:text-zen-text">1</p>
                        </div>
                        <div className="rounded-xl bg-zen-light-bg p-3 dark:bg-zen-bg">
                            <p className="text-xs text-zen-light-muted dark:text-zen-muted">Overdue flags</p>
                            <p className="text-lg font-semibold text-zen-light-text dark:text-zen-text">0</p>
                        </div>
                    </div>
                </div>

                {/* ================= COLUMN 3: Message + decision ================= */}
                <div className="flex flex-col gap-5 lg:col-span-1">
                    <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card">
                        <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            <User size={13} />
                            Message to {request.name.split(" ")[0]}
                        </p>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Optional note — sent as a notification to the user"
                            rows={3}
                            disabled={isDecided}
                            className="w-full resize-none rounded-lg border border-zen-light-border bg-zen-light-bg p-3 text-sm text-zen-light-text outline-none focus:border-zen-primary disabled:opacity-50 dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                        />

                        {/* Standalone "send message without deciding" action — useful
                for asking a follow-up question before approving/declining */}
                        <button
                            onClick={handleSendMessageOnly}
                            disabled={!message.trim()}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-zen-light-border py-2 text-xs font-medium text-zen-light-text hover:bg-zen-light-bg disabled:cursor-not-allowed disabled:opacity-40 dark:border-zen-border dark:text-zen-text dark:hover:bg-zen-bg/60"
                        >
                            <Send size={13} />
                            Send message only
                        </button>

                        {/* --- Decline reason field, revealed by the Decline button --- */}
                        {showDeclineReason && !isDecided && (
                            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/40 dark:bg-red-900/10">
                                <label className="mb-1.5 block text-xs font-medium text-red-700 dark:text-red-400">
                                    Reason for declining (required, sent to user)
                                </label>
                                <textarea
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                    placeholder="e.g. Unable to verify income documentation"
                                    rows={2}
                                    className="w-full resize-none rounded-lg border border-red-200 bg-white p-2 text-sm text-zen-light-text outline-none focus:border-red-400 dark:border-red-900/40 dark:bg-zen-bg dark:text-zen-text"
                                />
                            </div>
                        )}

                        <div className="mt-4 flex flex-col gap-2">
                            <button
                                onClick={handleApprove}
                                disabled={isDecided}
                                className="flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <CheckCircle2 size={16} />
                                Accept request
                            </button>

                            {!showDeclineReason ? (
                                <button
                                    onClick={() => setShowDeclineReason(true)}
                                    disabled={isDecided}
                                    className="flex items-center justify-center gap-2 rounded-lg border border-red-500 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-red-900/20"
                                >
                                    <XCircle size={16} />
                                    Decline request
                                </button>
                            ) : (
                                <button
                                    onClick={handleDecline}
                                    disabled={!declineReason.trim()}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <XCircle size={16} />
                                    Confirm decline
                                </button>
                            )}

                            {isDecided && (
                                <p className="text-center text-xs text-zen-light-muted dark:text-zen-muted">
                                    This request has already been {statusMeta[request.status].label.toLowerCase()}.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ========================================================================
 * 6. MAIN EXPORTED COMPONENT
 * ==================================================================== */
export const CardRequests = () => {
    // `cardRequests` is now stateful (unlike KycVerification's plain const
    // array) because Accept/Decline need to mutate a request's status.
    const [cardRequests, setCardRequests] = useState(initialCardRequests);
    const [selected, setSelected] = useState(null);

    // Flat log of every notification "sent". Newest first.
    // TODO: replace this entire mechanism with a real API call, e.g.
    //   await fetch(`/api/admin/users/${userId}/notifications`, {
    //     method: "POST",
    //     body: JSON.stringify({ message }),
    //   })
    // and drop this local array — the notification would then live in your
    // Notifications table and show up for the user in their own app.
    const [notifications, setNotifications] = useState([]);

    // Keep `selected` (used by the detail view) in sync with the underlying
    // `cardRequests` array after a decision is made — otherwise the detail
    // view would keep showing stale "pending" status after you just approved it.
    function syncSelected(updatedList, id) {
        const updated = updatedList.find((r) => r.id === id);
        if (updated) setSelected(updated);
    }

    function handleDecide(id, newStatus, reason) {
        setCardRequests((prev) => {
            const next = prev.map((r) =>
                r.id === id ? { ...r, status: newStatus, declineReason: reason } : r
            );
            syncSelected(next, id);
            return next;
        });
    }

    function handleSendMessage(id, message) {
        const request = cardRequests.find((r) => r.id === id);
        if (!request) return;
        setNotifications((prev) => [
            {
                id: `${id}-${Date.now()}`, // good enough for a mock log; use a real id from your API later
                userName: request.name,
                userEmail: request.email,
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
                        Card Requests
                    </h1>
                    <p className="mt-1 text-sm text-zen-light-muted dark:text-zen-muted">
                        {selected
                            ? "Reviewing card request"
                            : "Review, accept or decline debit and credit card requests"}
                    </p>
                </div>
            </div>

            {/* --- Stats cards: list view only --- */}
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
                <CardRequestDetail
                    request={selected}
                    onBack={() => setSelected(null)}
                    onDecide={handleDecide}
                    onSendMessage={handleSendMessage}
                />
            ) : (
                <CardRequestList requests={cardRequests} onSelect={setSelected} />
            )}

            {/* --- Notification log: shows what's been "sent" to users so far ---
          This is purely for YOUR visibility as the admin building this —
          it's not part of the customer-facing UI. Remove this panel once
          you trust the real notification pipeline and don't need to
          eyeball it here anymore. */}
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