import { useEffect, useState } from "react";
import { Download, Search, Truck, Package, CheckCircle, Clock } from "lucide-react";
import Sidebar from "../../components/sidebar";
import Topbar from "../../components/topbar";

type POStatus = "Ordered" | "In Transit" | "Delivered";

const statusStyles: Record<POStatus, string> = {
  "Ordered":    "bg-purple-50 text-purple-700 border-purple-300",
  "In Transit": "bg-blue-50 text-blue-700 border-blue-300",
  "Delivered":  "bg-green-50 text-green-700 border-green-300",
};

const statusDot: Record<POStatus, string> = {
  "Ordered":    "bg-purple-500",
  "In Transit": "bg-blue-500",
  "Delivered":  "bg-green-500",
};

const pipelineSteps: { key: POStatus | "Draft" | "Approved" | "Liquidated"; label: string; icon: "draft" | "check" | "truck" | "box" | "bank" }[] = [
  { key: "Draft",      label: "Draft",      icon: "draft" },
  { key: "Approved",   label: "Approved",   icon: "check" },
  { key: "Ordered",    label: "Ordered",    icon: "check" },
  { key: "In Transit", label: "In Transit", icon: "truck" },
  { key: "Delivered",  label: "Delivered",  icon: "box"   },
  { key: "Liquidated", label: "Liquidated", icon: "bank"  },
];

function getPipelineIndex(status: POStatus): number {
  const map: Record<string, number> = {
    Ordered: 2, "In Transit": 3, Delivered: 4,
  };
  return map[status] ?? 0;
}

const pos = [
  { no: "PO-201", fromPR: "PR-2024-040", supplier: "Holcim Philippines",  items: "Cement × 20 bags",     amount: 48000,  ordered: "Dec 2", deliveryBy: "Dec 8",  status: "In Transit" as POStatus },
  { no: "PO-202", fromPR: "PR-2024-040", supplier: "Boysen Paints",       items: "Paint × 10 cans",      amount: 18500,  ordered: "Dec 2", deliveryBy: "Dec 9",  status: "Delivered"  as POStatus },
  { no: "PO-203", fromPR: "PR-2024-040", supplier: "Puyat Steel Corp.",   items: "Roofing × 10 sheets",  amount: 90300,  ordered: "Dec 3", deliveryBy: "Dec 12", status: "Ordered"    as POStatus },
  { no: "PO-204", fromPR: "PR-2024-041", supplier: "Pag-asa Steel",       items: "Steel Bars × 20 pcs",  amount: 64000,  ordered: "Dec 4", deliveryBy: "Dec 14", status: "In Transit" as POStatus },
  { no: "PO-205", fromPR: "PR-2024-042", supplier: "Tile Center",         items: "Floor Tiles × 20 boxes",amount: 17000, ordered: "Dec 5", deliveryBy: "Dec 15", status: "Ordered"    as POStatus },
  { no: "PO-206", fromPR: "PR-2024-042", supplier: "Neltex Depot",        items: "PVC Pipes × 30 pcs",   amount: 9600,   ordered: "Dec 5", deliveryBy: "Dec 13", status: "Delivered"  as POStatus },
];

const stats = [
  { label: "TOTAL POs",   value: String(pos.length),                                    color: "text-gray-900" },
  { label: "ORDERED",     value: String(pos.filter(p => p.status === "Ordered").length),    color: "text-purple-700" },
  { label: "IN TRANSIT",  value: String(pos.filter(p => p.status === "In Transit").length), color: "text-blue-700" },
  { label: "DELIVERED",   value: String(pos.filter(p => p.status === "Delivered").length),  color: "text-green-700" },
  { label: "TOTAL VALUE", value: "₱" + (pos.reduce((s, p) => s + p.amount, 0) / 1000).toFixed(0) + "K", color: "text-gray-900" },
];

// ── Step Icon ────────────────────────────────────────────────────
function StepIcon({ type, done, active }: { type: string; done: boolean; active: boolean; rejected?: boolean }) {
  const cls = `w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
    active ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200" :
    done   ? "bg-green-500 border-green-500 text-white" :
             "bg-white border-gray-200 text-gray-300"
  }`;

  if (type === "truck")
    return (
      <div className={cls}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
          <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      </div>
    );
  if (type === "box")
    return (
      <div className={cls}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      </div>
    );
  if (type === "bank")
    return (
      <div className={cls}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/>
          <line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/>
          <line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>
        </svg>
      </div>
    );
  if (type === "draft")
    return (
      <div className={cls}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </div>
    );
  // check (default)
  return (
    <div className={cls}>
      {done || active ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      ) : (
        <span className="text-[10px] font-bold text-gray-300">–</span>
      )}
    </div>
  );
}

