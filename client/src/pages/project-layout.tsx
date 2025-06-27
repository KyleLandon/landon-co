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
  ArrowLeft
} from "lucide-react";
import logoPath from "@/assets/logo-black.svg";

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
    {
      name: "Overview",
      href: `/projects/${id}`,
      icon: LayoutDashboard,
      current: location === `/projects/${id}`
    },
    {
      name: "Messages",
      href: `/projects/${id}/messages`,
      icon: MessageCircle,
      current: location === `/projects/${id}/messages`
    },
    {
      name: "Timeline",
      href: `/projects/${id}/timeline`,
      icon: Clock,
      current: location === `/projects/${id}/timeline`
    },
    {
      name: "Updates",
      href: `/projects/${id}/updates`,
      icon: Bookmark,
      current: location === `/projects/${id}/updates`
    },
    {
      name: "Invoices",
      href: `/projects/${id}/invoices`,
      icon: Receipt,
      current: location === `/projects/${id}/invoices`
    },
    {
      name: "Files",
      href: `/projects/${id}/files`,
      icon: Folder,
      current: location === `/projects/${id}/files`
    },
    {
      name: "Settings",
      href: `/projects/${id}/settings`,
      icon: Settings,
      current: location === `/projects/${id}/settings`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Mobile header */}
      <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white font-mono">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <img src={logoPath} alt="Landon & Co." className="h-8" />
        </div>
        <div className="mt-4">
          <h1 className="text-lg font-bold text-white font-mono truncate">
            {(project as any)?.title || "Project"}
          </h1>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gray-900 border-r border-gray-800">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-800">
            <Link href="/dashboard">
              <img src={logoPath} alt="Landon & Co." className="h-8" />
            </Link>
          </div>

          {/* Project info */}
          <div className="px-6 py-4 border-b border-gray-800">
            <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white font-mono text-sm mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-lg font-bold text-white font-mono">
              {(project as any)?.title || "Project"}
            </h1>
            <p className="text-sm text-gray-400 font-mono mt-1">
              Project #{id}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-mono rounded-md transition-colors
                  ${item.current 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }
                `}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User info */}
          <div className="px-6 py-4 border-t border-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-mono text-white">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </span>
                </div>
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-mono text-white truncate">
                  {user?.firstName || user?.email || "User"}
                </p>
                <p className="text-xs font-mono text-gray-400">Client</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex-1">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
        <div className="flex justify-around py-2">
          {navigation.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex flex-col items-center py-2 px-3 text-xs font-mono
                ${item.current ? 'text-white' : 'text-gray-400'}
              `}
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}