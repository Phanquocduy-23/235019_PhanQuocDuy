
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Cau hinh Middleware
app.use(cors());
app.use(express.json());

// API kiem tra trang thai backend
app.get("/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;

  return res.status(connected ? 200 : 503).json({
    status: connected ? "OK" : "Database disconnected",
    database: connected ? "connected" : "disconnected"
  });
});

// API trang chu
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Book Management API",
    student: "235019_PhanQuocDuy"
  });
});

// API quan ly sach
app.use("/api/books", bookRoutes);

// Xu ly loi JSON khong hop le
app.use((err, req, res, next) => {
  console.error(err.message);

  return res.status(400).json({
    message: "Yeu cau khong hop le"
  });
});

// Ket noi MongoDB Atlas
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Chua cau hinh MONGO_URI trong .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas connected");
    console.log("Database:", mongoose.connection.name);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startServer();