// ── Status Flow Panel ────────────────────────────────────────────
function StatusFlowPanel({ po }: { po: typeof pos[0] }) {
  const pipelineIdx = getPipelineIndex(po.status);
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mt-5">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-black text-gray-800">{po.no} — Status Flow</p>
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border ${statusStyles[po.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[po.status]}`}></span>
          {po.status}
        </span>
      </div>
      <div className="flex items-center justify-between relative px-2">
        {/* connector line */}
        <div className="absolute top-6 left-8 right-8 h-0.5 bg-gray-200 z-0" />
        {pipelineSteps.map((step, idx) => {
          const done   = pipelineIdx > idx;
          const active = pipelineIdx === idx;
          return (
            <div key={step.key} className="flex flex-col items-center z-10 flex-1 gap-2">
              <StepIcon type={step.icon} done={done} active={active} />
              <p className={`text-[10px] font-bold text-center leading-tight ${
                active ? "text-orange-500" : done ? "text-green-600" : "text-gray-300"
              }`}>{step.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function PurchaseOrders() {
  const [tabFilter, setTabFilter] = useState<"All" | POStatus>("All");
  const [search, setSearch]       = useState("");
  const [selectedPO, setSelectedPO] = useState<typeof pos[0]>(pos[0]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    return () => { document.head.removeChild(link); };
  }, []);

  const filtered = pos.filter((po) => {
    const matchTab    = tabFilter === "All" || po.status === tabFilter;
    const matchSearch = search === "" ||
      po.no.toLowerCase().includes(search.toLowerCase()) ||
      po.supplier.toLowerCase().includes(search.toLowerCase()) ||
      po.fromPR.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabs: ("All" | POStatus)[] = ["All", "Ordered", "In Transit", "Delivered"];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar activeNav="Purchase Orders" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar page="PURCHASE ORDERS" />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              PURCHASE <span className="text-orange-500">ORDERS</span>
            </h1>
            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              <Download size={15} /> Export
            </button>
          </div>
          <p className="text-gray-400 text-xs mb-5">Auto-generated from approved PRs · Multi-supplier split</p>

          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3.5 shadow-sm">
                <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">{s.label}</p>
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Toolbar */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
              {/* Tab filters */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                {tabs.map((tab) => {
                  const counts: Record<string, number> = {
                    All:        pos.length,
                    Ordered:    pos.filter(p => p.status === "Ordered").length,
                    "In Transit": pos.filter(p => p.status === "In Transit").length,
                    Delivered:  pos.filter(p => p.status === "Delivered").length,
                  };
                  return (
                    <button key={tab} onClick={() => setTabFilter(tab)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        tabFilter === tab ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}>
                      {tab}
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        tabFilter === tab ? "bg-orange-400 text-white" : "bg-gray-200 text-gray-500"
                      }`}>{counts[tab]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative min-w-[220px]">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search PO, supplier, PR..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300" />
              </div>
            </div>

            {/* Section label */}
            <div className="px-5 py-3 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-800">All Purchase Orders</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {[
                      { label: "PO NO.",       w: "w-[9%]"  },
                      { label: "FROM PR",      w: "w-[11%]" },
                      { label: "SUPPLIER",     w: "w-[17%]" },
                      { label: "ITEMS",        w: "w-[18%]" },
                      { label: "AMOUNT",       w: "w-[10%]" },
                      { label: "ORDERED",      w: "w-[9%]"  },
                      { label: "DELIVERY BY",  w: "w-[10%]" },
                      { label: "STATUS",       w: "w-[10%]" },
                      { label: "ACTION",       w: "w-[6%]"  },
                    ].map((col) => (
                      <th key={col.label} className={`text-left px-4 py-3 text-[9px] font-bold text-gray-400 tracking-widest uppercase ${col.w}`}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((po, i) => {
                    const isSelected = selectedPO.no === po.no;
                    return (
                      <tr key={i}
                        onClick={() => setSelectedPO(po)}
                        className={`border-b border-gray-50 cursor-pointer transition-colors ${
                          isSelected ? "bg-orange-50/40" : "hover:bg-orange-50/20"
                        }`}>
                        <td className="px-4 py-3">
                          <span className="text-orange-500 font-bold text-xs">{po.no}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{po.fromPR}</td>
                        <td className="px-4 py-3 text-gray-700 font-medium text-xs">{po.supplier}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{po.items}</td>
                        <td className="px-4 py-3">
                          <span className="text-orange-500 font-bold text-xs">₱{po.amount.toLocaleString("en-PH")}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{po.ordered}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{po.deliveryBy}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyles[po.status]}`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot[po.status]}`}></span>
                            {po.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedPO(po); }}
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-1"
                          >
                            <Truck size={10} /> Track
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-gray-400">No purchase orders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Status Flow Panel */}
          <StatusFlowPanel po={selectedPO} />
        </main>
      </div>
    </div>
  );
}