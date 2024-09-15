import { ThreadCard } from "@/components/cards";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Comment } from "@/components/forms";

const page = async ({ params }: { params: { id: string } }) => {
  if(!params.id) return null;

  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(user.id);
  if(!userInfo?.onboarded) redirect('/onbarding');

  const thread = await fetchThreadById(params.id);
  if(thread === null) redirect('/')

  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={thread._id}
          currentUserId={user.id}
          parentId={thread.parentId}
          author={thread.author}
          createdAt={thread.createdAt}
          comments={thread.children}
          content={thread.text}
          community={thread.community}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={thread._id.toString()}
          currentUserImg={userInfo.image}
          currentUserId={userInfo._id.toString()}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((children: any) => (
          <ThreadCard
            key={children._id}
            id={children._id}
            currentUserId={user.id}
            parentId={children.parentId}
            author={children.author}
            createdAt={children.createdAt}
            comments={children.children}
            content={children.text}
            community={children.community}
            isComment
          />
        ))}
      </div>
    </section>
  )
}

export default page;
