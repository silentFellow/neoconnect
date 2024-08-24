import mongoose from 'mongoose';

let isConnectted = false;

const connectToDb = async () => {
  if(isConnectted) return;

  try {
    const MONGO_URL: string | undefined = process.env.MONGO_URL;
    if(!MONGO_URL) throw new Error("MONGO_URL is not found in environment")

    mongoose.set("strictQuery", true);
    await mongoose.connect(MONGO_URL);
    isConnectted = true;
  } catch(error) {
    console.log(error);
  }
}

export default connectToDb;
