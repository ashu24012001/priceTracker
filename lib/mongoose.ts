import mongoose from "mongoose";

let isConnected = false;

export async function connectToDB() {
    mongoose.set("strictQuery", true);

    if(!process.env.MONGODB_URI) return console.log("MongoDB URI not defined");

    if(isConnected) return console.log("Already connected to DB");

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected=true;
        console.log("Connected to DB");
    } catch(err: any) {
        throw new Error(err.message);
    }
}