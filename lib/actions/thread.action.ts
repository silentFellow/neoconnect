"use server";

import connectToDb from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import Thread from "@/lib/models/thread.model";
import { revalidatePath } from "next/cache";

interface Params {
  author: string;
  text: string;
  communityId: string | null;
  path: string;
}

const createThread = async ({
  author,
  text,
  communityId,
  path,
}: Params): Promise<void> => {
  try {
    await connectToDb();

    const threadRes = await Thread.create({
      text,
      author,
      community: communityId,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: threadRes._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
};

const fetchThreads = async ({
  pageNumber = 1,
  pageSize = 10,
}: {
  pageNumber: number;
  pageSize: number;
}) => {
  try {
    await connectToDb();

    // calculate skippable documents
    const skipable = (pageNumber - 1) * pageSize;

    // post query with pagination
    const postQuery = Thread.find({ parent_id: { $in: [null, undefined] } })
      .skip(skipable)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image"
        }
      })

    const posts = await postQuery.exec();

    // check if next page is available
    const totalPosts = await Thread.countDocuments({ parent_id: { $in: [null, undefined] } });
    const hasNext = totalPosts > (skipable + posts.length);

    return { posts, hasNext };
  } catch (error: any) {
  throw new Error(`Failed to fetch posts: ${error.message}`);
}
};

export {
  createThread,
  fetchThreads
};
