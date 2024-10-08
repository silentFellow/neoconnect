import Image from "next/image";
import { ProfileHeader, ThreadsTab } from "@/components/shared";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { redirect } from "next/navigation";
import { TabsContent } from "@/components/ui/tabs";

const Page = async ({ params }: { params: { id: string } }) => {
  if(!params.id) return null;

  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(params.id);
  if(!userInfo) redirect('/');

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger className="tab" key={tab.label} value={tab.value}>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  height={24}
                  width={24}
                  className="object-contain"
                />

                <p className="max-sm:hidden">{tab.label}</p>

                {tab.value === "threads" && (
                  <p className="ml-1 rounded-sm px-2 py-1 bg-light-4 4 !text-tiny-medium text-light-2">{userInfo?.threads?.length}</p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {profileTabs.map((tab) => (
            <TabsContent className="w-full text-light-1" key={`content-{tab.value}`} value={tab.value}>
              <ThreadsTab currentUserId={user.id} accountId={userInfo.id} accountType="User" />
            </TabsContent>
          ))}

        </Tabs>
      </div>
    </section>
  )
}

export default Page;
