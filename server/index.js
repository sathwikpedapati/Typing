require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRoute");

const app = express();

const cors = require('cors');

const corsOptions = {
  origin: 'https://typing-ebon.vercel.app',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("🚀 API is running");
});


app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});