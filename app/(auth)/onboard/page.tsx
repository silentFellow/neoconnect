import { currentUser } from '@clerk/nextjs/server';
import { AccountProfile } from '@/components/forms'

import { fetchUser } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';

const page = async () => {
  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(user.id);
  if(userInfo?.onboarded) redirect('/');

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    username: userInfo ? userInfo?.username : user.username,
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user?.imageUrl
  }

  return (
    <main className="flex flex-col justify-start max-w-3xl mx-auto px-10 py-20">
      <h1 className="head-text">Onboard</h1>
      <p className="mt-3 text-base-medium text-light-2">
        Continue you profile details
      </p>

      <section className="mt-9 p-10 bg-dark-2">
        <AccountProfile
          user = {userData}
          btnTitle = "Continue"
        />
      </section>
    </main>
  )
}

export default page;
