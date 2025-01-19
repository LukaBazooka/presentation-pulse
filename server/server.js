import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import fs from "fs";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Upload endpoint
app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  const filePath = req.file.path;
  console.log(`File uploaded successfully: ${filePath}`);

  console.log("Processing video...");

  const groqScript = path.join(__dirname, "groq_engagement.mjs");
  const tempScoresPath = `/tmp/groq_scores_${Date.now()}.json`;

  const groqProcess = spawn("node", [groqScript, filePath, tempScoresPath]);

  groqProcess.stdout.on("data", (data) => {
    console.log(`Groq Script Output: ${data}`);
  });

  groqProcess.stderr.on("data", (data) => {
    console.error(`Groq Script Error: ${data}`);
  });

  groqProcess.on("close", (code) => {
    if (code === 0) {
      console.log(`Processing complete. Looking for scores in ${tempScoresPath}`);

      // Check if the scores JSON file exists
      if (fs.existsSync(tempScoresPath)) {
        try {
          const scores = JSON.parse(fs.readFileSync(tempScoresPath, "utf-8"));
          console.log("Extracted scores:", scores);

          // Delete the temporary JSON file
          fs.unlinkSync(tempScoresPath);

          // Send the scores and video duration back to the client
          return res.status(200).json({
            success: true,
            scores: scores,
            duration: scores.length * 10, // Assuming each segment is 10 seconds
          });
        } catch (err) {
          console.error("Failed to parse scores JSON:", err.message);
          return res.status(500).json({
            success: false,
            message: "Failed to parse scores JSON.",
          });
        }
      } else {
        console.error("No output JSON file found from Groq script.");
        return res.status(500).json({
          success: false,
          message: "No output JSON file found from Groq script.",
        });
      }
    } else {
      console.error("Groq script failed.");
      return res.status(500).json({
        success: false,
        message: "Error processing video.",
      });
    }
  });
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
