import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, ".env");
console.log("Loading .env from:", envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("❌ Error loading .env:", result.error);
} else {
  console.log("✅ .env loaded successfully");
}

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const seedAdmin = async () => {
  try {
    const adminEmail = "user@example.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      console.log("🚀 Seeding Master Admin...");
      await User.create({
        username: "MasterAdmin",
        email: adminEmail,
        password: "password@123",
        about: "Global workspace administrator.",
      });
      console.log("✅ Admin user created successfully!");
    }
  } catch (error) {
    console.error("❌ Admin seeding failed:", error);
  }
};

connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
