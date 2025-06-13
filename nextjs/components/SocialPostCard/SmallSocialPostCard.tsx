import Image from "next/image";

export default function SmallSocialPostCard({
  profilePic,
  message,
  time,
  author,
}: {
  profilePic: string;
  message: string;
  time: string;
  author: string;
}) {
  return (
    <div className=" flex flex-col gap-2 rounded-2xl border-3 border-stone-800 w-auto h-auto p-1 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="relative flex-none w-5 h-5 rounded-full bg-stone-700 overflow-hidden hover:bg-stone-500">
          {profilePic && (
            <Image
              src={profilePic}
              alt="Profile"
              fill
              className="object-cover"
            />
          )}
        </div>
        <p className="flex-1 font-medium text-left">{author} ...</p>
        <p className="text-stone-600">Posted @ {time}</p>
      </div>
      <p className="w-full whitespace-normal break-words text-left px-2">
        {message.length > 50 ? message.slice(0, 50) + " ... " : message + "  "}
      </p>
    </div>
  );
}
