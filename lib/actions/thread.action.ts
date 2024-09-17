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
    const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
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
    const totalPosts = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });
    const hasNext = totalPosts > (skipable + posts.length);

    return { posts, hasNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
};

const fetchThreadById = async (id: string) => {
  try {
    connectToDb();

    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image"
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id parentId name image"
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id parentId name image"
            }
          }
        ]
      }).exec();

    return thread;
  } catch(error: any) {
    console.log(`Failed to fetch thread: ${error.message}`)
    return null;
  }
}

const addComment = async ({ threadId, currentUserId, text, path }: { threadId: string, currentUserId: string, text: string, path: string }) => {
  try {
    const originalThread = await Thread.findById(threadId);
    if(!originalThread) {
      throw new Error("Thread not found");
    }

    const comment = await Thread.create({
      text,
      author: currentUserId,
      parentId: threadId
    })

    originalThread.children.push(comment._id);
    await originalThread.save();

    revalidatePath(path);
  } catch(error: any) {
    console.log(`Failed to add comment: ${error.message}`)
  }


}

export {
  createThread,
  fetchThreads,
  fetchThreadById,
  addComment
};
