import { fetchThreads } from "@/lib/actions/thread.action";

const page = async () => {
  const posts = await fetchThreads({ pageNumber: 1, pageSize: 15 });
  console.log(posts)

  return (
    <div>
      hi
    </div>
  )
}

export default page;
