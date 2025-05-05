"use client";
import { Tooltip } from "@heroui/tooltip";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserFront({ session }: { session: any }) {
  const router = useRouter();

  console.log(session);

  return (
    <Tooltip
      showArrow
      content={session ? "signout" : "signin"}
      closeDelay={200}
      color="primary"
    >
      <button
        className="h-12 aspect-square rounded-full overflow-hidden hover:blur-sm duration-200 "
        onClick={() => {
          router.push(`api/auth/${session === null ? "signin" : "signout"}`);
        }}
      >
        {session?.user?.image ? (
          <Image src={session.user.image} alt="img" width={96} height={96} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1"
            stroke="currentColor"
            className="h-full w-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        )}
      </button>
    </Tooltip>
  );
}
