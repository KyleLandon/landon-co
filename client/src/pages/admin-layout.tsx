import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notification-bell";
import { Users, FolderOpen, Plus, MessageSquare, Settings, LogOut, Menu, X } from "lucide-react";
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
  { id: "dashboard", label: "Dashboard", icon: FolderOpen, path: "/admin" },
  { id: "projects", label: "Projects", icon: FolderOpen, path: "/admin/projects" },
  { id: "clients", label: "Clients", icon: Users, path: "/admin/clients" },
  { id: "messages", label: "Messages", icon: MessageSquare, path: "/admin/messages" },
  { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always visible on desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-80 lg:bg-zinc-900 lg:border-r lg:border-white/10">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-mono font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm font-mono text-gray-400 mt-2">
            Welcome, {user?.firstName || user?.email?.split('@')[0]}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <Link key={item.id} href={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start font-mono text-left ${
                    isActive(item.path)
                      ? "bg-white text-black hover:bg-gray-200"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start font-mono text-gray-300 hover:bg-red-900/20 hover:text-red-400"
            onClick={() => window.location.href = "/api/logout"}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed left-0 top-0 h-full w-80 bg-zinc-900 border-r border-white/10 z-50 lg:hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-mono font-bold text-white">Admin Dashboard</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm font-mono text-gray-400 mt-2">
                Welcome, {user?.firstName || user?.email?.split('@')[0]}
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <Link key={item.id} href={item.path}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start font-mono text-left ${
                        isActive(item.path)
                          ? "bg-white text-black hover:bg-gray-200"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <Button
                variant="ghost"
                className="w-full justify-start font-mono text-gray-300 hover:bg-red-900/20 hover:text-red-400"
                onClick={() => window.location.href = "/api/logout"}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:flex lg:flex-col">
        {/* Top bar - Mobile only */}
        <div className="bg-zinc-900 border-b border-white/10 px-6 py-4 lg:hidden">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:bg-white/10"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-mono font-bold">Admin Dashboard</h1>
            <NotificationBell />
          </div>
        </div>

        {/* Top bar - Desktop only */}
        <div className="hidden lg:block bg-zinc-900 border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-end">
            <NotificationBell />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}