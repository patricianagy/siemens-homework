"use client";

import Image from "next/image";

export function Pagination({
  pageNumber,
  endOfList,
  prevClickAction,
  nextClickAction,
}: {
  pageNumber: number;
  endOfList: boolean;
  prevClickAction: () => void;
  nextClickAction: () => void;
}) {
  return (
    <div className="flex flex-row items-center gap-4 ">
      {pageNumber > 1 && (
        <Image
          src={"prev.svg"}
          width={30}
          height={30}
          alt={"Back"}
          className="cursor-pointer"
          onClick={prevClickAction}
        />
      )}
      <div className="text-lg">{pageNumber}</div>
      {!endOfList && (
        <Image
          src={"next.svg"}
          width={30}
          height={30}
          alt={"Next"}
          className="cursor-pointer"
          onClick={nextClickAction}
        />
      )}
    </div>
  );
}
