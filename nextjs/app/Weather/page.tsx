import { auth } from "@/auth";
import SocialPostCard from "@/components/SocialPostCard";

export default async function Page() {
  const session = await auth();
  return (
    <div className="">
      <SocialPostCard
        profilePic={"/cityPhotos/brisbane.jpg"}
        message={
          "Rome’s history spans over two and a half millennia, from its legendary founding by Romulus in 753 BCE to the fall of Constantinople in 1453 CE. Beginning as a small settlement on the Tiber River, it grew into a republic ruled by elected senators. Through military conquest and political innovation, Rome built an empire that stretched from Britain to Mesopotamia. Cultural achievements in law, architecture, and literature influenced civilization for centuries. Internal strife, economic pressures, and barbarian invasions eroded its power, leading to the Western Empire’s collapse in 476 CE. Meanwhile, the Eastern Roman Empire persisted as Byzantium until its eventual final demise."
        }
        attachmentPath={"/cityPhotos/brisbane.jpg"}
        time={"2025-06-08"}
        author={"memescollect"}
      />
    </div>
  );
}
