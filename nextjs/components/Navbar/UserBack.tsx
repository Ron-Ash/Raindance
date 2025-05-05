import { auth } from "@/auth";
import UserFront from "./UserFront";

export default async function UserBack() {
  const session = await auth();
  return <UserFront session={session} />;
}
