import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Download, Search, ArrowLeft, ChevronRight, Pencil, Trash2, Plus, Check, X } from "lucide-react";
import Sidebar from "../../components/sidebar";
import Topbar from "../../components/topbar";

const stats = [
  { label: "TOTAL RECORDS",    value: "7",    color: "text-gray-900" },
  { label: "PENDING APPROVAL", value: "1",    color: "text-gray-900" },
  { label: "AWAITING PO",      value: "1",    color: "text-blue-700" },
  { label: "IN TRANSIT",       value: "18",   color: "text-green-700" },
  { label: "TOTAL PR VALUE",   value: "₱12M", color: "text-gray-900" },
];

type StatusType = "Approved" | "Pending" | "Rejected" | "Ordered" | "Delivered" | "Liquidated" | "In Transit";

const statusStyles: Record<StatusType, string> = {
  Approved:     "bg-green-50 text-green-700 border-green-300",
  Pending:      "bg-orange-50 text-orange-600 border-orange-300",
  Rejected:     "bg-red-50 text-red-600 border-red-300",
  Ordered:      "bg-cyan-50 text-cyan-700 border-cyan-300",
  Delivered:    "bg-teal-50 text-teal-700 border-teal-300",
  Liquidated:   "bg-purple-50 text-purple-700 border-purple-300",
  "In Transit": "bg-blue-50 text-blue-700 border-blue-300",
};

const statusDot: Record<StatusType, string> = {
  Approved:     "bg-green-500",
  Pending:      "bg-orange-500",
  Rejected:     "bg-red-500",
  Ordered:      "bg-cyan-500",
  Delivered:    "bg-teal-500",
  Liquidated:   "bg-purple-500",
  "In Transit": "bg-blue-500",
};

const lineItemsByPR: Record<string, { description: string; brand: string; size: string; color: string; qty: string; unitPrice: number; total: number; supplier: string; notes: string }[]> = {
  "PR-2026-041": [
    { description: "Cement (45kg)",     brand: "Holcim",          size: "45kg",       color: "Brown", qty: "2 bags",   unitPrice: 2100,  total: 4200,  supplier: "Holcim Philippines",  notes: "N/A" },
    { description: "Paint (1L, White)", brand: "Boysen",          size: "1L",         color: "White", qty: "5 cans",   unitPrice: 2500,  total: 12500, supplier: "Boysen Paints",       notes: "N/A" },
    { description: "Roofing Sheets",    brand: "Puyat Steel",     size: "0.5mm 8ft",  color: "Brown", qty: "10 pcs",   unitPrice: 3180,  total: 31800, supplier: "Puyat Steel Corp.",   notes: "N/A" },
  ],
  "PR-2026-042": [
    { description: "Steel Bars 10mm",   brand: "Pag-asa",         size: "10mm",       color: "Gray",  qty: "20 pcs",   unitPrice: 3200,  total: 64000, supplier: "Pag-asa Steel",       notes: "N/A" },
    { description: "GI Wire",           brand: "Generic",         size: "16G",        color: "Silver",qty: "5 rolls",  unitPrice: 1800,  total: 9000,  supplier: "ACE Hardware",        notes: "N/A" },
    { description: "Hollow Blocks",     brand: "Local",           size: "4in",        color: "Gray",  qty: "100 pcs",  unitPrice: 12,    total: 1200,  supplier: "Local Supplier",      notes: "N/A" },
    { description: "Gravel",            brand: "N/A",             size: "3/4in",      color: "Gray",  qty: "2 cu.m.", unitPrice: 1800,  total: 3600,  supplier: "Batching Plant",      notes: "N/A" },
    { description: "Sand",              brand: "N/A",             size: "Fine",       color: "Tan",   qty: "2 cu.m.", unitPrice: 1400,  total: 2800,  supplier: "Batching Plant",      notes: "N/A" },
  ],
  "PR-2026-043": [
    { description: "Floor Tiles",       brand: "American Standard",size: "60x60cm",  color: "Cream", qty: "20 boxes", unitPrice: 850,   total: 17000, supplier: "Tile Center",         notes: "N/A" },
    { description: "Tile Adhesive",     brand: "Laticrete",       size: "25kg",       color: "White", qty: "4 bags",   unitPrice: 1000,  total: 4000,  supplier: "Tile Center",         notes: "N/A" },
  ],
  "PR-2026-040": [
    { description: "PVC Pipes 4in",     brand: "Neltex",          size: "4in x 6ft",  color: "White", qty: "30 pcs",   unitPrice: 320,   total: 9600,  supplier: "Neltex Depot",        notes: "N/A" },
    { description: "Electrical Wire",   brand: "Phelps Dodge",    size: "3.5mm",      color: "Black", qty: "100m",     unitPrice: 55,    total: 5500,  supplier: "Meralco Dealer",      notes: "N/A" },
    { description: "Circuit Breaker",   brand: "Schneider",       size: "20A",        color: "White", qty: "5 pcs",    unitPrice: 1200,  total: 6000,  supplier: "Schneider PH",        notes: "N/A" },
    { description: "Paint (Exterior)",  brand: "Davies",          size: "4L",         color: "White", qty: "10 cans",  unitPrice: 3200,  total: 32000, supplier: "Davies Paint",        notes: "N/A" },
    { description: "Plywood 1/2in",     brand: "Triwood",         size: "4x8ft",      color: "Brown", qty: "20 sheets",unitPrice: 850,   total: 17000, supplier: "Triwood",             notes: "N/A" },
    { description: "Nails Assorted",    brand: "Generic",         size: "Assorted",   color: "Silver",qty: "5 kg",     unitPrice: 280,   total: 1400,  supplier: "Hardware Store",      notes: "N/A" },
    { description: "Gravel",            brand: "N/A",             size: "3/4in",      color: "Gray",  qty: "5 cu.m.", unitPrice: 1800,  total: 9000,  supplier: "Batching Plant",      notes: "N/A" },
    { description: "Sand",              brand: "N/A",             size: "Fine",       color: "Tan",   qty: "5 cu.m.", unitPrice: 1400,  total: 7000,  supplier: "Batching Plant",      notes: "N/A" },
  ],
};

