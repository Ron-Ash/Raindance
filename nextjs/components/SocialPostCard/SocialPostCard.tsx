"use client";
import SocialPostCardContent from "./SocialPostCardContent";

interface postData {
  author: string;
  eventTime: string;
  message: string;
  attachmentPath: string;
  reply_author: string;
  reply_eventTime: string;
}

export default function SocialPostCard({
  profilePic,
  message,
  attachmentPath,
  eventTime,
  author,
  reply_author,
  reply_eventTime,
  handleRetrieveRepliesFF,
}: {
  profilePic: string;
  message: string;
  attachmentPath: string;
  eventTime: string;
  author: string;
  reply_author: string;
  reply_eventTime: string;
  handleRetrieveRepliesFF: (
    author: string,
    eventTime: string
  ) => Promise<postData[]>;
}) {
  return (
    <div className="rounded-2xl border-3 border-stone-700 w-[500px] h-fit p-1 backdrop-blur-xl">
      <SocialPostCardContent
        profilePic={profilePic}
        message={message}
        attachmentPath={attachmentPath}
        eventTime={eventTime}
        author={author}
        reply_author={reply_author}
        reply_eventTime={reply_eventTime}
        handleRetrieveRepliesFFF={handleRetrieveRepliesFF}
      />
    </div>
  );
}
