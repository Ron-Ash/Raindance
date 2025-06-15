"use client";

import { LayoutGroup, motion } from "framer-motion";
import PostHeader from "./PostHeader";
import PostMessage from "./PostMessage";
import PostImage from "./PostImage";
import ActionBar from "./ActionBar";
import { useEffect, useState } from "react";
import Skeleton from "../Skeleton";

interface postData {
  author: string;
  eventTime: string;
  message: string;
  attachmentPath: string;
  reply_author: string;
  reply_eventTime: string;
}

export default function SocialPostCardContent({
  profilePic,
  message,
  attachmentPath,
  reply_author,
  reply_eventTime,
  eventTime,
  author,
  handleRetrieveRepliesFFF,
}: {
  profilePic: string;
  message: string;
  attachmentPath: string;
  reply_author: string | undefined;
  reply_eventTime: string | undefined;
  eventTime: string;
  author: string;
  handleRetrieveRepliesFFF: (
    author: string,
    eventTime: string
  ) => Promise<postData[]>;
}) {
  const [expanded, setExpanded] = useState(true);
  const [reply, setReply] = useState<postData>();
  const [replyLoading, setReplyLoading] = useState<>(true);

  const variants = {
    expanded: {
      opacity: 1,
      height: "auto",
      scale: 1,
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    collapsed: {
      opacity: 1,
      height: 100,
      scale: 0.9,
      backgroundColor: "rgba(70, 70, 70, 0.5)",
    },
  };

  useEffect(() => {
    (async () => {
      setReplyLoading(true);
      try {
        const posts = await handleRetrieveRepliesFFF(
          reply_author ?? "anonymous",
          reply_eventTime ?? "0000-00-00"
        );
        setReply(posts[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setReplyLoading(false);
    })();
  }, [handleRetrieveRepliesFFF, reply_author, reply_eventTime]);

  return (
    <LayoutGroup>
      <PostHeader expanded={expanded} profilePic={profilePic} author={author} />
      <PostMessage expanded={expanded} message={message} />
      <PostImage expanded={expanded} attachmentPath={attachmentPath} />
      {reply_author && reply_eventTime && (
        <motion.div
          variants={variants}
          initial="collapsed"
          animate={!expanded ? "expanded" : "collapsed"}
          exit="collapsed"
          transition={{ duration: 0.3 }}
          className="rounded-xl p-1 justify-self-center overflow-hidden"
          onClick={
            !expanded ? () => {} : () => setExpanded((expand) => !expand)
          }
        >
          {reply === undefined ? (
            replyLoading ? (
              <Skeleton />
            ) : (
              <p>Post Unavailable</p>
            )
          ) : (
            <SocialPostCardContent
              profilePic={"/cityPhotos/brisbane.jpg"}
              message={reply.message}
              attachmentPath={reply.attachmentPath}
              eventTime={reply.eventTime}
              author={reply.author}
              reply_author={!expanded ? "how_are_you" : undefined}
              reply_eventTime={!expanded ? `2025-06-02` : undefined}
              handleRetrieveRepliesFFF={handleRetrieveRepliesFFF}
            />
          )}
        </motion.div>
      )}
      <ActionBar expanded={expanded} time={eventTime} author={author} />
    </LayoutGroup>
  );
}
