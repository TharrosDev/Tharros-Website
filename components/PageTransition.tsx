"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const prevPath = useRef<string | null>(null);

  // Track whether this is a real navigation (not the initial mount).
  // On initial mount prevPath is null → no fade-in, content appears immediately.
  // On client-side nav the path changes → fade new page in.
  // We never use AnimatePresence here because its exit-wait behaviour briefly
  // unmounts children during hydration, collapsing the page height and causing
  // the footer to float up behind the transparent navbar.
  const isNavigating = prevPath.current !== null && prevPath.current !== pathname;
  prevPath.current = pathname;

  if (reduce) return <div className="w-full">{children}</div>;

  return (
    <motion.div
      key={pathname}
      initial={isNavigating ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
