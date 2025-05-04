import Image from "next/image";
import Messages from "./Messages";
import TextBox from "./TextBox";

export default function Page() {
  return (
    <div className="gap-4 relative h-[85vh]">
      <div className="p-1 bg-opacity-70 sticky top-0 flex items-center gap-4 h-[10vh] border-b-2 border-blue-500">
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
      <TextBox topic={"test-topic"} />
    </div>
  );
}
