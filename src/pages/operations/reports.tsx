import { useEffect, useState } from "react";
import {
  FileText, ShoppingCart, DollarSign, Download,
  RefreshCw, CheckCircle, Sheet, FileSpreadsheet,
  BarChart3, TrendingUp, Package, Clock, ChevronDown,
  AlertCircle,
} from "lucide-react";
import Sidebar from "../../components/sidebar";
import Topbar from "../../components/topbar";

type ExportFormat = "PDF" | "XLSX" | "CSV";

type ReportCard = {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  formats: ExportFormat[];
};

const reportCards: ReportCard[] = [
  {
    id: "pr",
    icon: FileText,
    title: "Purchase Request Report",
    description: "All PRs with status, values, and approvals",
    formats: ["PDF", "XLSX", "CSV"],
  },
  {
    id: "po",
    icon: ShoppingCart,
    title: "Purchase Order Summary",
    description: "POs by supplier, project, and timeline",
    formats: ["PDF", "XLSX", "CSV"],
  },
  {
    id: "cash",
    icon: DollarSign,
    title: "Payment & Cash Flow",
    description: "AP/AR reconciliation & payment history",
    formats: ["PDF", "XLSX", "CSV"],
  },
];

// ── Download Toast ───────────────────────────────────────────────
function DownloadToast({ label, onDone }: { label: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animation: "slideUp 0.3s ease" }}>
      <CheckCircle size={16} className="text-green-400 shrink-0" />
      <div>
        <p className="text-xs font-bold">{label}</p>
        <p className="text-[10px] text-gray-400">Your file is ready to download</p>
      </div>
    </div>
  );
}

// ── Sync Modal ───────────────────────────────────────────────────
function SyncModal({ onClose }: { onClose: () => void }) {
  const [syncing, setSyncing] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setSyncing(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={!syncing ? onClose : undefined} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 px-8 py-10 flex flex-col items-center text-center">
        {syncing ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border-2 border-orange-200 flex items-center justify-center mb-4">
              <RefreshCw size={26} className="text-orange-500 animate-spin" />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-2">Syncing Data…</h2>
            <p className="text-xs text-gray-400">Pushing procurement data to Google Sheets</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-green-50 border-2 border-green-200 flex items-center justify-center mb-4">
              <CheckCircle size={26} className="text-green-500" />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-2">Sync Complete!</h2>
            <p className="text-xs text-gray-400 mb-6">
              Google Sheets updated · <span className="font-semibold text-gray-600">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} at {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </span>
            </p>
            <button onClick={onClose} className="w-full py-2.5 text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors">Done</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Format Badge Button ──────────────────────────────────────────
function FormatButton({ fmt, onClick }: { fmt: ExportFormat; onClick: () => void }) {
  const colors: Record<ExportFormat, string> = {
    PDF:  "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300",
    XLSX: "border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300",
    CSV:  "border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300",
  };
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-lg border-2 transition-all bg-white ${colors[fmt]}`}>
      <Download size={10} />
      {fmt}
    </button>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function ReportsExports() {
  const [toast, setToast] = useState<string | null>(null);
  const [showSync, setShowSync] = useState(false);

  const handleExport = (title: string, fmt: ExportFormat) => {
    setToast(`${title} · ${fmt}`);
  };

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
      <Sidebar activeNav="Reports & Exports" />

      {toast && <DownloadToast label={toast} onDone={() => setToast(null)} />}
      {showSync && <SyncModal onClose={() => setShowSync(false)} />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar page="REPORTS & EXPORTS" />
        <main className="flex-1 overflow-y-auto px-8 py-6">

          {/* Header */}
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
            REPORTS <span className="text-orange-500">&amp; EXPORTS</span>
          </h1>
          <p className="text-gray-400 text-xs mb-6">PDF · XLSX · CSV · Google Sheets integration</p>

          {/* Report Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {reportCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-gray-500" />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 mb-1">{card.title}</h3>
                  <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">{card.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {card.formats.map((fmt) => (
                      <FormatButton key={fmt} fmt={fmt} onClick={() => handleExport(card.title, fmt)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Google Sheets Integration */}
          <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-gray-900">Google Sheets Integration</h3>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3.5 border border-gray-100">
              <p className="text-xs text-gray-500">
                Auto-sync procurement data to Google Sheets. Last synced:{" "}
                <span className="font-bold text-gray-800">Feb 6, 2026 at 2:00 PM</span>
              </p>
              <button
                onClick={() => setShowSync(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors shrink-0 ml-4">
                <RefreshCw size={12} />
                Sync Now
              </button>
            </div>
          </div>

        </main>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}