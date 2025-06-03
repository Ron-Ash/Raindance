import Image from "next/image";

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
    <div className="rounded-3xl border-3 border-stone-700 relative flex flex-col w-[500px] h-[350px] p-2 gap-2">
      <div className="flex w-full h-[125px] gap-2">
        <div className="flex-none rounded-full relative bg-stone-700 w-[50px] h-[50px] overflow-hidden hover:bg-stone-500">
          {profilePic && <Image src={profilePic} alt="img" fill />}
        </div>
        <div className="rounded-2xl flex-1 flex flex-col overflow-auto px-2 py-1">
          {message ?? ""}
        </div>
      </div>
      <div className="relative h-full w-full rounded-xl overflow-hidden">
        {attachmentPath && <Image src={attachmentPath} alt="Preview" fill />}
      </div>
      <div className="grid grid-cols-2 px-2">
        <p>{author}</p>
        <p>{time}</p>
      </div>
    </div>
  );
}
