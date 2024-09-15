import { ThreadCard } from "@/components/cards";
import { fetchThreads } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const result = await fetchThreads({ pageNumber: 1, pageSize: 15 });

  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(user.id);
  if(userInfo?.onboarded === false) redirect('/onboard');

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found...</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post.id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                author={post.author}
                createdAt={post.createdAt}
                comments={post.children}
                content={post.text}
                community={post.community}
              />
            ))}
          </>
        )}

      </section>
    </>
  )
}

export default page;
