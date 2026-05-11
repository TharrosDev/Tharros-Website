"use client";

import React, { useRef } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "motion/react";

interface MagneticProps {
  children: React.ReactElement;
  strength?: number;
}

export default function Magnetic({ children, strength = 0.5 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Map mouse position to movement based on strength
  const moveX = useTransform(springX, (val) => val * strength);
  const moveY = useTransform(springY, (val) => val * strength);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    mouseX.set(middleX);
    mouseY.set(middleY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: moveX, y: moveY, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}