const defaultLineItems = [
  { description: "Materials", brand: "Various", size: "N/A", color: "N/A", qty: "1 lot", unitPrice: 0, total: 0, supplier: "Various Suppliers", notes: "N/A" },
];

const pipelineSteps = ["Draft", "OPs Review", "Approved", "PO Created", "Payment Sent", "Ordered", "In Transit", "Delivered", "Liquidated"];

function getPipelineIndex(status: StatusType): number {
  const map: Record<StatusType, number> = {
    Pending: 1, Approved: 2, Ordered: 5, "In Transit": 6, Delivered: 7, Liquidated: 8, Rejected: -1,
  };
  return map[status] ?? 0;
}

const prs = [
  { no: "PR-2026-041", project: "Makati Tower B",     requestedBy: "Juan Reyes",   items: 3, value: 48500,  neededDate: "March 1, 2026",  status: "Approved"    as StatusType, purpose: "Structural materials for floor 12–14", actions: ["View"] },
  { no: "PR-2026-042", project: "Quezon Warehouse",   requestedBy: "Maria Santos", items: 5, value: 92000,  neededDate: "March 1, 2026",  status: "Pending"     as StatusType, purpose: "Warehouse structural reinforcement",    actions: ["Approved", "Reject", "View & Edit"] },
  { no: "PR-2026-043", project: "BGC Office Fit-out", requestedBy: "Carlo Lim",    items: 2, value: 21000,  neededDate: "March 1, 2026",  status: "Approved"    as StatusType, purpose: "Office flooring installation",          actions: ["View"] },
  { no: "PR-2026-040", project: "Pasig Residential",  requestedBy: "Ana Cruz",     items: 8, value: 156800, neededDate: "March 1, 2026",  status: "Ordered"     as StatusType, purpose: "Residential fit-out materials",         actions: ["View"] },
  { no: "PR-2026-039", project: "Makati Tower B",     requestedBy: "Juan Reyes",   items: 4, value: 34200,  neededDate: "March 1, 2026",  status: "Rejected"    as StatusType, purpose: "Additional reinforcement materials",    actions: ["View"] },
  { no: "PR-2026-038", project: "Quezon Warehouse",   requestedBy: "Maria Santos", items: 6, value: 78400,  neededDate: "March 1, 2026",  status: "Delivered"   as StatusType, purpose: "Roofing and cladding supplies",         actions: ["View"] },
  { no: "PR-2026-037", project: "BGC Office Fit-out", requestedBy: "Carlo Lim",    items: 1, value: 8600,   neededDate: "March 1, 2026",  status: "Liquidated"  as StatusType, purpose: "Miscellaneous finishing materials",     actions: ["View"] },
  { no: "PR-2026-036", project: "BGC Office Fit-out", requestedBy: "Carlo Lim",    items: 1, value: 8600,   neededDate: "March 1, 2026",  status: "In Transit"  as StatusType, purpose: "Ceiling and partition supplies",         actions: ["View"] },
];

