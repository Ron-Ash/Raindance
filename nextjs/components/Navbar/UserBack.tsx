import { auth } from "@/auth";
import UserFront from "./UserFront";

export default async function UserBack() {
  const session = await auth();
  console.log(session);

  return <UserFront session={session} />;
}
