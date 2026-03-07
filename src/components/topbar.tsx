import { useState, useRef } from "react";
import {
  Bell, ChevronDown, Search, User, Key, BellRing, ChevronRight,
} from "lucide-react";

const notifications = [
  { title: "PR #PR-2024-041 Approved", desc: "Operations approved your purchase request for Project Makati Tower B", time: "2h ago", unread: true },
  { title: "Delivery Alert — Missing Items", desc: "PO #202 delivery flagged: Paint Boysen Exterior 4L × 5 cans missing", time: "1h ago", unread: true },
  { title: "Payment Released", desc: "₱48,500 payment released for Supplier A — Cement order", time: "1h ago", unread: false },
  { title: "New PR Submitted", desc: "Site Engineer Maria submitted PR for Quezon Warehouse project", time: "1h ago", unread: false },
];

const profileMenuItems = [
  { icon: User, label: "My Profile", desc: "View account details" },
  { icon: Key, label: "Change Password", desc: "Update your login credentials" },
  { icon: BellRing, label: "Notifications Preferences", desc: "Email & in-app alerts" },
];

const Toggle = ({ on }: { on: boolean }) => {
  const [enabled, setEnabled] = useState(on);
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${enabled ? "bg-orange-500" : "bg-gray-200"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${enabled ? "left-5" : "left-0.5"}`} />
    </button>
  );
};

const NotifSection = ({ icon, title, subtitle, items }: { icon: string; title: string; subtitle: string; items: { label: string; on: boolean }[] }) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="text-orange-500">
          {icon === "monitor"
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          }
        </div>
        <div>
          <p className="text-sm font-black text-gray-800">{title}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      <Toggle on={true} />
    </div>
    <div className="space-y-0 divide-y divide-gray-50 pl-9">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between py-2.5">
          <p className="text-sm text-gray-600">{item.label}</p>
          <Toggle on={item.on} />
        </div>
      ))}
    </div>
  </div>
);

export default function Topbar({ page }: { page: string }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNotifPrefModal, setShowNotifPrefModal] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0" style={{ height: "64px" }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 font-medium">PADRELLOS CS</span>
          <span className="text-gray-300">/</span>
          <span className="font-bold text-orange-500 tracking-wide">{page}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder-gray-400 w-60 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
              placeholder="Search PRs, POs, projects..."
            />
          </div>

          {/* Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
              className="relative p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>
            {showNotif && (
              <div className="absolute right-0 top-11 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h3 className="font-black text-gray-900 text-base">Notifications</h3>
                  <button className="text-orange-500 text-xs font-semibold hover:text-orange-600">Mark all read</button>
                </div>
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <div key={i} className={`flex items-start gap-3 px-5 py-4 hover:bg-gray-50 cursor-pointer ${n.unread ? "bg-orange-50/60" : ""}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{n.desc}</p>
                        <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
                      </div>
                      {n.unread && <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0 mt-1"></span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
              className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-lg transition-colors border border-orange-400"
            >
              <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white shrink-0">MS</div>
              <div className="text-left leading-tight">
                <p className="text-xs font-bold text-gray-800">Maria Santos</p>
                <p className="text-orange-500 text-[10px] font-medium tracking-wide uppercase">Operations</p>
              </div>
              <ChevronDown size={14} className={`text-gray-400 ml-1 transition-transform ${showProfile ? "rotate-180" : ""}`} />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="bg-gray-900 px-5 py-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-lg shrink-0 ring-2 ring-white">MS</div>
                  <div>
                    <p className="text-white font-black text-base">Maria Santos</p>
                    <span className="inline-flex items-center gap-1 bg-orange-500/20 border border-orange-400 text-orange-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                      OPERATIONS
                    </span>
                    <p className="text-gray-400 text-xs mt-1">maria.santos@padrellos.com</p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 py-2.5 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-xs font-semibold text-green-600">Online</span>
                  </div>
                  <span className="text-xs text-gray-400">Last login: 1:20 PM</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {profileMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          if (item.label === "My Profile") { setShowProfileModal(true); setShowProfile(false); }
                          if (item.label === "Change Password") { setShowPasswordModal(true); setShowProfile(false); }
                          if (item.label === "Notifications Preferences") { setShowNotifPrefModal(true); setShowProfile(false); }
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                          <Icon size={16} className="text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                          <p className="text-xs text-gray-400">{item.desc}</p>
                        </div>
                        <ChevronRight size={15} className="text-gray-300 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* My Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowProfileModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[460px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">My Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="flex flex-col items-center pt-7 pb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-2xl ring-4 ring-white shadow-md">MS</div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </button>
              </div>
              <p className="font-black text-gray-900 text-lg mt-3">Maria Santos</p>
              <p className="text-gray-400 text-sm">maria.santos@padrellos.com</p>
            </div>
            <div className="border-t border-gray-100 mx-6"></div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Full Name</p>
                <p className="text-sm font-bold text-gray-800">Maria Santos</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Role</p>
                <p className="text-sm font-bold text-gray-800">Operations</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Department</p>
                <p className="text-sm font-bold text-gray-800">Construction Operations</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Phone Number</p>
                <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50">+63 9274-3004-383</div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowProfileModal(false)} className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Close</button>
              <button className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[460px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="text-lg font-black text-gray-900">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="border-t border-gray-100"></div>
            <div className="px-6 py-6 space-y-5">
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Current Password</p>
                <input type="password" placeholder="Enter current password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">New Password</p>
                <input type="password" placeholder="Atleast 8 characters" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Confirm New Password</p>
                <input type="password" placeholder="Repeat new password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300" />
              </div>
              <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p className="text-xs text-blue-400">Password must be at least 8 characters with a mix of letters and numbers.</p>
              </div>
            </div>
            <div className="border-t border-gray-100"></div>
            <div className="flex items-center justify-end gap-3 px-6 py-4">
              <button onClick={() => setShowPasswordModal(false)} className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg">Update Password</button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Preferences Modal */}
      {showNotifPrefModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowNotifPrefModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[500px] max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 shrink-0">
              <h2 className="text-lg font-black text-gray-900">Notification Preference</h2>
              <button onClick={() => setShowNotifPrefModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="border-t border-gray-100 shrink-0"></div>
            <div className="overflow-y-auto flex-1 px-6 py-4">
              <NotifSection
                icon="monitor"
                title="In-App Notifications"
                subtitle="Alerts shown inside the system"
                items={[
                  { label: "PR approved / rejected", on: true },
                  { label: "New PR submitted (for approvers)", on: false },
                  { label: "PO status updated", on: false },
                  { label: "Delivery flagged", on: true },
                  { label: "Payment approved / rejected", on: true },
                  { label: "Budget threshold exceeded", on: true },
                ]}
              />
              <div className="border-t border-gray-100 my-4"></div>
              <NotifSection
                icon="mail"
                title="Email Notifications"
                subtitle="Sent to maria.santos@padrellos.com"
                items={[
                  { label: "PR approved / rejected", on: true },
                  { label: "Payment released", on: false },
                  { label: "Delivery flagged", on: false },
                  { label: "Weekly report", on: true },
                ]}
              />
            </div>
            <div className="border-t border-gray-100 shrink-0"></div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 shrink-0">
              <button onClick={() => setShowNotifPrefModal(false)} className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Close</button>
              <button className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}