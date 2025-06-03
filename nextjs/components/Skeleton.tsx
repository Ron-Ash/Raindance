import { motion } from "motion/react";

export default function Skeleton() {
  return (
    <motion.div
      className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
      initial={{ x: "-100%" }}
      animate={{ x: "200%" }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut",
      }}
    />
  );
}
