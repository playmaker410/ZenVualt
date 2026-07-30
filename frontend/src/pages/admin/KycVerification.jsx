/**
 * KycVerification.jsx
 * ---------------------------------------------------------------------------
 * Admin page for reviewing user KYC (Know Your Customer) submissions.
 *
 * STRUCTURE OF THIS FILE (top to bottom):
 *   1. Imports
 *   2. `stats`            – the 5 summary cards at the top of the page
 *   3. `kycSubmissions`   – MOCK DATA. Replace with a real API call later.
 *   4. `statusMeta`       – maps a status string ("pending"/"approved"/
 *                           "rejected") to a label, color classes, and icon
 *   5. `StatusBadge`      – small pill component that renders using statusMeta
 *   6. `CheckStatusIcon`  – tiny icon used inside the "Automated checks" list
 *   7. `KycList`          – the TABLE VIEW (list of all submissions)
 *   8. `KycDetail`        – the DETAIL VIEW (one applicant, full review)
 *   9. `KycVerification`  – the MAIN EXPORTED COMPONENT. Decides whether to
 *                           show KycList or KycDetail based on local state.
 *
 * HOW THE LIST <-> DETAIL SWITCH WORKS:
 *   - `KycVerification` holds `selected` in useState.
 *   - `selected === null`        -> render <KycList />
 *   - `selected === <applicant>` -> render <KycDetail />
 *   - Clicking a row (or its "Review" button) in KycList calls onSelect(s),
 *     which sets `selected` to that applicant object.
 *   - Clicking "Back" in KycDetail calls onBack(), which resets
 *     `selected` back to null, returning you to the list.
 *   - This is pure client-side state, no routing involved. If you later
 *     want a real URL per applicant (e.g. /admin/kyc/:id), replace this
 *     `selected` state with React Router's useParams/useNavigate.
 *
 * COLOR / THEME SYSTEM USED HERE:
 *   This file uses YOUR project's real `zen-*` tokens defined in index.css
 *   under `@theme`, e.g.:
 *     --color-zen-bg, --color-zen-card, --color-zen-border,
 *     --color-zen-primary, --color-zen-secondary, --color-zen-text,
 *     --color-zen-muted
 *   ...plus the light-mode equivalents:
 *     --color-zen-light-bg, --color-zen-light-card, --color-zen-light-border,
 *     --color-zen-light-text, --color-zen-light-muted
 *   Pattern used everywhere: `text-zen-light-text dark:text-zen-text`
 *   (light value first, dark value after `dark:`).
 *
 *   IMPORTANT: your @theme does NOT define a success/danger/warning color,
 *   so status colors (green/amber/red) use PLAIN Tailwind colors instead
 *   of zen-* tokens. That's intentional, not a mistake — don't try to
 *   "fix" these into zen-* names unless you add those tokens to index.css.
 *
 *   NOTE: this is a *different* system from the `.abd-root` / `data-mode`
 *   CSS-variable theme also present in your index.css (used by some other
 *   dashboard components). Don't mix `abd-*` classes into this file — they
 *   won't do anything here since this page never sets `data-mode`.
 * ---------------------------------------------------------------------------
 */

import React, { useState } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    ShieldCheck,
    CreditCard,
    Landmark,
    Users,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileText,
    MapPin,
    User,
    Fingerprint,
    ScanFace,
    Flag,
    ZoomIn,
} from "lucide-react";

/* ========================================================================
 * 1. STATS CARDS DATA
 * ------------------------------------------------------------------------
 * These 5 numbers are shown ONLY on the list view (hidden while reviewing
 * a specific applicant — see the `{!selected && (...)}` check further down).
 *
 * Each entry:
 *   label     -> small caption text
 *   value     -> the big number
 *   sub       -> small caption under the number
 *   icon      -> lucide-react icon component
 *   iconBg    -> background color behind the icon (Tailwind default colors,
 *                NOT zen-* — see file header note above)
 *   iconColor -> icon color
 *   subColor  -> (optional) overrides the default muted color on the `sub`
 *                caption, used to tint it to match the icon
 *
 * TODO when wiring to backend: replace hardcoded `value` numbers with
 * real counts fetched from your Go API (e.g. GET /admin/requests/summary).
 * ==================================================================== */
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
        iconColor: "text-orange-600 dark:text-orange-400",
        subColor: "text-orange-600 dark:text-orange-400",
    },
    {
        label: "KYC Verifications",
        value: 17,
        sub: "Identity verification",
        icon: ShieldCheck,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
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
        iconColor: "text-purple-600 dark:text-purple-400",
        subColor: "text-purple-600 dark:text-purple-400",
    },
];