const actionStyles: Record<string, string> = {
  "View":        "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50",
  "Approved":    "bg-green-50 border border-green-500 text-green-700 hover:bg-green-100",
  "Reject":      "bg-red-50 border border-red-400 text-red-600 hover:bg-red-100",
  "View & Edit": "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50",
};

const kanbanColumns = [
  { status: "Pending"    as StatusType, label: "PENDING",    headerBg: "bg-orange-50",  headerText: "text-orange-600", border: "border-orange-300", cardAccent: "border-l-orange-400", dotColor: "bg-orange-500", badgeBg: "bg-orange-100",  badgeText: "text-orange-700" },
  { status: "Approved"   as StatusType, label: "APPROVED",   headerBg: "bg-green-50",   headerText: "text-green-700",  border: "border-green-300",  cardAccent: "border-l-green-500",  dotColor: "bg-green-600",  badgeBg: "bg-green-100",   badgeText: "text-green-800" },
  { status: "Ordered"    as StatusType, label: "ORDERED",    headerBg: "bg-cyan-50",    headerText: "text-cyan-700",   border: "border-cyan-300",   cardAccent: "border-l-cyan-500",   dotColor: "bg-cyan-600",   badgeBg: "bg-cyan-100",    badgeText: "text-cyan-800" },
  { status: "In Transit" as StatusType, label: "IN TRANSIT", headerBg: "bg-blue-50",    headerText: "text-blue-700",   border: "border-blue-300",   cardAccent: "border-l-blue-500",   dotColor: "bg-blue-600",   badgeBg: "bg-blue-100",    badgeText: "text-blue-800" },
  { status: "Delivered"  as StatusType, label: "DELIVERED",  headerBg: "bg-teal-50",    headerText: "text-teal-700",   border: "border-teal-300",   cardAccent: "border-l-teal-500",   dotColor: "bg-teal-600",   badgeBg: "bg-teal-100",    badgeText: "text-teal-800" },
  { status: "Rejected"   as StatusType, label: "REJECTED",   headerBg: "bg-red-50",     headerText: "text-red-700",    border: "border-red-300",    cardAccent: "border-l-red-500",    dotColor: "bg-red-600",    badgeBg: "bg-red-100",     badgeText: "text-red-800" },
  { status: "Liquidated" as StatusType, label: "LIQUIDATED", headerBg: "bg-purple-50",  headerText: "text-purple-700", border: "border-purple-300", cardAccent: "border-l-purple-500", dotColor: "bg-purple-600", badgeBg: "bg-purple-100",  badgeText: "text-purple-800" },
];

type LineItem = { description: string; brand: string; size: string; color: string; qty: string; unitPrice: number; total: number; supplier: string; notes: string };
type PRType = typeof prs[0];

