import Image from "next/image";
import { fetchUser, getUserActivity } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const Page = async () => {
  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(user.id);
  if(!userInfo) redirect('/');

  const activities = await getUserActivity(userInfo._id);
  if(!activities) return null;

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="flex mt-10 flex-col gap-5">
        {activities?.length === 0 ? (
          <p className="no-result">No activity found</p>
        ) : (
          <>
            {activities.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity.author.image}
                    alt="Profile Photo"
                    height={20}
                    width={20}
                    className="rounded-full"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">{activity.author.name}   </span>
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        )}
      </section>
    </section>
  )
}

export default Page;
