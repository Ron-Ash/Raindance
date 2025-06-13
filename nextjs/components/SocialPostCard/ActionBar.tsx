"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ActionBar({
  expanded,
  collapsedOpacity,
  time,
  author,
}: {
  expanded: boolean;
  collapsedOpacity: number;
  time: string;
  author: string;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  const variants = {
    expanded: { opacity: 1, height: "auto" },
    collapsed: {
      opacity: collapsedOpacity,
      height: collapsedOpacity != 0 ? "auto" : 0,
    },
  };

  async function handleLike() {
    const res = await fetch("/api/kafka/produce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: liked
          ? "socialNetwork_postUnLiking"
          : "socialNetwork_postLiking",
        messages: [
          {
            key: "anonymous",
            value: JSON.stringify({ postAuthor: author, postTime: time }),
          },
        ],
      }),
    });
    if (res.ok) setLiked((liked) => !liked);
    return res.ok;
  }

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
          <div className="flex w-full justify-normal gap-4">
            <div className="flex gap-1">
              <motion.button
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.5 }}
                onHoverStart={() => console.log("hover started!")}
                onClick={async () => {
                  const success = await handleLike();
                  if (!success) throw new Error("liking functionality down");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={liked ? "currentColor" : "none"}
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={`size-6 hover:cursor-pointer stroke-red-500 ${
                    liked && "fill-red-500"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </motion.button>
              <p className="font-bold text-stone-600">{250}</p>
            </div>

            <div className="flex gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 hover:cursor-pointer fill-green-500 hover:fill-green-600"
              >
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
              </svg>

              <p className="font-bold text-stone-600">{21}</p>
            </div>

            <div className="flex gap-1">
              <motion.div
                whileHover={{ rotate: [0, 90, 90, 180] }}
                transition={{
                  duration: 0.2, // 0.5s to 90°, 1s hold, 0.5s to 180°
                  times: [0, 0.25, 0.75, 1],
                  ease: "linear",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                  />
                </svg>
              </motion.div>
              <p className="font-bold text-stone-600">{3}</p>
            </div>

            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 hover:cursor-pointer stroke-blue-500 fill-blue-500"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <path
                fillRule="evenodd"
                d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
                clipRule="evenodd"
              />
            </motion.svg>

            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="overflow-visible size-6 hover:cursor-pointer stroke-blue-500"
              initial="rest" // start with pathLength: 0
              whileHover="hover" // when the SVG is hovered…
            >
              <motion.path
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                variants={{
                  rest: {
                    pathLength: 1,
                  },
                  hover: {
                    pathLength: [0, 1],
                    transition: {
                      duration: 1.5,
                      ease: "easeInOut",
                    },
                  },
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </motion.svg>

            <div className="ml-auto flex gap-2">
              <p className="text-stone-600">Posted @ {time}</p>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={bookmarked ? "currentColor" : "none"}
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 hover:cursor-pointer hover:stroke-stone-600"
                onClick={() => setBookmarked((bookmarked) => !bookmarked)}
              >
                {bookmarked ? (
                  <path
                    fillRule="evenodd"
                    d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                  />
                )}
              </svg>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
