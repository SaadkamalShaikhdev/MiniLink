import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
console.log(process.env.MONGODB_URI);
    connection.isConnected = db.connections[0].readyState;
    console.log("New database connection established");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

export default dbConnect;
