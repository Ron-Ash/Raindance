"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function PostMessage({
  expanded,
  collapsedOpacity,
  message,
}: {
  expanded: boolean;
  collapsedOpacity: number;
  message: string;
}) {
  const [expandMessage, setExpandMessage] = useState(false);
  const variants = {
    expanded: { opacity: 1, height: "auto" },
    collapsed: {
      opacity: collapsedOpacity,
      height: collapsedOpacity != 0 ? "auto" : 0,
    },
  };
  return (
    <AnimatePresence initial={false} mode="wait">
      {true && (
        <motion.div
          className={`flex flex-col w-full h-auto gap-2 overflow-hidden`}
          variants={variants}
          initial="collapsed"
          animate={expanded ? "expanded" : "collapsed"}
          exit="collapsed"
          transition={{ duration: 0.3 }}
        >
          <p className="w-full whitespace-normal break-words">
            {message.length > 50 && !expandMessage
              ? message.slice(0, 50) + " ... "
              : message + "  "}
            {message.length > 50 && (
              <span>
                <button
                  className="text-blue-500 font-bold hover:text-blue-600"
                  onClick={() =>
                    setExpandMessage((expandMessage) => !expandMessage)
                  }
                >
                  {expandMessage ? "less" : "more"}
                </button>
              </span>
            )}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
