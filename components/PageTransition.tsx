"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  // Capture the path present at mount. Any later difference means a real
  // client-side navigation → fade the new page in. On the initial mount the
  // paths match → no fade-in, content appears immediately.
  // We never use AnimatePresence here because its exit-wait behaviour briefly
  // unmounts children during hydration, collapsing the page height and causing
  // the footer to float up behind the transparent navbar.
  const [initialPath] = useState(pathname);
  const isNavigating = pathname !== initialPath;

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
