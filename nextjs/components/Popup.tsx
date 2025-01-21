"use client";
import { motion } from "motion/react";
import { ReactNode } from "react";

export default function Popup({
  children,
  active,
}: {
  children: ReactNode;
  active: boolean;
}) {
  return (
    <motion.div
      initial={false}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        transform: `translateX(${active ? "0%" : "100%"})`,
      }}
      className="absolute top-0 right-0 z-50 bg-blue-500 bg-opacity-40 backdrop-blur-md rounded-l-3xl h-[100vh] w-3/12 grid grid-cols-1 p-4 gap-4"
    >
      {children}
    </motion.div>
  );
}
