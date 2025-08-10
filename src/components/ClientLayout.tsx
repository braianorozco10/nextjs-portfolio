'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Navbar */}
      <nav className="bg-black text-white p-4 flex gap-6 justify-center sticky top-0 z-50 shadow-md">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/contact">Contact</Link>
        {/* <Link href="/translator">Translator</Link> */}

      </nav>

      {/* Animated Page Wrapper */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="min-h-[calc(100vh-4rem)]"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
