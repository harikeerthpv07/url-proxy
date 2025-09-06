import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error:", err));

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortCode: String,
});
const Url = mongoose.model("Url", urlSchema);

function generateShortCode() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

app.post("/api/shorten", async (req, res) => {
  const { url } = req.body;
  const shortCode = generateShortCode();

  const newUrl = new Url({
    originalUrl: url,
    shortCode: shortCode,
  });

  await newUrl.save();
  res.json({ shortCode });
});

app.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  const urlDoc = await Url.findOne({ shortCode });

  if (urlDoc) {
    res.redirect(urlDoc.originalUrl);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
