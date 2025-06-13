"use client";

import { LayoutGroup } from "framer-motion";
import PostHeader from "./PostHeader";
import PostMessage from "./PostMessage";
import PostImage from "./PostImage";
import ActionBar from "./ActionBar";

export default function SocialPostCardContent({
  expanded,
  collapsedOpacity,
  profilePic,
  message,
  attachmentPath,
  time,
  author,
}: {
  expanded: boolean;
  collapsedOpacity: number;
  profilePic: string;
  message: string;
  attachmentPath: string;
  time: string;
  author: string;
}) {
  return (
    <LayoutGroup>
      <PostHeader
        expanded={expanded}
        collapsedOpacity={collapsedOpacity}
        profilePic={profilePic}
        author={author}
      />
      <PostMessage
        expanded={expanded}
        collapsedOpacity={collapsedOpacity}
        message={message}
      />
      <PostImage
        expanded={expanded}
        collapsedOpacity={collapsedOpacity}
        attachmentPath={attachmentPath}
      />
      <ActionBar
        expanded={expanded}
        collapsedOpacity={collapsedOpacity}
        time={time}
        author={author}
      />
    </LayoutGroup>
  );
}
