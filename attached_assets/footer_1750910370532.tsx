import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t-2 border-white/20 bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-8">
          <Image
            src="/logo-white.png"
            alt="Landon & Co. Logo"
            width={200}
            height={150}
            className="w-40 h-auto opacity-60"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-8">
              <a
                href="#"
                className="text-gray-400 hover:text-white font-mono uppercase tracking-wider text-sm transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white font-mono uppercase tracking-wider text-sm transition-colors"
              >
                Behance
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white font-mono uppercase tracking-wider text-sm transition-colors"
              >
                Dribbble
              </a>
            </div>
            <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">
              © {new Date().getFullYear()} Landon & Co. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
