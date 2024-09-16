"use server";

import connectToDb from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import Community from "@/lib/models/community.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
}

const updateUser = async ({
  userId,
  username,
  name,
  image,
  bio,
  path,
}: Params): Promise<void> => {
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
      { upsert: true },
    );

    if (path === "/profile/update") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

const fetchUser = async (userId: string) => {
  try {
    await connectToDb();

    // return await User.findOne({ id: userId }).populate({
    //   path: "communities",
    //   model: Community
    // });

    return await User.findOne({ id: userId });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

const fetchUserPosts = async (userId: string) => {
  try {
    await connectToDb();

    const results = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return results;
  } catch (error: any) {
    console.log("Failed to fetch user posts: ${error.message}");
  }
};

// this will take a userid as a parameter and return all users
const fetchAllUsers = async ({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc"
}: {
  userId: string;
  searchString: string;
  pageNumber: number;
  pageSize: number;
  sortBy: SortOrder
}) => {
  try {
    await connectToDb();

    const skipAmount = pageSize * (pageNumber - 1);

    const query: FilterQuery<typeof User> = {
      $id: { $ne: userId }
    }

    const regex = new RegExp(searchString, "i");
    if(searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } }
      ]
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize);

    const users = await usersQuery.exec();

    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + users.length;
    return { users, isNext };
  } catch (error: any) {
    console.log("Failed to fetch all users: ${error.message}");
  }
};

const getUserActivity = async (userid: string) => {
  try {
    await connectToDb();

    // get user created threads
    const userThreads = await Thread.find({ author: userid });

    // get all child threads
    const childThreads = userThreads.reduce((acc, userTHread) => acc.concat(userTHread.children), []);

    // populate child threads, exclude created by user
    const results = await Thread.find({
      _id: { $in: childThreads },
      author: { $ne: userid }
    }).populate({
        path: "author",
        model: User,
        select: "name image id"
      })

    return results;
  } catch (error: any) {
    console.log("Failed to fetch user activity: ${error.message}");
  }
}

export {
  updateUser,
  fetchUser,
  fetchUserPosts,
  fetchAllUsers,
  getUserActivity
};
