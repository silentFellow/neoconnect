import type { NextPage } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { AccountProfile } from '@/components/forms'

const page: NextPage = async () => {
  const user = await currentUser();
  const userInfo = {};

  const userData = {
    id: user?.id || "",
    objectId: userInfo?._id || "",
    username: userInfo?.username || user?.usernmae || "",
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: user?.imageUrl || userInfo?.image || "",
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
