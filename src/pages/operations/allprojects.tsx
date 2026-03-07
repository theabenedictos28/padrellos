import { useEffect } from "react";
import { Building2, MapPin } from "lucide-react";
import Sidebar from "../../components/sidebar";
import Topbar from "../../components/topbar";

const projects = [
  {
    id: "PRJ-001",
    name: "Makati Tower B",
    status: "Active",
    statusColor: "bg-green-100 text-green-800 border-green-400",
    statusDot: "bg-green-700",
    topBorder: "border-t-4 border-t-yellow-700",
    type: "Commercial",
    location: "Makati City",
    budgetUsed: 2856000,
    budgetTotal: 4200000,
    barColor: "bg-yellow-700",
    pctColor: "text-yellow-700",
    pct: 68,
    prs: 7,
    pos: 12,
    note: "3 pending",
    noteColor: "text-orange-700",
    noteIcon: null,
  },
  {
    id: "PRJ-002",
    name: "Quezon Warehouse",
    status: "Active",
    statusColor: "bg-green-100 text-green-800 border-green-400",
    statusDot: "bg-green-700",
    topBorder: "border-t-4 border-t-green-700",
    type: "Industrial",
    location: "Quezon City",
    budgetUsed: 576000,
    budgetTotal: 1800000,
    barColor: "bg-green-700",
    pctColor: "text-green-700",
    pct: 32,
    prs: 3,
    pos: 5,
    note: "On Track",
    noteColor: "text-green-700",
    noteIcon: "check",
  },
  {
    id: "PRJ-003",
    name: "BGC Office Fit-out",
    status: "Active",
    statusColor: "bg-green-100 text-green-800 border-green-400",
    statusDot: "bg-green-700",
    topBorder: "border-t-4 border-t-blue-800",
    type: "Office",
    location: "BGC, Taguig",
    budgetUsed: 499800,
    budgetTotal: 980000,
    barColor: "bg-blue-800",
    pctColor: "text-blue-800",
    pct: 51,
    prs: 4,
    pos: 6,
    note: "2 Pending",
    noteColor: "text-blue-800",
    noteIcon: null,
  },
  {
    id: "PRJ-004",
    name: "Pasig Residential",
    status: "Over Budget",
    statusColor: "bg-red-100 text-red-800 border-red-400",
    statusDot: "bg-red-800",
    topBorder: "border-t-4 border-t-red-800",
    type: "Residential",
    location: "Pasig City",
    budgetUsed: 1932000,
    budgetTotal: 2100000,
    barColor: "bg-red-800",
    pctColor: "text-red-800",
    pct: 92,
    prs: 10,
    pos: 18,
    note: "Over Budget",
    noteColor: "text-red-800",
    noteIcon: "warning",
  },
];

function formatPeso(n: number) {
  return "₱" + n.toLocaleString("en-PH");
}

export default function AllProjects() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar activeNav="All Projects" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar page="PROJECTS" />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              ACTIVE <span className="text-orange-500">PROJECTS</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">4 ongoing · 2 completed this year</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer ${p.topBorder}`}
              >
                <div className="p-4 flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-black text-gray-900 text-sm leading-tight">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{p.id}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${p.statusColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.statusDot}`}></span>
                      {p.status}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md font-medium">
                      <Building2 size={10} className="text-gray-400 shrink-0" /> {p.type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md font-medium">
                      <MapPin size={10} className="text-gray-400 shrink-0" /> {p.location}
                    </span>
                  </div>

                  {/* Budget */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Budget Used</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[11px] font-black text-gray-900">{formatPeso(p.budgetUsed)}</span>
                        <span className="text-[10px] text-gray-400 font-medium">/ {formatPeso(p.budgetTotal)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all ${p.barColor}`} style={{ width: `${p.pct}%` }}></div>
                      </div>
                      <span className={`text-[11px] font-black shrink-0 ${p.pctColor}`}>
                        {p.pct}%
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <p className="text-[11px] text-gray-400 font-medium">{p.prs} PRs · {p.pos} POs</p>
                    <span className={`text-[11px] font-bold flex items-center gap-1 ${p.noteColor}`}>
                      {p.noteIcon === "check" && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                      {p.noteIcon === "warning" && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      )}
                      {p.note}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}