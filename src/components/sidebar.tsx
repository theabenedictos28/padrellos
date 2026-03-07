import { useNavigate } from "react-router-dom";

import { LayoutDashboard, FolderOpen, FileText, ShoppingCart, Truck, BarChart2, LogOut } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", section: "MENU", path: "/dashboard" },
  { icon: FolderOpen, label: "All Projects", section: "MENU", path: "/projects" },
  { icon: FileText, label: "Purchase Requests", section: "APPROVAL QUEUE", path: "/purchase-requests" },
  { icon: ShoppingCart, label: "Purchase Orders", section: "APPROVAL QUEUE", path: "/purchase-orders" },
  { icon: Truck, label: "Delivery Reports", section: "REPORTS", path: "/delivery-reports" },
  { icon: BarChart2, label: "Reports & Exports", section: "REPORTS", path: "/reports" },
];

const sectionOrder = ["MENU", "APPROVAL QUEUE", "REPORTS"];

export default function Sidebar({ activeNav }: { activeNav: string }) {
  const navigate = useNavigate();

  const grouped = sectionOrder.reduce((acc, sec) => {
    acc[sec] = navItems.filter((n) => n.section === sec);
    return acc;
  }, {} as Record<string, typeof navItems>);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="flex items-center gap-3 px-5 border-b border-gray-200" style={{ height: "64px" }}>
        <img src="/images/logo.png" alt="Padrellos Construction" className="h-9 w-auto object-contain" />
        <div className="leading-tight">
          <p className="font-black text-gray-900 text-sm tracking-wide">PADRELLOS</p>
          <p className="text-black-400 text-xs tracking-widest uppercase font-medium">Construction</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {sectionOrder.map((section) => (
          <div key={section}>
            <p className="text-orange-400 text-[10px] font-bold tracking-widest uppercase px-2 mb-1">{section}</p>
            {grouped[section].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 ${
                    isActive ? "bg-orange-50 text-orange-500" : "text-orange-400 hover:bg-orange-50 hover:text-orange-500"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-orange-500" : "text-orange-400"} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-red-700 border border-red-200 hover:bg-red-50 transition-all group"
        >
          <span>Log out</span>
          <LogOut size={16} className="text-red-500 group-hover:text-red-600" />
        </button>
      </div>
    </aside>
  );
}