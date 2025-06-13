"use client";

import SocialPostCardBorder from "./SocialPostCardBorder";
import SocialPostCardContent from "./SocialPostCardContent";

export default function SocialPostCard({
  profilePic,
  message,
  attachmentPath,
  time,
  author,
}: {
  profilePic: string;
  message: string;
  attachmentPath: string;
  time: string;
  author: string;
}) {
  return (
    <SocialPostCardBorder>
      <SocialPostCardContent
        profilePic={profilePic}
        message={message}
        attachmentPath={attachmentPath}
        time={time}
        author={author}
      />
    </SocialPostCardBorder>
  );
}
