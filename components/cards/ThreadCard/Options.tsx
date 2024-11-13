'use client';

import Link from "next/link";
import { parseSocialNumbers } from "@/lib/utils";
import Image from "next/image";
import {likeThread} from "@/lib/actions/thread.action";
import {usePathname} from "next/navigation";

const Options = ({
    threadId,
    likedBy,
    comments,
    currentUserId,
    isComment
}: {
    threadId: string;
    likedBy: string[];
    comments: string[];
    currentUserId: string | null;
    isComment?: boolean;
}) => {
    const pathname = usePathname();

    const like = async () => {
        try {
            if (!currentUserId) return;
            await likeThread({
                threadId: threadId,
                userId: currentUserId,
                path: pathname
            })
        } catch(error: any) {
                console.log(error.message)
            }
    }

    const copyCurrentUrl = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/thread/${threadId}`);
        } catch(error: any) {
            console.log(`Failed to copy url ${error.message}`)
        }
    }

    return (
    <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
      <div className="flex flex-row gap-5">
        <div className="flex gap-1">
          <Image
            src={
              currentUserId && likedBy.includes(currentUserId)
                ? "/assets/heart-filled.svg"
                : "/assets/heart-gray.svg"
            }
            alt="heart"
            height={24}
            width={24}
            className="cursor-pointer object-contain"
            onClick={() => like()}
          />
          <span className="text-white">
            {parseSocialNumbers(likedBy.length)}
          </span>
        </div>

        <Link href={`/thread/${threadId}`}>
          <Image
            src="/assets/reply.svg"
            alt="reply"
            height={24}
            width={24}
            className="cursor-pointer object-contain"
          />
        </Link>
        <Image
          src="/assets/repost.svg"
          alt="repost"
          height={24}
          width={24}
          className="cursor-pointer object-contain"
        />
        <Image
          src="/assets/share.svg"
          alt="share"
          height={24}
          width={24}
          className="cursor-pointer object-contain"
          onClick={copyCurrentUrl}
        />
      </div>

      {comments.length > 0 && (
        <Link href={`/thread/${threadId}`}>
          <p className="text-subtle-medium text-gray-1">
            {comments.length} repl{comments.length > 1 ? "ies" : "y"}
          </p>
        </Link>
      )}
    </div>
  );
};

export default Options;
