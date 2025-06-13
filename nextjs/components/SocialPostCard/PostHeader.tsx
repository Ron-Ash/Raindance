"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function PostHeader({
  expanded,
  collapsedOpacity,
  profilePic,
  author,
}: {
  expanded: boolean;
  collapsedOpacity: number;
  profilePic: string;
  author: string;
}) {
  const [following, setFollowing] = useState(false);
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
          className={`flex w-full h-auto items-center gap-4`}
          variants={variants}
          initial="collapsed"
          animate={expanded ? "expanded" : "collapsed"}
          exit="collapsed"
          transition={{ duration: 0.3 }}
        >
          <div className="relative flex-none w-10 h-10 rounded-full bg-stone-700 overflow-hidden hover:bg-stone-500">
            {profilePic && (
              <Image
                src={profilePic}
                alt="Profile"
                fill
                className="object-cover"
              />
            )}
          </div>
          <p className="flex-1 font-medium text-left">{author}</p>
          <button
            className="rounded-xl px-2 py-1 bg-stone-600 hover:bg-stone-700 active:bg-stone-800"
            onClick={() => setFollowing((following) => !following)}
          >
            {following ? "Following" : "Follow"}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
