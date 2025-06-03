import { auth } from "@/auth";
import SocialPostForm from "@/components/SocialPostForm";

export default async function Page() {
  const session = await auth();
  return (
    <div className="">
      <SocialPostForm profilePic={session?.user?.image ?? null} />
    </div>
  );
}
