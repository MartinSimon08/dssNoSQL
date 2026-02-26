import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/pizzeria_db");
  console.log("Mongo conectado");
};

export default connectDB;