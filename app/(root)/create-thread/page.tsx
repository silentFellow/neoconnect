import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.action";
import { PostThread } from "@/components/forms";

const CreateThread = async () => {
  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(user.id);
  if(!userInfo?.onboarded) redirect('/onboard');

  return (
    <>
      <h1 className="head-text">Create Thread</h1>

      <PostThread userId={userInfo._id.toString()} />
    </>
  )
}

export default CreateThread;
