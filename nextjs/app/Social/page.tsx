// import Image from "next/image";
// import Messages from "./Messages";
// import TextBox from "./TextBox";
import SocialFeed from "./SocialFeed";
import SocialPostForm from "@/components/SocialPostForm";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return (
    <div className="gap-4 relative w-full h-[85svh] overflow-hidden grid grid-cols-2">
      {/* <div className="p-1 bg-opacity-70 sticky top-0 flex items-center gap-4 h-[10vh] border-b-2 border-blue-500">
        <Image
          className="rounded-full cursor-pointer w-[50px] h-[50px]"
          src="https://i.pravatar.cc/"
          alt="profileImage"
          width={100}
          height={100}
        />
        <b>hell world</b>
      </div>
      <Messages topic={"test-topic"} />
      <TextBox topic={"test-topic"} /> */}
      <SocialFeed topic={"socialNetwork_postStream"} user={"anonymous"} />
      <div className="justify-self-end self-end">
        <SocialPostForm profilePic={session?.user?.image ?? null} />
      </div>
    </div>
  );
}
