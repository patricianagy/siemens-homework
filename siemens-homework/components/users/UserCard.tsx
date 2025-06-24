"use client";

import Image from "next/image";
import { User } from "./users";

export function UserCard({ user }: { user: User }) {
  return (
    <div className="w-full bg-white shadow-md p-4 flex flex-col items-center gap-3">
      <Image
        src={user.picture.medium}
        width={100}
        height={100}
        alt={user.name.first}
      />
      <div className="text-lg font-medium text-center">
        {user.name.first + " " + user.name.last}
      </div>
      <div className="text-[#4682B4]">{user.gender}</div>
      {user.location.postcode}
    </div>
  );
}
