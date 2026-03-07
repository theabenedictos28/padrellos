import { useEffect, useState } from "react";
import {
  AlertTriangle, CheckSquare, X, Check, Eye, Bell,
  Flag, Package, Calendar, User, Clock,
  Send, MessageSquare, Phone, Mail, FileWarning,
} from "lucide-react";
import Sidebar from "../../components/sidebar";
import Topbar from "../../components/topbar";

type ItemStatus = "ok" | "missing" | "partial";
type ChecklistItem = {
  description: string;
  qty: string;
  received?: string;
  status: ItemStatus;
};
type DeliveryReport = {
  id: string;
  po: string;
  supplier: string;
  supplierContact: string;
  supplierEmail: string;
  items: string;
  submittedBy: string;
  submittedAt: string;
  checklist: ChecklistItem[];
  flagged: boolean;
  warningNote: string;
  project: string;
};

const reports: DeliveryReport[] = [
  {
    id: "DEL-090",
    po: "PO-202",
    supplier: "Boysen Paints",
    supplierContact: "+63 2 8888 2345",
    supplierEmail: "orders@boysen.com.ph",
    items: "Paint × 10 cans",
    submittedBy: "Juan Reyes",
    submittedAt: "Dec 6, 2024 09:15",
    flagged: true,
    project: "BGC Office Fit-out",
    warningNote: "1 item not received. Contact Boysen to arrange re-delivery or credit note.",
    checklist: [
      { description: "Paint Boysen White 1L × 5 cans",    qty: "5 cans",  received: "5 cans",  status: "ok"      },
      { description: "Paint Boysen Exterior 4L × 5 cans", qty: "5 cans",  received: "0",       status: "missing" },
      { description: "Primer White Sheen 1L × 3",         qty: "3 cans",  received: "3 cans",  status: "ok"      },
    ],
  },
  {
    id: "DEL-091",
    po: "PO-201",
    supplier: "Holcim Philippines",
    supplierContact: "+63 2 8702 4000",
    supplierEmail: "delivery@holcim.ph",
    items: "Cement × 20 bags",
    submittedBy: "Maria Santos",
    submittedAt: "Dec 7, 2024 10:30",
    flagged: false,
    project: "Makati Tower B",
    warningNote: "",
    checklist: [
      { description: "Cement 45kg bag × 20",  qty: "20 bags", received: "20 bags", status: "ok" },
      { description: "Delivery receipt copy",  qty: "1 pc",   received: "1 pc",    status: "ok" },
    ],
  },
  {
    id: "DEL-092",
    po: "PO-203",
    supplier: "Puyat Steel Corp.",
    supplierContact: "+63 2 8251 9000",
    supplierEmail: "sales@puyatsteel.com",
    items: "Roofing × 10 sheets",
    submittedBy: "Carlo Lim",
    submittedAt: "Dec 8, 2024 14:00",
    flagged: false,
    project: "Quezon Warehouse",
    warningNote: "",
    checklist: [
      { description: "Roofing Sheet 0.5mm 8ft × 10", qty: "10 pcs", received: "10 pcs", status: "ok" },
    ],
  },
  {
    id: "DEL-093",
    po: "PO-204",
    supplier: "Pag-asa Steel",
    supplierContact: "+63 2 8711 1234",
    supplierEmail: "orders@pagasasteel.com",
    items: "Steel Bars × 20 pcs",
    submittedBy: "Juan Reyes",
    submittedAt: "Dec 9, 2024 08:45",
    flagged: true,
    project: "Makati Tower B",
    warningNote: "3 steel bars were delivered with visible rust damage. Reject and request replacement.",
    checklist: [
      { description: "Steel Bar 10mm × 17 pcs",         qty: "20 pcs", received: "17 pcs",           status: "partial" },
      { description: "Steel Bar 10mm (damaged) × 3",    qty: "0",      received: "3 pcs (rejected)",  status: "missing" },
    ],
  },
];

