import Link from "next/link";
import Image from "next/image";
import Options from "@/components/cards/ThreadCard/Options";
import {fetchUser} from "@/lib/actions/user.action";

interface Props {
  id: string;
  currentUserId: string | null;
  parentId: string | null;
  content: string;
  likedBy: string[];
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    name: string;
    image: string;
    id: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      name: string;
    }
  }[];
  isComment?: boolean;
}

const ThreadCard = async ({ id, currentUserId, parentId, likedBy, author, content, community, createdAt, comments, isComment }: Props) => {
  return (
    <article className={`flex w-full flex-col rounded-xl ${isComment ? "p-0 xs:p-8" : "bg-dark-2 p-7"}`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-1 flex-row w-full gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="Profile Image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex flex-col w-full">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="text-base-semibold text-light-1 cursor-pointer">{author.name}</h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            <Options
                threadId={id.toString()}
                likedBy={likedBy}
                comments={comments}
                currentUserId={currentUserId}
                isComment={isComment}
            />
          </div>
        </div>
      </div>

    </article>
  )
}

export default ThreadCard;
