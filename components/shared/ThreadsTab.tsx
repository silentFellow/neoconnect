import { fetchUserPosts } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { ThreadCard } from "../cards";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  const results = await fetchUserPosts(accountId);
  if(!results) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {results.threads.map((thread: any) => (
        <ThreadCard
          key={thread.id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          author={
            accountType === "User" ? { name: results.name, image: results.image, id: results.id }
            : { name: thread.author.name, image: thread.author.image, id: thread.author.id }
          }
          createdAt={thread.createdAt}
          comments={thread.children}
          content={thread.text}
          community={thread.community}
        />
      ))}
    </section>
  )
}

export default ThreadsTab;
