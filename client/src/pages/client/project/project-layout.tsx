import { ReactNode } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  MessageCircle,
  Clock,
  Bookmark,
  Receipt,
  Folder,
  Settings,
  ArrowLeft,
} from "lucide-react";
import logoPath from "@/assets/logo-white.webp";

interface ProjectLayoutProps {
  children: ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const { id } = useParams();
  const [location] = useLocation();
  const { user } = useAuth();

  const { data: project } = useQuery({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const navigation = [
    { name: "Overview", href: `/projects/${id}`, icon: LayoutDashboard },
    { name: "Messages", href: `/projects/${id}/messages`, icon: MessageCircle },
    { name: "Timeline", href: `/projects/${id}/timeline`, icon: Clock },
    { name: "Updates", href: `/projects/${id}/updates`, icon: Bookmark },
    { name: "Invoices", href: `/projects/${id}/invoices`, icon: Receipt },
    { name: "Files", href: `/projects/${id}/files`, icon: Folder },
    { name: "Settings", href: `/projects/${id}/settings`, icon: Settings },
  ].map((item) => ({ ...item, current: location === item.href }));

  const projectTitle = (project as any)?.title || "Project";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile header */}
      <div className="lg:hidden bg-zinc-950/80 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
          <img src={logoPath} alt="Landon & Co." className="h-7" />
        </div>
        <div className="mt-3">
          <p className="eyebrow text-white/50 mb-1">Project #{id}</p>
          <h1 className="text-base font-semibold text-white truncate">
            {projectTitle}
          </h1>
        </div>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-zinc-950 border-r border-white/10">
          <div className="flex items-center px-6 py-5 border-b border-white/10">
            <Link href="/dashboard" className="flex items-center">
              <img src={logoPath} alt="Landon & Co." className="h-7" />
            </Link>
          </div>

          <div className="px-6 py-5 border-b border-white/10">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-xs text-white/50 hover:text-white transition-colors mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to dashboard
            </Link>
            <p className="eyebrow text-white/50 mb-1">Project #{id}</p>
            <h1 className="text-lg font-semibold text-white">{projectTitle}</h1>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors ${
                  item.current
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="px-4 py-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-white truncate">
                  {user?.firstName || user?.email || "User"}
                </p>
                <p className="text-xs text-white/50">Client</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="lg:pl-72 flex-1 min-w-0">
          <main className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">{children}</main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-md border-t border-white/10 z-30">
        <div className="flex justify-around py-2">
          {navigation.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1.5 px-3 text-[10px] transition-colors ${
                item.current ? "text-white" : "text-white/50 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5 mb-0.5" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
