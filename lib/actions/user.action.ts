'use server'

import connectToDb from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import Community from "@/lib/models/community.model"
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";

interface Params {
  userId: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
}

const updateUser = async ({  userId, username, name, image, bio, path }: Params): Promise<void> => {
  try {
    await connectToDb();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        image,
        bio,
        onboarded: true,
      },
      {  upsert: true }
    )

    if(path === "/profile/update") { revalidatePath(path); }
  } catch(error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

const fetchUser = async (userId: string) => {
  try {
    await connectToDb();

    // return await User.findOne({ id: userId }).populate({
    //   path: "communities",
    //   model: Community
    // });

    return await User.findOne({ id: userId })
  } catch(error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

const fetchUserPosts = async (userId: string) => {
  try {
    connectToDb();

    const results = await User.findOne({ id: userId })
      .populate({
        path: "threads",
        model: Thread,
        populate: {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id"
          }
        }
      })

    return results;
  } catch(error: any) {
    console.log("Failed to fetch user posts: ${error.message}")
  }
}

export {
  updateUser,
  fetchUser,
  fetchUserPosts
}
