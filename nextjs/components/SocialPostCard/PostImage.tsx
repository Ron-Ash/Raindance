"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function PostImage({
  expanded,
  collapsedOpacity,
  attachmentPath,
}: {
  expanded: boolean;
  collapsedOpacity: number;
  attachmentPath: string;
}) {
  const variants = {
    expanded: { opacity: 1, height: "auto" },
    collapsed: {
      opacity: collapsedOpacity,
      height: collapsedOpacity != 0 ? "auto" : 0,
    },
  };
  return (
    <AnimatePresence initial={false} mode="wait">
      {attachmentPath && (
        <motion.div
          className={`relative w-full aspect-video rounded-xl overflow-hidden`}
          variants={variants}
          initial="collapsed"
          animate={expanded ? "expanded" : "collapsed"}
          exit="collapsed"
          transition={{ duration: 0.3 }}
        >
          <Image
            src={attachmentPath}
            alt="Post image"
            fill
            className="object-cover"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
