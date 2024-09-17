"use server"

import User from "../models/user.model"
import Thread from "../models/thread.model"
import Community from "../models/community.model"
import connectToDb from "../mongoose"
import { FilterQuery, SortOrder } from "mongoose";

const createCommunity = async (
  {
    id,
    name,
    username,
    image,
    bio,
    createdById,
  } : {
    id: string;
    name: string;
    username: string;
    image: string;
    bio: string;
    createdById: string;
  }
) => {
  try {
    await connectToDb();

    const user = await User.findOne({ id: createdById });
    if(!user) throw new Error("User not found");

    const newCommunity = await Community.create({
      id,
      name,
      username,
      image,
      bio,
      createdBy: user._id // to populate properly
    })

    user.communities.push(newCommunity._id)
    await user.save();

    return newCommunity;
  } catch(error: any) {
    throw new Error(`Failed to create community: ${error.message}`)
  }
}

const fetchCommunityDetails = async (id: string) => {
  try {
    await connectToDb();

    const community = await Community.findOne({ id }).populate([
      "createdBy",
      {
        path: "members",
        model: User,
        select: "id _id name username image"
      }
    ])

    return community
  } catch(error: any) {
    throw new Error(`Failed to fetch community details: ${error.message}`)
  }
}

const fetchCommunityPosts = async (id: string) => {
  try {
    await connectToDb()

    const posts = await Community.findOne({ id }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "author",
          model: User,
          select: "name image id"
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id"
          },
        }
      ]
    })

    return posts;
  } catch(error: any) {
    throw new Error(`Failed to fetch community posts: ${error.message}`)
  }
}

const fetchCommunities = async (
  {
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
  } : {
    searchString: string;
    pageNumber: number;
    pageSize: number;
    sortBy: SortOrder;
  }
) => {
  try {
    await connectToDb();

    const skipAmount = (pageNumber - 1) * pageSize;
    const sortOptions = { createdAt: sortBy };
    const regex = new RegExp(searchString, "i") // case insensitive

    const query: FilterQuery<typeof Community> = {};

    if(searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ]
    }

    const communities = await Community.findOne(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "members",
        model: User,
      }).exec();

    const isNext = skipAmount > skipAmount + communities.length

    return { communities, isNext };
  } catch(error: any) {
    throw new Error(`Failed to fetch communities: ${error.message}`)
  }
}

const addMemberToCommunity = async (userId: string, communityId: string) => {
  try {
    await connectToDb();

    const user = await User.findOne({ id: userId })
    const community = await Community.findOne({ id: communityId })

    if(!user) throw new Error("User not found");
    if(!community) throw new Error("Community not found");

    await User.updateOne(
      { _id: user._id },
      { $push: { communities: community._id } }
    )

    await Community.updateOne(
      { _id: community._id },
      { $push: { members: user._id } }
    )

    return { "success": true };
  } catch(error: any) {
    throw new Error(`Failed to fetch communities: ${error.message}`)
  }
}

const removeUserFromCommunity = async (userId: string, communityId: string) => {
  try {
    await connectToDb();

    const user = await User.findOne({ id: userId })
    const community = await Community.findOne({ id: communityId })

    if(!user) throw new Error("User not found");
    if(!community) throw new Error("Community not found");

    await User.updateOne(
      { _id: user._id },
      { $pull: { communities: community._id } }
    )

    await Community.updateOne(
      { _id: community._id },
      { $pull: { members: user._id } }
    )

    return { "success": true };
  } catch(error: any) {
    throw new Error(`Failed to fetch communities: ${error.message}`)
  }
}

const updateCommunity = async (
  communityId: string,
  name: string,
  username: string,
  image: string
) => {
  try {
    await connectToDb();

    // Find the community by its _id and update the information
    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, username, image }
    );

    if (!updatedCommunity) {
      throw new Error("Community not found");
    }

    return updatedCommunity;
  } catch (error) {
    // Handle any errors
    console.error("Error updating community information:", error);
    throw error;
  }
}

const deleteCommunity = async (communityId: string) => {
  try {
    const community = await Community.findOneAndDelete({ id: communityId })

    if(!community) throw new Error("Community not found");

    await Thread.deleteMany({ community: communityId })

    const communityUsers = await User.find({ communities: communityId })
    const updateUsersPromise = communityUsers.map((user) => {
      user.communities.pull(communityId);
      return user.save();
    })

    await Promise.all(updateUsersPromise);

    await connectToDb();
    return { "success": true };
  } catch(error: any) {
    throw new Error(`Failed to fetch communities: ${error.message}`)
  }
}

export {
  createCommunity,
  fetchCommunityDetails,
  fetchCommunityPosts,
  fetchCommunities,
  addMemberToCommunity,
  removeUserFromCommunity,
  updateCommunity,
  deleteCommunity
}
