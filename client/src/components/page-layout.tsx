import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ReactNode } from "react";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}
