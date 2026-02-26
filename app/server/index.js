import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import ticketsRoutes from "./routes/tickets.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/tickets", ticketsRoutes);

app.listen(4000, () => console.log("Servidor en puerto 4000"));