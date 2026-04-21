import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white px-6">
      <div className="max-w-xl w-full text-center">
        <p className="eyebrow text-white/60 mb-6">Error 404</p>
        <h1 className="heading-xl mb-6">
          This page <span className="text-gradient">wandered off</span>.
        </h1>
        <p className="body-lg text-white/70 mb-10">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
          Let&rsquo;s get you back to safer ground.
        </p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
