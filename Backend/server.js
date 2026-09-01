import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import indexRouter from "./index.js";
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = { origin: "http://localhost:3001", credentials: true };
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ ADD THIS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", indexRouter);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
