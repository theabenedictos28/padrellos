import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChevronDown, AlertTriangle, CheckCircle, Building2, FileText, ArrowRight } from "lucide-react";
import Sidebar from "../../components/sidebar";
import Topbar from "../../components/topbar";

const chartData = [
  { month: "JAN", value: 62 },
  { month: "FEB", value: 48 },
  { month: "MAR", value: 95 },
  { month: "APR", value: 55 },
  { month: "MAY", value: 40 },
  { month: "JUN", value: 70 },
  { month: "JUL", value: 60 },
  { month: "AUG", value: 58 },
  { month: "SEP", value: 65 },
  { month: "OCT", value: 72 },
  { month: "NOV", value: 68 },
  { month: "DEC", value: 75 },
];

const recentActivity = [
  { icon: FileText, color: "text-orange-500 bg-orange-50", label: "1 PRs awaiting your review", time: "Now" },
  { icon: AlertTriangle, color: "text-red-500 bg-red-50", label: "Delivery DEL-090 flagged by site engineer", time: "18 min ago" },
  { icon: CheckCircle, color: "text-green-500 bg-green-50", label: "You approved PR-2024-041", time: "2 hrs ago" },
  { icon: Building2, color: "text-blue-500 bg-blue-50", label: "Pasig Residential nearing budget limit", time: "5 hrs ago" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 13, fontWeight: 900, color: "#f97316" }}>₱{payload[0].value}M</p>
      </div>
    );
  }
  return null;
};

export default function PadrellosDashboard() {
    const navigate = useNavigate();
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar activeNav="Dashboard" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar page="DASHBOARD" />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                APPROVAL <span className="text-orange-500">QUEUE</span>
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">Operations Manager — Review and approve purchase requests</p>
            </div>
            <div className="flex items-center gap-3">
             <button
              onClick={() => navigate("/purchase-requests", { state: { statusFilter: "Pending" } })}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Review Pending PRs
            </button>
              <button onClick={() => navigate("/delivery-reports")} className="border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Check Delivery Flags
              </button>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3.5 mb-6 flex items-center gap-3">
            <AlertTriangle size={18} className="text-orange-500 shrink-0" />
            <p className="text-sm">
              <span className="font-bold text-orange-600">1 purchase request</span>{" "}
              <span className="text-orange-600">are waiting for your approval. Oldest submitted 3 days ago.</span>
            </p>
          </div>

          <div className="grid grid-cols-5 gap-4 mb-6">
            {[
              { label: "PENDING APPROVAL", value: "1", color: "text-gray-800" },
              { label: "ACTIVE PROJECTS", value: "4", color: "text-gray-800" },
              { label: "POS IN TRANSIT", value: "1", color: "text-blue-600" },
              { label: "APPROVED TODAY", value: "18", color: "text-green-600" },
              { label: "TOTAL PR VALUE", value: "₱12M", color: "text-gray-800" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 px-5 py-4 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">{stat.label}</p>
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-5 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800 text-sm">Monthly Procurement Spend</h2>
                <button className="flex items-center gap-1.5 border border-gray-200 text-gray-500 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-50">
                  2026 <ChevronDown size={12} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barCategoryGap="15%" margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9ca3af", fontWeight: 600 }} axisLine={false} tickLine={false} height={24} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#fff7ed", radius: 4 }} />
                  <Bar dataKey="value" radius={[0, 0, 0, 0]} stroke="#f5bf86" strokeWidth={1}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 2 ? "#fb923c" : "#fff1e6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="-mx-5 px-5 border-b border-gray-100 pb-3 mb-0">
                <h2 className="font-bold text-gray-800 text-sm">Recent Activity</h2>
              </div>
              <div className="-mx-5 divide-y divide-gray-100">
                {recentActivity.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 py-3 px-5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 font-medium leading-snug">{item.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PRs Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-sm">PRs Awaiting Your Approval</h2>
              <button onClick={() => navigate("/purchase-requests")} className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5">
                Review All <ArrowRight size={13} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {[
                      { label: "PR NO.", w: "w-[10%]" },
                      { label: "PROJECT", w: "w-[14%]" },
                      { label: "REQUESTED BY", w: "w-[13%]" },
                      { label: "ITEMS", w: "w-[7%]" },
                      { label: "EST. VALUE", w: "w-[10%]" },
                      { label: "NEEDED DATE", w: "w-[12%]" },
                      { label: "STATUS", w: "w-[10%]" },
                      { label: "ACTION", w: "w-[24%]" },
                    ].map((col) => (
                      <th key={col.label} className={`text-left px-4 py-3 text-[10px] font-bold text-gray-400 tracking-widest uppercase ${col.w}`}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-orange-500 font-bold text-xs">PR-2026-042</span></td>
                    <td className="px-4 py-3 text-gray-700 font-medium text-xs">Quezon Warehouse</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">Maria Santos</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">5 Items</td>
                    <td className="px-4 py-3"><span className="text-orange-500 font-bold text-xs">₱92,000</span></td>
                    <td className="px-4 py-3 text-gray-600 text-xs">March 1, 2026</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-500 border border-orange-400 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                        Pending
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => navigate("/purchase-requests", { state: { statusFilter: "Pending", action: "approve", prNo: "PR-2026-042" } })}
                          className="bg-green-50 border border-green-500 text-green-600 hover:bg-green-100 text-[11px] font-bold px-2.5 py-1 rounded-md whitespace-nowrap"
                        >
                          Approved
                        </button>
                        <button
                          onClick={() => navigate("/purchase-requests", { state: { statusFilter: "Pending", action: "reject", prNo: "PR-2026-042" } })}
                          className="bg-red-50 border border-red-400 text-red-600 hover:bg-red-100 text-[11px] font-bold px-2.5 py-1 rounded-md"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => navigate("/purchase-requests", { state: { action: "view", prNo: "PR-2026-042" } })}
                          className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 text-[11px] font-semibold px-2.5 py-1 rounded-md whitespace-nowrap"
                        >
                          View & Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}