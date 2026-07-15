import { useState, useMemo } from "react";
import {
    Search,
    MoreVertical,
    ShieldCheck,
    ShieldOff,
    Trash2,
    X,
    ArrowUpDown,
    Users,
    CircleDot,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock data — swap this out for a real fetch("/api/admin/users") call.
// Shape matches what your Go /api/register + /api/me handlers already return,
// extended with fields an admin view needs (status, balance, joinedAt).
// ---------------------------------------------------------------------------
const MOCK_USERS = [
    { id: 1, firstName: "Chidi", lastName: "Okafor", email: "chidi.okafor@example.com", phone: "08012345678", country: "Nigeria", status: "active", balance: 452300, joinedAt: "2026-05-02" },
    { id: 2, firstName: "Amara", lastName: "Nwosu", email: "amara.nwosu@example.com", phone: "08023456789", country: "Nigeria", status: "active", balance: 1289000, joinedAt: "2026-05-14" },
    { id: 3, firstName: "Tunde", lastName: "Bakare", email: "tunde.b@example.com", phone: "08034567890", country: "Nigeria", status: "pending", balance: 0, joinedAt: "2026-07-09" },
    { id: 4, firstName: "Ifeoma", lastName: "Eze", email: "ifeoma.eze@example.com", phone: "08045678901", country: "Nigeria", status: "suspended", balance: 87500, joinedAt: "2026-04-18" },
    { id: 5, firstName: "Emeka", lastName: "Obi", email: "emeka.obi@example.com", phone: "08056789012", country: "Nigeria", status: "active", balance: 2310750, joinedAt: "2026-06-01" },
    { id: 6, firstName: "Zainab", lastName: "Suleiman", email: "zainab.s@example.com", phone: "08067890123", country: "Nigeria", status: "active", balance: 63200, joinedAt: "2026-06-22" },
    { id: 7, firstName: "David", lastName: "Adeyemi", email: "david.adeyemi@example.com", phone: "08078901234", country: "Nigeria", status: "pending", balance: 0, joinedAt: "2026-07-10" },
];

const STATUS_STYLES = {
    active: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/30 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
    suspended: "bg-rose-500/10 text-rose-500 ring-rose-500/30 dark:bg-rose-400/10 dark:text-rose-400 dark:ring-rose-400/20",
    pending: "bg-amber-500/10 text-amber-500 ring-amber-500/30 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20",
};

const AVATAR_PALETTE = [
    "bg-zen-primary", "bg-zen-secondary", "bg-sky-500",
    "bg-cyan-500", "bg-blue-600", "bg-indigo-500",
];

function formatNaira(kobo) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(kobo);
}

