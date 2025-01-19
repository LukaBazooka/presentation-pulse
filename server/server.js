import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  const filePath = req.file.path;
  console.log(`File uploaded successfully: ${filePath}`);

  console.log("Processing video...");

  const groqScript = path.join(__dirname, "groq_engagement.mjs");
  const groqProcess = spawn("node", [groqScript, filePath]);

  groqProcess.stdout.on("data", (data) => {
    console.log(`Groq Script Output: ${data}`);
  });

  groqProcess.stderr.on("data", (data) => {
    console.error(`Groq Script Error: ${data}`);
  });

  groqProcess.on("close", (code) => {
    if (code === 0) {
      res.status(200).json({ success: true, message: "Video processed successfully" });
    } else {
      res.status(500).json({ success: false, message: "Error processing video" });
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
