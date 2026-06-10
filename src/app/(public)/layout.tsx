import React from "react";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slateDark text-white">
      {/* Navigation Header */}
      <header className="border-b border-gray-800 bg-panelDark/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl tracking-wider text-cyberNeon">
              GW3//FRONTIER
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
  <Link href="/" className="hover:text-cyberNeon transition-colors">GW3 Intel</Link>
  <Link href="/build-crafter" className="hover:text-cyberNeon transition-colors">Build Crafter</Link>
  <Link href="/tactical-map" className="hover:text-cyberNeon transition-colors">Tactical Map</Link>
  <Link href="/podcast" className="hover:text-cyberNeon transition-colors hover:text-mesmer-neon">Podcast</Link>
</nav>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded bg-transparent text-cyberNeon border border-cyberNeon/30 cursor-pointer hover:bg-cyberNeon/10 transition-all neon-glow">
              Player Portal
            </span>
          </div>
        </div>
      </header>

      {/* Main content injection site */}
      <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-black/40 py-6 text-center text-xs text-gray-600">
        <p>© 2026 GW3FRONTIER. Unofficial Fan Ecosystem. Built for the Guild Wars 3 Community.</p>
      </footer>
    </div>
  );
}