import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "@/components/notification-bell";
import {
  Users,
  FolderOpen,
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "wouter";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { id: "projects", label: "Projects", icon: FolderOpen, path: "/admin/projects" },
  { id: "clients", label: "Clients", icon: Users, path: "/admin/clients" },
  { id: "messages", label: "Messages", icon: MessageSquare, path: "/admin/messages" },
  { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
];

function SidebarContent({
  user,
  isActive,
  onItemClick,
}: {
  user: any;
  isActive: (path: string) => boolean;
  onItemClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-7 border-b border-white/10">
        <p className="eyebrow text-white/50 mb-2">Admin</p>
        <h1 className="text-lg font-semibold text-white">Landon &amp; Co.</h1>
        <p className="text-sm text-white/50 mt-1 truncate">
          {user?.firstName || user?.email?.split("@")[0]}
        </p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={onItemClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          onClick={() => (window.location.href = "/api/logout")}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/admin" ? location === "/admin" : location.startsWith(path);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-zinc-950 border-r border-white/10">
        <SidebarContent user={user} isActive={isActive} />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <aside className="fixed left-0 top-0 h-full w-72 bg-zinc-950 border-r border-white/10 z-50 lg:hidden">
          <div className="flex justify-end p-3">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <SidebarContent
            user={user}
            isActive={isActive}
            onItemClick={() => setSidebarOpen(false)}
          />
        </aside>
      )}

      {/* Main */}
      <div className="flex-1 lg:flex lg:flex-col min-w-0">
        <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <p className="text-sm text-white/60 lg:hidden">Admin</p>
          </div>
          <NotificationBell />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