// ── Shared Approve Modal ─────────────────────────────────────────
function ApproveModal({ pr, onClose }: { pr: PRType; onClose: () => void }) {
  const [comment, setComment] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 px-8 py-8 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl border-2 border-green-300 bg-green-50 flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="text-2xl font-black text-green-800 tracking-tight mb-1">APPROVE REQUEST</h2>
        <p className="text-sm text-gray-400 mb-5 text-center">
          Approve <span className="font-bold text-gray-700">{pr.no}</span> for {pr.project}?<br />
          Value: <span className="font-bold text-gray-700">₱{pr.value.toLocaleString("en-PH")}</span>
        </p>
        <div className="w-full mb-5">
          <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5 block">Comments (Optional)</label>
          <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 resize-none" />
        </div>
        <div className="flex items-center gap-3 w-full">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors">Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ── Shared Reject Modal ──────────────────────────────────────────
function RejectModal({ pr, onClose }: { pr: PRType; onClose: () => void }) {
  const [reason, setReason]   = useState("");
  const [comment, setComment] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 px-8 py-8">
        <h2 className="text-2xl font-black text-red-800 tracking-tight mb-4 text-center">REJECT REQUEST</h2>
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs font-semibold text-red-700">The request will be sent back to the site engineer.</p>
        </div>
        <div className="mb-4">
          <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5 block">
            Reason for Rejection <span className="text-red-500">*</span>
          </label>
          <select value={reason} onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 cursor-pointer appearance-none">
            <option value="">Select Reason...</option>
            <option value="incomplete">Incomplete Information</option>
            <option value="over-budget">Over Budget</option>
            <option value="wrong-specs">Wrong Specifications</option>
            <option value="duplicate">Duplicate Request</option>
            <option value="not-approved">Not Approved by PM</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5 block">Comments / Instructions for Engineer</label>
          <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="Provide clear instructions on whats need to be changed or why this being rejected..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 resize-none" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onClose} disabled={!reason}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold bg-red-700 hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors">
            Reject & Notify Engineer
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PR Detail Page ───────────────────────────────────────────────
function PRDetailPage({ pr, onBack }: { pr: PRType; onBack: () => void }) {
  const initialLineItems = lineItemsByPR[pr.no] ?? defaultLineItems;
  const pipelineIdx = getPipelineIndex(pr.status);

  const [isEditing, setIsEditing] = useState(false);
  const [editProject, setEditProject]     = useState(pr.project);
  const [editRequested, setEditRequested] = useState(pr.requestedBy);
  const [editDate, setEditDate]           = useState(pr.neededDate);
  const [editPurpose, setEditPurpose]     = useState(pr.purpose);
  const [editItems, setEditItems]         = useState<LineItem[]>(initialLineItems.map((i) => ({ ...i })));

  const [savedProject, setSavedProject]     = useState(pr.project);
  const [savedRequested, setSavedRequested] = useState(pr.requestedBy);
  const [savedDate, setSavedDate]           = useState(pr.neededDate);
  const [savedPurpose, setSavedPurpose]     = useState(pr.purpose);
  const [savedItems, setSavedItems]         = useState<LineItem[]>(initialLineItems.map((i) => ({ ...i })));

  const [showApprove, setShowApprove] = useState(false);
  const [showReject,  setShowReject]  = useState(false);

  const recalc = (items: LineItem[]) =>
    items.map((it) => ({ ...it, total: it.unitPrice * parseFloat(it.qty) || it.unitPrice }));

  const handleItemChange = (idx: number, field: keyof LineItem, val: string) => {
    setEditItems((prev) => {
      const next = prev.map((it, i) => i === idx ? { ...it, [field]: field === "unitPrice" ? parseFloat(val) || 0 : val } : it);
      return recalc(next);
    });
  };

  const addRow = () => setEditItems((prev) => [
    ...prev,
    { description: "", brand: "", size: "", color: "", qty: "1", unitPrice: 0, total: 0, supplier: "", notes: "" },
  ]);

  const removeRow = (idx: number) => setEditItems((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = () => {
    setSavedProject(editProject); setSavedRequested(editRequested);
    setSavedDate(editDate); setSavedPurpose(editPurpose);
    setSavedItems(editItems.map((i) => ({ ...i })));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditProject(savedProject); setEditRequested(savedRequested);
    setEditDate(savedDate); setEditPurpose(savedPurpose);
    setEditItems(savedItems.map((i) => ({ ...i })));
    setIsEditing(false);
  };

  const displayItems = isEditing ? editItems : savedItems;
  const total = displayItems.reduce((sum, i) => sum + i.total, 0);

  const inputCls = "w-full border border-orange-200 rounded-md px-2 py-1 text-xs text-gray-800 bg-orange-50/40 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 placeholder-gray-300";
  const cellInputCls = "w-full border border-orange-200 rounded px-1.5 py-1 text-[11px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-orange-400";

  return (
    <main className="flex-1 overflow-y-auto px-8 py-6">
      {showApprove && <ApproveModal pr={pr} onClose={() => setShowApprove(false)} />}
      {showReject  && <RejectModal  pr={pr} onClose={() => setShowReject(false)}  />}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-orange-500 transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
        <ChevronRight size={13} className="text-gray-300" />
        <span className="text-xs text-gray-400">Purchase Requests</span>
        <ChevronRight size={13} className="text-gray-300" />
        <span className="text-xs font-bold text-orange-500">{pr.no}</span>
        {isEditing && (<><ChevronRight size={13} className="text-gray-300" /><span className="text-xs font-bold text-blue-500">Editing</span></>)}
      </div>

      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {isEditing ? <>EDIT PURCHASE <span className="text-blue-500">REQUEST</span></> : <>VIEW PURCHASE <span className="text-orange-500">REQUEST</span></>}
            </h1>
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border ${statusStyles[pr.status]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot[pr.status]}`}></span>
              {pr.status}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {isEditing ? editProject : savedProject} · Requested by {isEditing ? editRequested : savedRequested}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && pr.status === "Pending" && (
            <>
              <button onClick={() => setShowApprove(true)} className="px-4 py-2 text-xs font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">Approve</button>
              <button onClick={() => setShowReject(true)}  className="px-4 py-2 text-xs font-bold bg-red-50 border border-red-400 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Reject</button>
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                <Pencil size={13} /> Edit
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5">
          <Pencil size={13} className="text-blue-500 shrink-0" />
          <p className="text-xs text-blue-700 font-medium">You are in edit mode. Make your changes below, then click <strong>Save Changes</strong> to apply.</p>
        </div>
      )}

      <div className="space-y-5">
        {/* Procurement Pipeline */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-5">Procurement Pipeline</p>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" style={{ margin: "0 20px" }} />
            {pipelineSteps.map((step, idx) => {
              const done = pipelineIdx > idx;
              const active = pipelineIdx === idx;
              const rejected = pr.status === "Rejected" && idx === 1;
              return (
                <div key={step} className="flex flex-col items-center z-10 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    rejected ? "bg-red-500 border-red-500 text-white" :
                    active   ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200" :
                    done     ? "bg-green-500 border-green-500 text-white" :
                               "bg-white border-gray-200 text-gray-300"
                  }`}>
                    {rejected ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    ) : done || active ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <span className="text-[9px] font-bold text-gray-300">{idx + 1}</span>
                    )}
                  </div>
                  <p className={`text-[9px] font-bold mt-1.5 text-center leading-tight ${
                    rejected ? "text-red-500" : active ? "text-orange-500" : done ? "text-green-600" : "text-gray-300"
                  }`}>{step}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Grid */}
        <div className={`bg-white rounded-xl border shadow-sm p-5 transition-colors ${isEditing ? "border-blue-200" : "border-gray-200"}`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Request Details</p>
            {isEditing && <span className="text-[9px] font-bold text-blue-400 tracking-widest uppercase">Editable</span>}
          </div>
          <div className="grid grid-cols-6 gap-6">
            <div>
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1">PR Number</p>
              <p className="text-sm font-black text-gray-800">{pr.no}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1">Project</p>
              {isEditing ? <input value={editProject} onChange={(e) => setEditProject(e.target.value)} className={inputCls} /> : <p className="text-sm font-black text-gray-800">{savedProject}</p>}
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1">Requested By</p>
              {isEditing ? <input value={editRequested} onChange={(e) => setEditRequested(e.target.value)} className={inputCls} /> : <p className="text-sm font-black text-gray-800">{savedRequested}</p>}
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1">Date Needed</p>
              {isEditing ? <input value={editDate} onChange={(e) => setEditDate(e.target.value)} className={inputCls} placeholder="e.g. March 1, 2026" /> : <p className="text-sm font-black text-gray-800">{savedDate}</p>}
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1">Total Items</p>
              <p className="text-sm font-black text-gray-800">{displayItems.length} items</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1">Estimated Value</p>
              <p className="text-sm font-black text-orange-500">₱{total.toLocaleString("en-PH")}</p>
            </div>
          </div>
        </div>

        {/* Purpose */}
        {isEditing ? (
          <div className="bg-white border border-blue-200 rounded-xl px-5 py-4">
            <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-2">Purpose / Notes</p>
            <textarea value={editPurpose} onChange={(e) => setEditPurpose(e.target.value)} rows={2}
              className="w-full border border-orange-200 rounded-md px-3 py-2 text-xs text-gray-800 bg-orange-50/40 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 resize-none" />
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
            <span className="text-xs font-bold text-blue-600">Purpose / Notes: </span>
            <span className="text-xs text-blue-700">{savedPurpose}</span>
          </div>
        )}

        {/* Line Items */}
        <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-colors ${isEditing ? "border-blue-200" : "border-gray-200"}`}>
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase">Line Items</p>
            {isEditing && (
              <button onClick={addRow} className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                <Plus size={11} /> Add Row
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`text-white ${isEditing ? "bg-blue-500" : "bg-blue-600"}`}>
                  {["DESCRIPTION", "BRAND", "SIZE/SPEC", "COLOR", "QTY", "UNIT PRICE", "TOTAL", "SUPPLIER", "NOTES", ...(isEditing ? [""] : [])].map((h) => (
                    <th key={h} className="text-left px-3 py-2.5 text-[9px] font-bold tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayItems.map((item, i) => (
                  <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    {isEditing ? (
                      <>
                        <td className="px-2 py-2"><input value={item.description} onChange={(e) => handleItemChange(i, "description", e.target.value)} className={cellInputCls} /></td>
                        <td className="px-2 py-2"><input value={item.brand}       onChange={(e) => handleItemChange(i, "brand",       e.target.value)} className={cellInputCls} /></td>
                        <td className="px-2 py-2"><input value={item.size}        onChange={(e) => handleItemChange(i, "size",        e.target.value)} className={cellInputCls} /></td>
                        <td className="px-2 py-2"><input value={item.color}       onChange={(e) => handleItemChange(i, "color",       e.target.value)} className={cellInputCls} /></td>
                        <td className="px-2 py-2"><input value={item.qty}         onChange={(e) => handleItemChange(i, "qty",         e.target.value)} className={cellInputCls} /></td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-0.5">
                            <span className="text-[10px] text-gray-400">₱</span>
                            <input type="number" min="0" value={item.unitPrice} onChange={(e) => handleItemChange(i, "unitPrice", e.target.value)} className={cellInputCls + " w-20"} />
                          </div>
                        </td>
                        <td className="px-3 py-2 font-bold text-orange-500 whitespace-nowrap">₱{item.total.toLocaleString("en-PH")}</td>
                        <td className="px-2 py-2"><input value={item.supplier} onChange={(e) => handleItemChange(i, "supplier", e.target.value)} className={cellInputCls} /></td>
                        <td className="px-2 py-2"><input value={item.notes}    onChange={(e) => handleItemChange(i, "notes",    e.target.value)} className={cellInputCls} /></td>
                        <td className="px-2 py-2">
                          <button onClick={() => removeRow(i)} className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium text-gray-800">{item.description}</td>
                        <td className="px-4 py-3 text-gray-600">{item.brand}</td>
                        <td className="px-4 py-3 text-gray-600">{item.size}</td>
                        <td className="px-4 py-3 text-gray-600">{item.color}</td>
                        <td className="px-4 py-3 text-gray-600">{item.qty}</td>
                        <td className="px-4 py-3 text-gray-600">₱{item.unitPrice.toLocaleString("en-PH")}</td>
                        <td className="px-4 py-3 font-bold text-orange-500">₱{item.total.toLocaleString("en-PH")}</td>
                        <td className="px-4 py-3 text-gray-600">{item.supplier}</td>
                        <td className="px-4 py-3 text-gray-400">{item.notes}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-t border-gray-200">
            {isEditing && <p className="text-[10px] text-gray-400">Total auto-calculated from unit price × qty</p>}
            <p className="text-sm font-black text-gray-700 ml-auto">
              Total Estimated Value: <span className="text-orange-500">₱{total.toLocaleString("en-PH")}</span>
            </p>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 pt-2 pb-4">
            <button onClick={handleCancel} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors">
              <X size={13} /> Cancel
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors">
              <Check size={13} /> Save Changes
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function PurchaseRequests() {
  const [view, setView] = useState<"Table" | "Kanban">("Table");
  const [search, setSearch] = useState("");
  const location = useLocation();
  const [statusFilter, setStatusFilter] = useState(location.state?.statusFilter ?? "All Statuses");  const [supplierFilter, setSupplierFilter] = useState("All Suppliers");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [selectedPR, setSelectedPR] = useState<PRType | null>(null);

  // list-level modal state
  const [approveTarget, setApproveTarget] = useState<PRType | null>(null);
  const [rejectTarget,  setRejectTarget]  = useState<PRType | null>(null);


// Add this useEffect after the state declarations
useEffect(() => {
  const { action, prNo } = location.state ?? {};
  if (!action || !prNo) return;

  const match = prs.find((p) => p.no === prNo);
  if (!match) return;

  if (action === "approve") setApproveTarget(match);
  else if (action === "reject") setRejectTarget(match);
  else if (action === "view") setSelectedPR(match);
}, []);


  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    return () => { document.head.removeChild(link); };
  }, []);

  const filtered = prs.filter((pr) => {
    const matchSearch = search === "" ||
      pr.no.toLowerCase().includes(search.toLowerCase()) ||
      pr.project.toLowerCase().includes(search.toLowerCase()) ||
      pr.requestedBy.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Statuses" || pr.status === statusFilter;
    const matchProject = projectFilter === "All Projects" || pr.project === projectFilter;
    return matchSearch && matchStatus && matchProject;
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* List-level modals rendered at root so they cover everything */}
      {approveTarget && <ApproveModal pr={approveTarget} onClose={() => setApproveTarget(null)} />}
      {rejectTarget  && <RejectModal  pr={rejectTarget}  onClose={() => setRejectTarget(null)}  />}

      <Sidebar activeNav="Purchase Requests" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar page={selectedPR ? "PURCHASE REQUEST DETAIL" : "PURCHASE REQUEST"} />

        {selectedPR ? (
          <PRDetailPage pr={selectedPR} onBack={() => setSelectedPR(null)} />
        ) : (
          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                PURCHASE <span className="text-orange-500">REQUESTS</span>
              </h1>
              <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <Download size={15} /> Export
              </button>
            </div>
            <p className="text-gray-400 text-xs mb-5">1 pending review · 7 total this month</p>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              {stats.map((s) => (
                <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3.5 shadow-sm">
                  <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

              {/* Toolbar */}
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 flex-wrap">
                <div className="flex items-center bg-gray-100 rounded-lg p-0.5 shrink-0">
                  {(["Table", "Kanban"] as const).map((v) => (
                    <button key={v} onClick={() => setView(v)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${view === v ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                      {v === "Table" ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                      )}
                      {v}
                    </button>
                  ))}
                </div>
                <div className="relative flex-1 min-w-[180px]">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search ID, Project, Supplier..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300" />
                </div>
                {[
                  { value: statusFilter,   setter: setStatusFilter,   options: ["All Statuses", "Approved", "Pending", "Rejected", "Ordered", "In Transit", "Delivered", "Liquidated"] },
                  { value: supplierFilter, setter: setSupplierFilter, options: ["All Suppliers"] },
                  { value: projectFilter,  setter: setProjectFilter,  options: ["All Projects", "Makati Tower B", "Quezon Warehouse", "BGC Office Fit-out", "Pasig Residential"] },
                ].map((f, i) => (
                  <select key={i} value={f.value} onChange={(e) => f.setter(e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 cursor-pointer">
                    {f.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ))}
              </div>

              {/* ── TABLE VIEW ── */}
              {view === "Table" && (
                <>
                  <div className="px-5 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-800">All Purchase Requests</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm table-fixed">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          {[
                            { label: "PR NO.",       w: "w-[11%]" },
                            { label: "PROJECT",      w: "w-[15%]" },
                            { label: "REQUESTED BY", w: "w-[13%]" },
                            { label: "ITEMS",        w: "w-[9%]"  },
                            { label: "EST. VALUE",   w: "w-[10%]" },
                            { label: "NEEDED DATE",  w: "w-[13%]" },
                            { label: "STATUS",       w: "w-[11%]" },
                            { label: "ACTION",       w: "w-[18%]" },
                          ].map((col) => (
                            <th key={col.label} className={`text-left px-4 py-3 text-[9px] font-bold text-gray-400 tracking-widest uppercase ${col.w}`}>{col.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((pr, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-orange-50/20 transition-colors">
                            <td className="px-4 py-3"><span className="text-orange-500 font-bold text-xs">{pr.no}</span></td>
                            <td className="px-4 py-3 text-gray-700 font-medium text-xs">{pr.project}</td>
                            <td className="px-4 py-3 text-gray-600 text-xs">{pr.requestedBy}</td>
                            <td className="px-4 py-3 text-gray-600 text-xs">{pr.items} Items</td>
                            <td className="px-4 py-3"><span className="text-orange-500 font-bold text-xs">₱{pr.value.toLocaleString("en-PH")}</span></td>
                            <td className="px-4 py-3 text-gray-600 text-xs">{pr.neededDate}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyles[pr.status]}`}>
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot[pr.status]}`}></span>
                                {pr.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                {pr.actions.map((action) => (
                                  <button key={action}
                                    onClick={() => {
                                      if (action === "View" || action === "View & Edit") setSelectedPR(pr);
                                      else if (action === "Approved") setApproveTarget(pr);
                                      else if (action === "Reject")   setRejectTarget(pr);
                                    }}
                                    className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-colors whitespace-nowrap ${actionStyles[action] ?? "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                                    {action}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filtered.length === 0 && (
                          <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">No purchase requests found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* ── KANBAN VIEW ── */}
              {view === "Kanban" && (
                <div className="p-5 overflow-x-auto">
                  <div className="flex gap-4 items-start" style={{ minWidth: "1600px" }}>
                    {kanbanColumns.map((col) => {
                      const cards = filtered.filter((pr) => pr.status === col.status);
                      return (
                        <div key={col.status}
                          className={`flex flex-col rounded-2xl border-2 ${col.border} ${col.headerBg} overflow-hidden self-start`}
                          style={{ minWidth: "210px", flex: "1" }}>
                          <div className="px-3 pt-3 pb-2">
                            <div className={`flex items-center justify-between px-3 py-2 rounded-full ${col.badgeBg}`}>
                              <span className={`text-[11px] font-black tracking-widest ${col.headerText}`}>{col.label}</span>
                              <span className={`text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center bg-white ${col.headerText}`}>{cards.length}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 p-3 flex-1">
                            {cards.length === 0 ? (
                              <div className="flex items-center justify-center py-6">
                                <p className="text-[10px] text-gray-300 font-medium">No items</p>
                              </div>
                            ) : (
                              cards.map((pr, i) => (
                                <div key={i} onClick={() => setSelectedPR(pr)}
                                  className={`w-full bg-white rounded-xl border border-gray-100 border-l-[3px] ${col.cardAccent} p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
                                  <p className={`text-[11px] font-black mb-1.5 ${col.headerText}`}>{pr.no}</p>
                                  <p className="text-sm font-bold text-gray-900 leading-tight mb-1">{pr.project}</p>
                                  <p className="text-[11px] text-gray-400 mb-4">{pr.requestedBy}</p>
                                  <div className="flex items-center justify-between w-full">
                                    <span className={`text-sm font-black ${col.headerText}`}>₱{pr.value.toLocaleString("en-PH")}</span>
                                    <span className="text-[11px] text-gray-400">March 1</span>
                                  </div>
                                  {pr.status === "Pending" && (
                                    <div className="flex gap-2 mt-3 w-full">
                                      <button onClick={(e) => { e.stopPropagation(); setApproveTarget(pr); }}
                                        className="flex-1 flex items-center justify-center py-1.5 rounded-full bg-white border-2 border-green-400 text-green-600 hover:bg-green-50 transition-colors">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); setRejectTarget(pr); }}
                                        className="flex-1 flex items-center justify-center py-1.5 rounded-full bg-white border-2 border-red-400 text-red-500 hover:bg-red-50 transition-colors">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}