function initials(first, last) {
    return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
        >
            <CircleDot className="h-3 w-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

function Avatar({ first, last }) {
    const idx = (first?.charCodeAt(0) ?? 0) % AVATAR_PALETTE.length;
    return (
        <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${AVATAR_PALETTE[idx]}`}
        >
            {initials(first, last)}
        </div>
    );
}

function UserDrawer({ user, onClose, onAction }) {
    if (!user) return null;
    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
                onClick={onClose}
            />
            <div className="relative flex h-full w-full max-w-md flex-col bg-zen-light-card dark:bg-zen-card dark:border-l dark:border-zen-border shadow-2xl">
                <div className="flex items-center justify-between border-b border-zen-light-border px-6 py-5 dark:border-zen-border">
                    <h2 className="font-['Manrope'] text-base font-semibold text-zen-light-text dark:text-zen-text">
                        User details
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-zen-light-muted transition hover:bg-zen-light-bg hover:text-zen-light-text dark:text-zen-muted dark:hover:bg-zen-bg dark:hover:text-zen-text"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zen-primary text-lg font-semibold text-white shadow-neon">
                            {initials(user.firstName, user.lastName)}
                        </div>
                        <div>
                            <p className="font-['Manrope'] text-lg font-semibold text-zen-light-text dark:text-zen-text">
                                {user.firstName} {user.lastName}
                            </p>
                            <div className="mt-1">
                                <StatusBadge status={user.status} />
                            </div>
                        </div>
                    </div>

                    <dl className="mt-6 space-y-4 text-sm">
                        <div className="flex justify-between border-b border-zen-light-border pb-3 dark:border-zen-border">
                            <dt className="text-zen-light-muted dark:text-zen-muted">Email</dt>
                            <dd className="font-medium text-zen-light-text dark:text-zen-text">{user.email}</dd>
                        </div>
                        <div className="flex justify-between border-b border-zen-light-border pb-3 dark:border-zen-border">
                            <dt className="text-zen-light-muted dark:text-zen-muted">Phone</dt>
                            <dd className="font-medium text-zen-light-text dark:text-zen-text">{user.phone}</dd>
                        </div>
                        <div className="flex justify-between border-b border-zen-light-border pb-3 dark:border-zen-border">
                            <dt className="text-zen-light-muted dark:text-zen-muted">Country</dt>
                            <dd className="font-medium text-zen-light-text dark:text-zen-text">{user.country}</dd>
                        </div>
                        <div className="flex justify-between border-b border-zen-light-border pb-3 dark:border-zen-border">
                            <dt className="text-zen-light-muted dark:text-zen-muted">Joined</dt>
                            <dd className="font-medium text-zen-light-text dark:text-zen-text">
                                {new Date(user.joinedAt).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </dd>
                        </div>
                        <div className="flex justify-between pb-3">
                            <dt className="text-zen-light-muted dark:text-zen-muted">Wallet balance</dt>
                            <dd className="font-['Manrope'] font-semibold text-zen-light-text dark:text-zen-text">
                                {formatNaira(user.balance)}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="border-t border-zen-light-border px-6 py-4 dark:border-zen-border">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                        Actions
                    </p>
                    <div className="flex flex-col gap-2">
                        {user.status !== "active" && (
                            <button
                                onClick={() => onAction("activate", user)}
                                className="flex items-center justify-center gap-2 rounded-lg bg-zen-primary px-4 py-2.5 text-sm font-medium text-white transition hover:shadow-neon"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Approve & activate
                            </button>
                        )}
                        {user.status !== "suspended" && (
                            <button
                                onClick={() => onAction("suspend", user)}
                                className="flex items-center justify-center gap-2 rounded-lg bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-500 ring-1 ring-inset ring-amber-500/30 transition hover:bg-amber-500/20 dark:text-amber-400 dark:ring-amber-400/20"
                            >
                                <ShieldOff className="h-4 w-4" />
                                Suspend account
                            </button>
                        )}
                        <button
                            onClick={() => onAction("delete", user)}
                            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-rose-500 ring-1 ring-inset ring-rose-500/30 transition hover:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-400/20"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete user
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminUsers() {
    const [users, setUsers] = useState(MOCK_USERS);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortAsc, setSortAsc] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    const filtered = useMemo(() => {
        let result = users.filter((u) => {
            const matchesQuery =
                `${u.firstName} ${u.lastName} ${u.email}`
                    .toLowerCase()
                    .includes(query.toLowerCase());
            const matchesStatus = statusFilter === "all" || u.status === statusFilter;
            return matchesQuery && matchesStatus;
        });
        result.sort((a, b) =>
            sortAsc
                ? a.firstName.localeCompare(b.firstName)
                : b.firstName.localeCompare(a.firstName)
        );
        return result;
    }, [users, query, statusFilter, sortAsc]);

    function handleAction(action, user) {
        if (action === "delete") {
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
        } else if (action === "suspend") {
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, status: "suspended" } : u))
            );
        } else if (action === "activate") {
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, status: "active" } : u))
            );
        }
        setSelectedUser(null);
        setOpenMenuId(null);
        // TODO: replace with real API calls, e.g.
        // fetch(`/api/admin/users/${user.id}/${action}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } })
    }

    const counts = useMemo(
        () => ({
            total: users.length,
            active: users.filter((u) => u.status === "active").length,
            pending: users.filter((u) => u.status === "pending").length,
            suspended: users.filter((u) => u.status === "suspended").length,
        }),
        [users]
    );

    return (
        <div className="min-h-screen bg-zen-light-bg px-6 py-8 text-zen-light-text transition-colors duration-500 dark:bg-zen-gradient dark:text-zen-text">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zen-primary shadow-neon">
                        <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-['Manrope'] text-xl font-semibold text-zen-light-text dark:text-zen-text">
                            Users
                        </h1>
                        <p className="text-sm text-zen-light-muted dark:text-zen-muted">
                            Manage every account registered on Zenvault.
                        </p>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                        { label: "Total users", value: counts.total, tone: "text-zen-light-text dark:text-zen-text" },
                        { label: "Active", value: counts.active, tone: "text-emerald-500 dark:text-emerald-400" },
                        { label: "Pending", value: counts.pending, tone: "text-amber-500 dark:text-amber-400" },
                        { label: "Suspended", value: counts.suspended, tone: "text-rose-500 dark:text-rose-400" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-xl border border-zen-light-border bg-zen-light-card px-4 py-3.5 dark:border-zen-border dark:bg-card-col-gradient"
                        >
                            <p className="text-xs font-medium text-zen-light-muted dark:text-zen-muted">
                                {stat.label}
                            </p>
                            <p className={`mt-1 font-['Manrope'] text-2xl font-semibold ${stat.tone}`}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search name or email..."
                            className="w-full rounded-lg border border-zen-light-border bg-zen-light-card py-2 pl-9 pr-3 text-sm text-zen-light-text placeholder:text-zen-light-muted focus:border-zen-primary focus:outline-none focus:ring-2 focus:ring-zen-primary/20 dark:border-zen-border dark:bg-zen-card dark:text-zen-text dark:placeholder:text-zen-muted"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {["all", "active", "pending", "suspended"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${statusFilter === s
                                    ? "bg-zen-primary text-white shadow-neon"
                                    : "bg-zen-light-card text-zen-light-muted ring-1 ring-inset ring-zen-light-border hover:bg-zen-light-bg dark:bg-zen-card dark:text-zen-muted dark:ring-zen-border dark:hover:bg-zen-bg"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-zen-light-border bg-zen-light-card dark:border-zen-border dark:bg-zen-card">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-zen-light-border bg-zen-light-bg/60 dark:border-zen-border dark:bg-zen-bg/40">
                                <th className="px-5 py-3 font-medium text-zen-light-muted dark:text-zen-muted">
                                    <button
                                        onClick={() => setSortAsc((v) => !v)}
                                        className="flex items-center gap-1 hover:text-zen-light-text dark:hover:text-zen-text"
                                    >
                                        Name <ArrowUpDown className="h-3.5 w-3.5" />
                                    </button>
                                </th>
                                <th className="px-5 py-3 font-medium text-zen-light-muted dark:text-zen-muted">Email</th>
                                <th className="px-5 py-3 font-medium text-zen-light-muted dark:text-zen-muted">Status</th>
                                <th className="px-5 py-3 font-medium text-zen-light-muted dark:text-zen-muted">Balance</th>
                                <th className="px-5 py-3 font-medium text-zen-light-muted dark:text-zen-muted">Joined</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((user) => (
                                <tr
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className="cursor-pointer border-b border-zen-light-border/60 transition hover:bg-zen-light-bg dark:border-zen-border/60 dark:hover:bg-zen-bg/50"
                                >
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <Avatar first={user.firstName} last={user.lastName} />
                                            <span className="font-medium text-zen-light-text dark:text-zen-text">
                                                {user.firstName} {user.lastName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-zen-light-muted dark:text-zen-muted">
                                        {user.email}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <StatusBadge status={user.status} />
                                    </td>
                                    <td className="px-5 py-3.5 font-medium text-zen-light-text dark:text-zen-text">
                                        {formatNaira(user.balance)}
                                    </td>
                                    <td className="px-5 py-3.5 text-zen-light-muted dark:text-zen-muted">
                                        {new Date(user.joinedAt).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                        })}
                                    </td>
                                    <td
                                        className="relative px-5 py-3.5 text-right"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() =>
                                                setOpenMenuId(openMenuId === user.id ? null : user.id)
                                            }
                                            className="rounded-full p-1.5 text-zen-light-muted transition hover:bg-zen-light-bg hover:text-zen-light-text dark:text-zen-muted dark:hover:bg-zen-bg dark:hover:text-zen-text"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                        {openMenuId === user.id && (
                                            <div className="absolute right-5 top-11 z-10 w-44 overflow-hidden rounded-lg border border-zen-light-border bg-zen-light-card py-1 shadow-lg dark:border-zen-border dark:bg-zen-card">
                                                {user.status !== "active" && (
                                                    <button
                                                        onClick={() => handleAction("activate", user)}
                                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zen-light-text hover:bg-zen-light-bg dark:text-zen-text dark:hover:bg-zen-bg"
                                                    >
                                                        <ShieldCheck className="h-3.5 w-3.5" /> Activate
                                                    </button>
                                                )}
                                                {user.status !== "suspended" && (
                                                    <button
                                                        onClick={() => handleAction("suspend", user)}
                                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zen-light-text hover:bg-zen-light-bg dark:text-zen-text dark:hover:bg-zen-bg"
                                                    >
                                                        <ShieldOff className="h-3.5 w-3.5" /> Suspend
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleAction("delete", user)}
                                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-500 hover:bg-rose-500/10 dark:text-rose-400"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-5 py-10 text-center text-sm text-zen-light-muted dark:text-zen-muted"
                                    >
                                        No users match your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserDrawer
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
                onAction={handleAction}
            />
        </div>
    );
}