/* ========================================================================
 * 2. MOCK KYC SUBMISSIONS
 * ------------------------------------------------------------------------
 * THIS IS FAKE DATA. Only 2 entries on purpose, to keep the preview
 * light. Replace the whole array with data fetched from your API, e.g.:
 *
 *   const [kycSubmissions, setKycSubmissions] = useState([]);
 *   useEffect(() => {
 *     fetch("/api/admin/kyc").then(r => r.json()).then(setKycSubmissions);
 *   }, []);
 *
 * SHAPE EACH OBJECT MUST HAVE (so KycList/KycDetail don't break):
 *   id            string   – unique request id, shown in detail header
 *   name          string
 *   email         string
 *   phone         string
 *   avatar        string   – image URL
 *   submitted     string   – display-formatted date/time
 *   idType        string   – "Passport" / "Driver License" / etc.
 *   idNumber      string
 *   country       string
 *   dob           string
 *   issueDate     string
 *   expiryDate    string
 *   address       string
 *   status        "pending" | "approved" | "rejected"  (must match a key
 *                 in `statusMeta` below or StatusBadge will crash)
 *   documents     array of { label: string, img: string }
 *                 – rendered as image cards in the "Submitted documents"
 *                 column (ID front, ID back, Selfie, etc.)
 *   checks        array of { label, detail, status }
 *                 – status must be "pass" | "fail" | "flag"
 *                 – rendered in the "Automated checks" panel
 * ==================================================================== */