// ── Follow Up Modal ──────────────────────────────────────────────
function FollowUpModal({ report, onClose }: { report: DeliveryReport; onClose: () => void }) {
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High");
  const [assignTo, setAssignTo] = useState("Operations Team");
  const [dueDate, setDueDate]   = useState("");
  const [notes, setNotes]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const missingItems = report.checklist.filter((c) => c.status !== "ok");
  const handleSubmit = () => setSubmitted(true);

  if (submitted) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 px-8 py-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 border-2 border-orange-200 flex items-center justify-center mb-4">
          <Flag size={26} className="text-orange-500" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Follow-Up Created</h2>
        <p className="text-sm text-gray-400 mb-1"><span className="font-bold text-gray-700">{report.id}</span> has been flagged for follow-up.</p>
        <p className="text-xs text-gray-400 mb-6">Assigned to <span className="font-semibold text-gray-600">{assignTo}</span> · Priority: <span className={`font-bold ${priority === "High" ? "text-red-500" : priority === "Medium" ? "text-orange-500" : "text-green-600"}`}>{priority}</span></p>
        <button onClick={onClose} className="w-full py-2.5 text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors">Done</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-orange-500 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Flag size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">FLAG FOR FOLLOW UP</h2>
                <p className="text-xs text-orange-100">{report.id} · {report.supplier}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-[10px] font-bold text-red-400 tracking-widest uppercase mb-2">Issues Detected</p>
            <div className="space-y-1.5">
              {missingItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.status === "missing" ? "bg-red-500" : "bg-orange-400"}`}></span>
                  <p className="text-xs text-red-700 font-medium">{item.description}</p>
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.status === "missing" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                    {item.status === "missing" ? "MISSING" : "PARTIAL"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2 block">Priority Level</label>
            <div className="flex gap-2">
              {(["High", "Medium", "Low"] as const).map((p) => (
                <button key={p} onClick={() => setPriority(p)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                    priority === p
                      ? p === "High"   ? "bg-red-500 border-red-500 text-white"
                      : p === "Medium" ? "bg-orange-500 border-orange-500 text-white"
                                       : "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                  }`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5 block">Assign To</label>
              <select value={assignTo} onChange={(e) => setAssignTo(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 cursor-pointer">
                <option>Operations Team</option>
                <option>Procurement</option>
                <option>Site Engineer</option>
                <option>Project Manager</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5 block">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5 block">Follow-Up Notes</label>
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the follow-up action needed..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 resize-none" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 text-xs font-semibold border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors">
              <Flag size={12} /> Create Follow-Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Notify Supplier Modal ────────────────────────────────────────
function NotifySupplierModal({ report, onClose }: { report: DeliveryReport; onClose: () => void }) {
  const [channel, setChannel] = useState<"email" | "sms" | "call">("email");
  const [message, setMessage] = useState(
    `Dear ${report.supplier},\n\nThis is to inform you regarding delivery ${report.id} (PO: ${report.po}). The following items were not received as expected:\n\n${report.checklist.filter(c => c.status !== "ok").map(c => `• ${c.description}`).join("\n")}\n\nKindly arrange for re-delivery or issue a credit note at your earliest convenience.\n\nThank you.`
  );
  const [sent, setSent] = useState(false);

  if (sent) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 px-8 py-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center mb-4">
          <Send size={26} className="text-blue-500" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Notification Sent!</h2>
        <p className="text-sm text-gray-400 mb-1"><span className="font-bold text-gray-700">{report.supplier}</span> has been notified.</p>
        <p className="text-xs text-gray-400 mb-6">via <span className="font-semibold text-gray-600 capitalize">{channel}</span> · {new Date().toLocaleTimeString()}</p>
        <button onClick={onClose} className="w-full py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">Done</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-blue-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bell size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">NOTIFY SUPPLIER</h2>
                <p className="text-xs text-blue-200">{report.supplier}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-2.5">
              <Phone size={13} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                <p className="text-xs font-semibold text-gray-700">{report.supplierContact}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-2.5">
              <Mail size={13} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                <p className="text-xs font-semibold text-gray-700">{report.supplierEmail}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2 block">Notification Channel</label>
            <div className="flex gap-2">
              {([
                { key: "email", icon: Mail,          label: "Email"    },
                { key: "sms",   icon: MessageSquare,  label: "SMS"      },
                { key: "call",  icon: Phone,          label: "Call Log" },
              ] as const).map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => setChannel(key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                    channel === key ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                  }`}>
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 tracking-widests uppercase mb-1.5 block">
              {channel === "email" ? "Email Message" : channel === "sms" ? "SMS Message" : "Call Notes"}
            </label>
            <textarea rows={7} value={message} onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-none font-mono leading-relaxed" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 text-xs font-semibold border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={() => setSent(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
              <Send size={12} /> Send Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Item View Modal ──────────────────────────────────────────────
function ItemViewModal({ item, report, onClose }: { item: ChecklistItem; report: DeliveryReport; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-red-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <FileWarning size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">MISSING ITEM DETAIL</h2>
              <p className="text-xs text-red-200">{report.id} · {report.supplier}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"><X size={18} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
            <div>
              <p className="text-[9px] font-bold text-red-400 tracking-widest uppercase mb-0.5">Item Description</p>
              <p className="text-sm font-bold text-red-800">{item.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">Ordered</p>
                <p className="text-xs font-bold text-gray-700">{item.qty}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">Received</p>
                <p className="text-xs font-bold text-red-600">{item.received || "0"}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">Status</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === "missing" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                  {item.status === "missing" ? "NOT DELIVERED" : "PARTIAL"}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Recommended Actions</p>
            {["Contact supplier to arrange re-delivery", "Request credit note if re-delivery not possible", "Update PO status to reflect shortage", "Notify project manager of delay"].map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-xs text-gray-600">{a}</p>
              </div>
            ))}
          </div>
          <button onClick={onClose} className="w-full py-2.5 text-xs font-bold bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function DeliveryReports() {
  const [filterStatus, setFilterStatus] = useState<"all" | "flagged" | "ok">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showNotify, setShowNotify]     = useState(false);
  const [viewItem, setViewItem]         = useState<ChecklistItem | null>(null);

  const flaggedCount = reports.filter((r) => r.flagged).length;
  const okCount      = reports.filter((r) => !r.flagged).length;

  const filteredReports = reports.filter((r) => {
    if (filterStatus === "flagged") return r.flagged;
    if (filterStatus === "ok")      return !r.flagged;
    return true;
  });

  // Reset index to 0 whenever filter changes
  const handleFilter = (val: "all" | "flagged" | "ok") => {
    setFilterStatus(prev => prev === val ? "all" : val);
    setSelectedIndex(0);
  };

  const safeIndex = Math.min(selectedIndex, filteredReports.length - 1);
  const selected  = filteredReports[safeIndex] ?? reports[0];

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    return () => { document.head.removeChild(link); };
  }, []);

  const okItems    = selected.checklist.filter((c) => c.status === "ok").length;
  const totalItems = selected.checklist.length;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar activeNav="Delivery Reports" />

      {showFollowUp && <FollowUpModal report={selected} onClose={() => setShowFollowUp(false)} />}
      {showNotify   && <NotifySupplierModal report={selected} onClose={() => setShowNotify(false)} />}
      {viewItem     && <ItemViewModal item={viewItem} report={selected} onClose={() => setViewItem(null)} />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar page="DELIVERY REPORTS" />
        <main className="flex-1 overflow-y-auto px-8 py-6">

          {/* Header */}
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
            DELIVERY <span className="text-orange-500">REPORTS</span>
          </h1>
          <p className="text-gray-400 text-xs mb-6">Manage reports from site engineers</p>

          {/* Summary / Filter Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button onClick={() => handleFilter("flagged")}
              className={`rounded-xl px-6 py-5 flex items-center gap-5 border-2 transition-all text-left ${
                filterStatus === "flagged"
                  ? "bg-red-500 border-red-500 shadow-lg shadow-red-200"
                  : "bg-red-50 border-red-200 hover:border-red-300"
              }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${filterStatus === "flagged" ? "bg-white/20" : "bg-white border border-red-200"}`}>
                <AlertTriangle size={22} className={filterStatus === "flagged" ? "text-white" : "text-red-500"} />
              </div>
              <div>
                <p className={`text-[10px] font-bold tracking-widest uppercase mb-0.5 ${filterStatus === "flagged" ? "text-red-100" : "text-red-400"}`}>Flagged Reports</p>
                <p className={`text-4xl font-black ${filterStatus === "flagged" ? "text-white" : "text-red-600"}`}>{flaggedCount}</p>
              </div>
              {filterStatus === "flagged" && <span className="ml-auto text-white/70 text-xs font-semibold">Filtered</span>}
            </button>

            <button onClick={() => handleFilter("ok")}
              className={`rounded-xl px-6 py-5 flex items-center gap-5 border-2 transition-all text-left ${
                filterStatus === "ok"
                  ? "bg-green-500 border-green-500 shadow-lg shadow-green-200"
                  : "bg-green-50 border-green-200 hover:border-green-300"
              }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${filterStatus === "ok" ? "bg-white/20" : "bg-white border border-green-200"}`}>
                <CheckSquare size={22} className={filterStatus === "ok" ? "text-white" : "text-green-500"} />
              </div>
              <div>
                <p className={`text-[10px] font-bold tracking-widest uppercase mb-0.5 ${filterStatus === "ok" ? "text-green-100" : "text-green-500"}`}>All OK Reports</p>
                <p className={`text-4xl font-black ${filterStatus === "ok" ? "text-white" : "text-green-600"}`}>{okCount}</p>
              </div>
              {filterStatus === "ok" && <span className="ml-auto text-white/70 text-xs font-semibold">Filtered</span>}
            </button>
          </div>

          {/* Navigator row */}
          {filteredReports.length > 1 && (
            <div className="flex items-center gap-3 mb-4">
              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                Showing {safeIndex + 1} of {filteredReports.length} {filterStatus === "all" ? "reports" : filterStatus === "flagged" ? "flagged" : "OK reports"}
              </p>
              <div className="flex gap-1.5 ml-auto">
                <button
                  onClick={() => setSelectedIndex(i => Math.max(0, i - 1))}
                  disabled={safeIndex === 0}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  ← Prev
                </button>
                <button
                  onClick={() => setSelectedIndex(i => Math.min(filteredReports.length - 1, i + 1))}
                  disabled={safeIndex === filteredReports.length - 1}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  Next →
                </button>
              </div>
              {/* Dot indicators */}
              <div className="flex gap-1">
                {filteredReports.map((_, i) => (
                  <button key={i} onClick={() => setSelectedIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === safeIndex ? (selected.flagged ? "bg-red-500 w-4" : "bg-green-500 w-4") : "bg-gray-300 hover:bg-gray-400"}`} />
                ))}
              </div>
            </div>
          )}

          {/* ── Detail Box (full width) ── */}
          <div className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${selected.flagged ? "border-red-200" : "border-green-200"}`}>
            {/* Card header */}
            <div className={`px-6 py-4 border-b ${selected.flagged ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-black text-gray-900">{selected.id}</h3>
                    {selected.flagged ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">
                        <AlertTriangle size={9} /> Flagged
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full">
                        <Check size={9} /> All OK
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    {[
                      { icon: Package,  text: `PO: ${selected.po}`          },
                      { icon: User,     text: selected.supplier               },
                      { icon: Calendar, text: selected.submittedAt            },
                      { icon: User,     text: `By: ${selected.submittedBy}`  },
                    ].map(({ icon: Icon, text }, i) => (
                      <div key={i} className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Icon size={10} className="text-gray-400" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setShowFollowUp(true)}
                    className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl border-2 border-orange-300 text-orange-600 bg-white hover:bg-orange-50 transition-colors">
                    <Flag size={12} /> Flag for Follow Up
                  </button>
                  <button onClick={() => setShowNotify(true)}
                    className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl border-2 border-blue-300 text-blue-600 bg-white hover:bg-blue-50 transition-colors">
                    <Bell size={12} /> Notify Supplier
                  </button>
                </div>
              </div>
            </div>

            {/* Checklist body */}
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  Checklist — {okItems}/{totalItems} items OK
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${okItems === totalItems ? "bg-green-500" : "bg-orange-400"}`}
                      style={{ width: `${(okItems / totalItems) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">{Math.round((okItems / totalItems) * 100)}%</span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-100 px-4 py-2">
                  <div className="col-span-1"></div>
                  <div className="col-span-5 text-[9px] font-bold text-gray-400 tracking-widest uppercase">Description</div>
                  <div className="col-span-2 text-[9px] font-bold text-gray-400 tracking-widest uppercase">Ordered</div>
                  <div className="col-span-2 text-[9px] font-bold text-gray-400 tracking-widest uppercase">Received</div>
                  <div className="col-span-2 text-[9px] font-bold text-gray-400 tracking-widest uppercase text-right">Status</div>
                </div>
                {selected.checklist.map((item, i) => (
                  <div key={i} className={`grid grid-cols-12 items-center px-4 py-3.5 ${i < selected.checklist.length - 1 ? "border-b border-gray-100" : ""} ${item.status !== "ok" ? "bg-red-50/40" : "bg-white"}`}>
                    <div className="col-span-1">
                      {item.status === "ok" ? (
                        <div className="w-6 h-6 rounded-lg border-2 border-green-400 bg-green-50 flex items-center justify-center">
                          <Check size={11} className="text-green-600" strokeWidth={3} />
                        </div>
                      ) : item.status === "partial" ? (
                        <div className="w-6 h-6 rounded-lg border-2 border-orange-400 bg-orange-50 flex items-center justify-center">
                          <AlertTriangle size={10} className="text-orange-500" strokeWidth={2.5} />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-lg border-2 border-red-400 bg-red-50 flex items-center justify-center">
                          <X size={11} className="text-red-600" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div className="col-span-5">
                      <p className={`text-xs font-medium ${item.status !== "ok" ? "text-red-700" : "text-gray-700"}`}>{item.description}</p>
                    </div>
                    <div className="col-span-2 text-xs text-gray-500">{item.qty}</div>
                    <div className="col-span-2 text-xs font-semibold">
                      {item.status === "ok"
                        ? <span className="text-gray-500">{item.received}</span>
                        : <span className="text-red-500">{item.received || "0"}</span>
                      }
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      {item.status !== "ok" ? (
                        <>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === "missing" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                            {item.status === "missing" ? "MISSING" : "PARTIAL"}
                          </span>
                          <button onClick={() => setViewItem(item)} className="flex items-center gap-0.5 text-[11px] font-semibold text-blue-600 hover:underline">
                            <Eye size={11} /> View
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">OK</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selected.warningNote ? (
                <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">
                    <span className="font-bold">{selected.checklist.filter(c => c.status !== "ok").length} item{selected.checklist.filter(c => c.status !== "ok").length > 1 ? "s" : ""} not received.</span>{" "}
                    {selected.warningNote.replace(/^\d+ item[s]? not received\.\s*/, "")}
                  </p>
                  <div className="ml-auto flex gap-2 shrink-0">
                    <button onClick={() => setShowFollowUp(true)} className="text-[10px] font-bold text-orange-600 bg-white border border-orange-200 hover:bg-orange-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1">
                      <Flag size={10} /> Follow Up
                    </button>
                    <button onClick={() => setShowNotify(true)} className="text-[10px] font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1">
                      <Bell size={10} /> Notify
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <Check size={14} className="text-green-600 shrink-0" />
                  <p className="text-xs text-green-700 font-semibold">All items received in good condition. No follow-up required.</p>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}