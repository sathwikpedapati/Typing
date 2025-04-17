require("dotenv").config();
console.log('Loaded Environment Variables:', {
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
}); // Debug log

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRoute");

const app = express();

app.use(cors({
  origin: 'https://typing-speed-frontend-hsxu.onrender.com',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== TEST ROUTE ==========
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

// ========== ROUTES ==========
app.use("/api/auth", authRouter);

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ========== MONGODB CONNECTION ==========
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ========== START SERVER ==========
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});