const kycSubmissions = [
    {
        id: "REQ-250729-002",
        name: "Mary Jane",
        email: "mary.jane@email.com",
        phone: "+1 234 567 8901",
        avatar: "https://i.pravatar.cc/120?img=32",
        submitted: "29 Jul 2026, 09:45 AM",
        idType: "Passport",
        idNumber: "P84920156",
        country: "United States",
        dob: "14 Mar 1994",
        issueDate: "02 Jan 2022",
        expiryDate: "01 Jan 2032",
        address: "221B Baker Street, New York, NY",
        status: "pending", // -> shows amber "Pending review" badge
        documents: [
            { label: "ID front", img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=260&fit=crop" },
            { label: "ID back", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=260&fit=crop" },
            { label: "Selfie", img: "https://i.pravatar.cc/400?img=32" },
        ],
        checks: [
            { label: "Document authenticity", detail: "Security features and format verified", status: "pass" },
            { label: "Face match", detail: "Selfie matches document photo (98% confidence)", status: "pass" },
            { label: "Data consistency", detail: "Name and DOB match across document fields", status: "pass" },
            // "flag" status = not a hard failure, but needs a human look
            { label: "Address verification", detail: "Address not yet confirmed against utility bill", status: "flag" },
        ],
    },
    {
        id: "REQ-250729-006",
        name: "Fatima Aliyu",
        email: "fatima.a@email.com",
        phone: "+1 234 567 8905",
        avatar: "https://i.pravatar.cc/120?img=45",
        submitted: "29 Jul 2026, 07:55 AM",
        idType: "Driver License",
        idNumber: "DL2209871",
        country: "Nigeria",
        dob: "22 Aug 1990",
        issueDate: "10 May 2021",
        expiryDate: "09 May 2031",
        address: "14 Zik Avenue, Enugu, Nigeria",
        status: "approved", // -> shows green "Approved" badge
        documents: [
            { label: "ID front", img: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=260&fit=crop" },
            { label: "ID back", img: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=400&h=260&fit=crop" },
            { label: "Selfie", img: "https://i.pravatar.cc/400?img=45" },
        ],
        checks: [
            { label: "Document authenticity", detail: "Security features and format verified", status: "pass" },
            { label: "Face match", detail: "Selfie matches document photo (95% confidence)", status: "pass" },
            { label: "Data consistency", detail: "Name and DOB match across document fields", status: "pass" },
            { label: "Address verification", detail: "Address confirmed against utility bill", status: "pass" },
        ],
    },
];

/* ========================================================================
 * 3. STATUS BADGE CONFIG
 * ------------------------------------------------------------------------
 * Single source of truth for how each `status` string should look.
 * Add a new status (e.g. "expired") by adding a new key here — StatusBadge
 * and the applicant.status field will pick it up automatically.
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
    rejected: {
        label: "Rejected",
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        icon: XCircle,
    },
};

/**
 * StatusBadge
 * Renders the small rounded pill (icon + label) used both in the list
 * table's "Status" column and at the top of the detail view.
 *
 * @param {"pending"|"approved"|"rejected"} status
 */
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

/**
 * CheckStatusIcon
 * Small colored icon used next to each row in the "Automated checks" list
 * inside the detail view. Independent of StatusBadge because a "check"
 * uses a different vocabulary ("pass"/"fail"/"flag") than the overall
 * applicant status ("pending"/"approved"/"rejected").
 *
 * @param {"pass"|"fail"|"flag"} status
 */
function CheckStatusIcon({ status }) {
    if (status === "pass") return <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />;
    if (status === "fail") return <XCircle size={18} className="text-red-600 dark:text-red-400" />;
    // anything else (e.g. "flag") falls through to the amber warning icon
    return <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400" />;
}

/* ========================================================================
 * 4. LIST VIEW — table of every KYC submission
 * ------------------------------------------------------------------------
 * Props:
 *   submissions  – array of applicant objects (see shape notes above)
 *   onSelect     – callback fired with the clicked applicant object;
 *                  parent (KycVerification) uses this to switch to detail
 * Internal state:
 *   search       – live text filter, matched against name/email/country
 * ==================================================================== */
function KycList({ submissions, onSelect }) {
    const [search, setSearch] = useState("");

    // Client-side filter. Fine for small lists; if the real list gets big,
    // move this filtering server-side (send `search` as a query param).
    const filtered = submissions.filter((s) =>
        `${s.name} ${s.email} ${s.country}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
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
                        placeholder="Search by name, email or country..."
                        className="w-full rounded-lg border border-zen-light-border bg-zen-light-bg py-2 pl-9 pr-3 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                    />
                </div>
            </div>

            {/* --- Table card --- */}
            <div className="overflow-hidden rounded-2xl border border-zen-light-border bg-zen-light-card shadow-sm dark:border-zen-border dark:bg-zen-card">
                {/* overflow-x-auto lets the table scroll sideways on small screens
            instead of squashing columns */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-zen-light-border text-xs uppercase tracking-wide text-zen-light-muted dark:border-zen-border dark:text-zen-muted">
                                <th className="px-5 py-3 font-medium">Applicant</th>
                                <th className="px-5 py-3 font-medium">ID type</th>
                                <th className="px-5 py-3 font-medium">Country</th>
                                <th className="px-5 py-3 font-medium">Submitted</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s) => (
                                // Clicking ANYWHERE on the row opens the detail view.
                                // The "Review" button also does this — its own onClick
                                // calls e.stopPropagation() so it doesn't double-fire
                                // the row's onClick as well.
                                <tr
                                    key={s.id}
                                    onClick={() => onSelect(s)}
                                    className="cursor-pointer border-b border-zen-light-border last:border-0 hover:bg-zen-light-bg dark:border-zen-border dark:hover:bg-zen-bg/60"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={s.avatar}
                                                alt={s.name}
                                                className="h-9 w-9 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-zen-light-text dark:text-zen-text">
                                                    {s.name}
                                                </p>
                                                <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                                    {s.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-zen-light-text dark:text-zen-text">
                                        {s.idType}
                                    </td>
                                    <td className="px-5 py-4 text-zen-light-text dark:text-zen-text">
                                        {s.country}
                                    </td>
                                    <td className="px-5 py-4 text-zen-light-muted dark:text-zen-muted">
                                        {s.submitted}
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge status={s.status} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // prevent the <tr> onClick from also firing
                                                onSelect(s);
                                            }}
                                            className="flex items-center gap-1.5 rounded-lg bg-zen-primary px-4 py-1.5 text-xs font-medium text-white hover:bg-zen-secondary"
                                        >
                                            Review
                                            <ChevronRight size={13} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {/* Empty state when search matches nothing */}
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-5 py-10 text-center text-sm text-zen-light-muted dark:text-zen-muted"
                                    >
                                        No submissions match your search.
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
 * 5. DETAIL VIEW — full review screen for ONE applicant
 * ------------------------------------------------------------------------
 * Props:
 *   applicant – the full applicant object selected from the list
 *   onBack    – callback to return to the list (clears `selected` in parent)
 *
 * Layout: 3-column grid on large screens (lg:grid-cols-3), stacks to a
 * single column on mobile.
 *   Column 1 -> applicant + ID document details
 *   Column 2 -> submitted document images (front / back / selfie)
 *   Column 3 -> automated checks + reviewer note + decision buttons
 * ==================================================================== */
function KycDetail({ applicant, onBack }) {
    // Local-only note field. Not persisted anywhere yet — wire this up to
    // your API when you add a real "submit decision" action (see the
    // Approve/Reject/Flag buttons below, which are currently NOT wired
    // to any handler — they're visual only until you add onClick logic).
    const [note, setNote] = useState("");

    return (
        <div>
            {/* --- Header: back button, title, request id, status badge --- */}
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
                            KYC verification
                        </h1>
                        <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                            {applicant.id} &middot; submitted {applicant.submitted}
                        </p>
                    </div>
                </div>
                <StatusBadge status={applicant.status} />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* ================= COLUMN 1: Applicant + ID details ================= */}
                <div className="flex flex-col gap-5 rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card lg:col-span-1">
                    {/* avatar + contact info */}
                    <div className="flex items-center gap-3">
                        <img
                            src={applicant.avatar}
                            alt={applicant.name}
                            className="h-14 w-14 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-medium text-zen-light-text dark:text-zen-text">
                                {applicant.name}
                            </p>
                            <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                {applicant.email}
                            </p>
                            <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                {applicant.phone}
                            </p>
                        </div>
                    </div>

                    {/* ID document fields, laid out as a definition list (dt/dd pairs) */}
                    <div className="border-t border-zen-light-border pt-4 dark:border-zen-border">
                        <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            <FileText size={13} />
                            Document details
                        </p>
                        <dl className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <dt className="text-zen-light-muted dark:text-zen-muted">ID type</dt>
                                <dd className="text-zen-light-text dark:text-zen-text">{applicant.idType}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-zen-light-muted dark:text-zen-muted">ID number</dt>
                                <dd className="text-zen-light-text dark:text-zen-text">{applicant.idNumber}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-zen-light-muted dark:text-zen-muted">Country</dt>
                                <dd className="text-zen-light-text dark:text-zen-text">{applicant.country}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-zen-light-muted dark:text-zen-muted">Date of birth</dt>
                                <dd className="text-zen-light-text dark:text-zen-text">{applicant.dob}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-zen-light-muted dark:text-zen-muted">Issued</dt>
                                <dd className="text-zen-light-text dark:text-zen-text">{applicant.issueDate}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-zen-light-muted dark:text-zen-muted">Expires</dt>
                                <dd className="text-zen-light-text dark:text-zen-text">{applicant.expiryDate}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* address on file */}
                    <div className="border-t border-zen-light-border pt-4 dark:border-zen-border">
                        <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            <MapPin size={13} />
                            Address on file
                        </p>
                        <p className="text-sm text-zen-light-text dark:text-zen-text">{applicant.address}</p>
                    </div>
                </div>

                {/* ================= COLUMN 2: Submitted document images ================= */}
                <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card lg:col-span-1">
                    <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                        <ScanFace size={13} />
                        Submitted documents
                    </p>
                    {/* Maps over applicant.documents — this is where "front picture,
              back picture and everything" comes from. Add/remove entries
              in the `documents` array on each mock object (or from your
              API response) to control how many image cards show here. */}
                    <div className="flex flex-col gap-4">
                        {applicant.documents.map((doc) => (
                            <div
                                key={doc.label}
                                className="overflow-hidden rounded-xl border border-zen-light-border dark:border-zen-border"
                            >
                                <div className="relative">
                                    <img
                                        src={doc.img}
                                        alt={doc.label}
                                        className="h-40 w-full object-cover"
                                    />
                                    {/* Zoom button is visual only right now — hook this up to
                      a lightbox/modal if you want click-to-enlarge later */}
                                    <button className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-black/50 text-white hover:bg-black/70">
                                        <ZoomIn size={14} />
                                    </button>
                                </div>
                                <p className="bg-zen-light-bg px-3 py-2 text-xs font-medium text-zen-light-muted dark:bg-zen-bg dark:text-zen-muted">
                                    {doc.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================= COLUMN 3: Automated checks + decision ================= */}
                <div className="flex flex-col gap-5 lg:col-span-1">
                    {/* Automated checks panel */}
                    <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card">
                        <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            <Fingerprint size={13} />
                            Automated checks
                        </p>
                        <div className="flex flex-col gap-3">
                            {applicant.checks.map((c) => (
                                <div key={c.label} className="flex items-start gap-2.5">
                                    <CheckStatusIcon status={c.status} />
                                    <div>
                                        <p className="text-sm text-zen-light-text dark:text-zen-text">{c.label}</p>
                                        <p className="text-xs text-zen-light-muted dark:text-zen-muted">{c.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviewer note + decision buttons panel */}
                    <div className="rounded-2xl border border-zen-light-border bg-zen-light-card p-5 shadow-sm dark:border-zen-border dark:bg-zen-card">
                        <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zen-light-muted dark:text-zen-muted">
                            <User size={13} />
                            Reviewer note
                        </p>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add a note for the record (optional)"
                            rows={3}
                            className="w-full resize-none rounded-lg border border-zen-light-border bg-zen-light-bg p-3 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                        />

                        {/* These 3 buttons are NOT wired to any logic yet.
                When you add real approve/reject handlers, this is where
                you'd call your API, e.g.:
                  onClick={() => approveKyc(applicant.id, note)}
                and then probably call onBack() afterward to return to
                the list, plus update `kycSubmissions` (or refetch) so
                the badge reflects the new status. */}
                        <div className="mt-4 flex flex-col gap-2">
                            <button className="flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700">
                                <ShieldCheck size={16} />
                                Approve verification
                            </button>
                            <button className="flex items-center justify-center gap-2 rounded-lg border border-red-500 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <XCircle size={16} />
                                Reject
                            </button>
                            <button className="flex items-center justify-center gap-2 rounded-lg border border-zen-light-border py-2.5 text-sm font-medium text-zen-light-muted hover:bg-zen-light-bg dark:border-zen-border dark:text-zen-muted dark:hover:bg-zen-bg/60">
                                <Flag size={16} />
                                Flag for more info
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ========================================================================
 * 6. MAIN EXPORTED COMPONENT
 * ------------------------------------------------------------------------
 * This is what you import elsewhere, e.g.:
 *   import { KycVerification } from "./KycVerification";
 *   ...
 *   <Route path="kyc" element={<KycVerification />} />
 *
 * Responsibilities:
 *   - Owns the `selected` state that decides list vs detail view
 *   - Renders the page header (title + subtitle, subtitle text changes
 *     depending on whether you're viewing the list or a detail screen)
 *   - Renders the stats cards ONLY when no applicant is selected
 *     (kept out of the detail view to reduce clutter / scroll length)
 *   - Delegates the actual list/detail rendering to KycList / KycDetail
 * ==================================================================== */
export const KycVerification = () => {
    // null = show list. An applicant object = show that applicant's detail.
    const [selected, setSelected] = useState(null);

    return (
        <div className="min-h-screen w-full bg-zen-light-bg p-6 dark:bg-zen-bg">
            {/* --- Page header --- */}
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-zen-light-text dark:text-zen-text">
                        KYC Verification
                    </h1>
                    <p className="mt-1 text-sm text-zen-light-muted dark:text-zen-muted">
                        {selected
                            ? "Reviewing identity documents"
                            : "Review and take action on all pending users"}
                    </p>
                </div>
            </div>

            {/* --- Stats cards: only shown on the list view --- */}
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
                                    <p className="text-sm text-zen-light-muted dark:text-zen-muted">
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
            )}

            {/* --- List / Detail switch --- */}
            {selected ? (
                <KycDetail applicant={selected} onBack={() => setSelected(null)} />
            ) : (
                <KycList submissions={kycSubmissions} onSelect={setSelected} />
            )}
        </div>
    );
};