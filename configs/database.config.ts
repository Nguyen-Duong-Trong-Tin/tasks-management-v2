import mongoose from "mongoose";

const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL || "");
    console.log("Connect success");
  } catch {
    console.log("Connect error");
  }
}

const database = {
  connect
};
export default database;