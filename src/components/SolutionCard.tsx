import Image from "next/image";
import React from "react";
import { type RouterOutputs } from "~/utils/api";
import Link from "next/link";
import { timeAgo } from "~/utils/helpers";

type Solution = RouterOutputs["solution"]["getAll"][0];

function SolutionCard({ solution }: { solution: Solution }) {
  const timeElpsed = timeAgo(new Date(solution.createdAt.getTime()));

  return (
    <div
      style={{
        breakInside: "avoid",
        pageBreakInside: "avoid",
      }}
      className={` mx-4 my-4 flex   min-w-[20rem] flex-1 flex-col rounded-xl border  bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800  dark:shadow-slate-700/[.7] md:min-w-[24rem] lg:max-w-[calc(33.33%-2.5rem)]  `}
    >
      <Image
        className="h-auto w-full rounded-t-xl   "
        src="https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_475/Screenshots/dj1lkfgrgxd76rhtgcdz.jpg"
        alt="Image Description"
        width={300}
        height={250}
      />
      <div className="p-4 md:p-5">
        <p className="text-sm text-gray-500">Submitted {timeElpsed}</p>
        <Link href={`/solutions/${solution.id}`}>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {solution.title}
          </h3>
        </Link>
        <Link href={`/challenges/${solution.challenge.slug}`}>
          <p className="text-sm text-gray-500 hover:underline ">
            Challenge : {solution.challenge.title}
          </p>
        </Link>
        <div className="flex flex-row flex-wrap items-center gap-x-2 text-sm  ">
          {solution.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
        <div className="my-1 flex flex-row items-center justify-between gap-x-2  ">
          <span className="font-semibold uppercase text-lime-600">
            {solution.challenge.type}
          </span>
        </div>
        <div className="my-2 flex flex-row items-center space-x-3 border-y py-3">
          <Link className="group" href={`/profile/${solution.user.username}`}>
            <Image
              src={solution.user.image}
              width={50}
              height={50}
              alt={"user-avatar"}
              className="rounded-full"
            />
          </Link>
          <div className="flex flex-col items-start gap-y-0.5">
            <Link className="group" href={`/profile/${solution.user.username}`}>
              <p className="font-semibold text-gray-800 hover:underline  ">
                {solution.user.name}
              </p>
            </Link>
            <p className="text-sm text-gray-500">@{solution.user.username}</p>
          </div>
        </div>

        <p className="mt-1  text-gray-800 dark:text-gray-400">
          {solution.description}
        </p>

        {/* <a
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          href="#"
        >
          Go somewhere
        </a> */}
      </div>
    </div>
  );
}

export default SolutionCard;
