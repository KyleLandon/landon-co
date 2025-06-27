import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  FileText, 
  TrendingUp, 
  Calendar,
  CreditCard,
  Settings,
  Home,
  User,
  ChevronLeft,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const { id } = useParams();
  const [location] = useLocation();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: "Overview", href: `/projects/${id}`, icon: Home },
    { name: "Messages", href: `/projects/${id}/messages`, icon: MessageCircle },
    { name: "Timeline", href: `/projects/${id}/timeline`, icon: Calendar },
    { name: "Updates", href: `/projects/${id}/updates`, icon: TrendingUp },
    { name: "Invoices", href: `/projects/${id}/invoices`, icon: CreditCard },
    { name: "Files", href: `/projects/${id}/files`, icon: FileText },
    { name: "Settings", href: `/projects/${id}/settings`, icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === `/projects/${id}`) {
      return location === href;
    }
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-white hover:bg-white/10"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/attached_assets/white_transparent_1750909506258.png" 
              alt="Landon & Co." 
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-white hover:text-gray-300 font-mono text-sm flex items-center">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full bg-black border-r border-white/10 pt-16 lg:pt-0">
            <div className="flex-1 flex flex-col min-h-0 py-6">
              <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        group flex items-center px-3 py-2 text-sm font-mono rounded-md transition-colors
                        ${active 
                          ? 'bg-white text-black' 
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }
                      `}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Icon className={`
                        mr-3 flex-shrink-0 h-5 w-5 transition-colors
                        ${active ? 'text-black' : 'text-gray-400 group-hover:text-white'}
                      `} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Project Info */}
              <div className="px-4 py-4 border-t border-white/10">
                <div className="text-xs text-gray-400 mb-1 font-mono">Project #{id}</div>
                <div className="text-sm text-white font-mono">Web Development</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <main className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}