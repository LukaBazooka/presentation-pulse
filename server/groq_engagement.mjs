import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";

// 1) Instantiate the OpenAI (Groq) client
const client = new OpenAI({
  apiKey: "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", // Replace with your API key or environment variable
  baseURL: "https://api.groq.com/openai/v1",
});

// Helper function to run FFmpeg commands
function runCommand(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: "inherit" });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command "${cmd} ${args.join(" ")}" failed with code ${code}`));
    });
  });
}

// Transcode video to MP4
async function transcodeVideo(inputPath, outputPath) {
  await runCommand("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-i",
    inputPath,
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-c:a",
    "aac",
    outputPath,
  ]);
}

// Get video duration
async function getVideoDuration(videoPath) {
  return new Promise((resolve, reject) => {
    const args = ["-hide_banner", "-i", videoPath, "-show_entries", "format=duration", "-v", "quiet", "-of", "csv=p=0"];
    const ffmpeg = spawn("ffprobe", args);

    let output = "";
    ffmpeg.stdout.on("data", (data) => {
      output += data;
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve(parseFloat(output.trim()));
      } else {
        reject(new Error(`Failed to get video duration for ${videoPath}`));
      }
    });
  });
}

// Extract a single frame at a specific timestamp
async function extractFrameAtTimestamp(videoPath, timeSec, outPath) {
  await runCommand("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-ss",
    timeSec.toString(),
    "-i",
    videoPath,
    "-frames:v",
    "1",
    outPath,
  ]);
}

// Slice audio segment from video
async function sliceAudioSegment(videoPath, startSec, endSec, outPath) {
  await runCommand("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-ss",
    startSec.toString(),
    "-to",
    endSec.toString(),
    "-i",
    videoPath,
    "-vn",
    "-acodec",
    "aac",
    outPath,
  ]);
}

// Transcribe audio using OpenAI's Whisper
async function getAudioTranscript(audioPath) {
  const transcription = await client.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: "distil-whisper-large-v3-en",
  });
  return transcription.text;
}

// Evaluate crowd engagement score from image
async function getCrowdScoreFromImage(imagePath) {
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  const messages = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `
Your role is to evaluate audience engagement based on the analysis of inputted images. Specifically, you will assess the engagement level of the crowd using criteria such as facial expressions, body language, and gaze direction.

Based on your analysis, provide an engagement score out of 10, where 10 represents an extremely engaged audience and 0 represents a completely disengaged audience. Return only valid JSON as {"score": <0..10>} with no extra text.
          `.trim(),
        },
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${base64Image}` },
        },
      ],
    },
  ];

  const response_format = { type: "json_object" };

  const resp = await client.chat.completions.create({
    model: "llama-3.2-11b-vision-preview",
    messages,
    temperature: 0.2,
    max_completion_tokens: 500,
    response_format,
  });

  const raw = resp.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from crowd engagement call");

  const parsed = JSON.parse(raw);
  if (typeof parsed.score !== "number") throw new Error("Invalid 'score' in JSON response");

  return parsed.score;
}

// Evaluate engagement from audio transcript
async function getAudioScoreFromTranscript(transcript) {
  const messages = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `
Your role is to evaluate audience engagement based on transcribed audio segments of a presentation. Provide an engagement score out of 10 based on the transcript.

Return only valid JSON as {"score": <0..10>} and no extra text.
Transcript:
${transcript}
          `.trim(),
        },
      ],
    },
  ];

  const response_format = { type: "json_object" };

  const resp = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
    temperature: 0.2,
    max_completion_tokens: 500,
    response_format,
  });

  const raw = resp.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from audio engagement call");

  const parsed = JSON.parse(raw);
  if (typeof parsed.score !== "number") throw new Error("Invalid 'score' in JSON response");

  return parsed.score;
}

// Unify scores by averaging crowd and audio scores
function unifyScores(crowdScore, audioScore) {
  return (crowdScore + audioScore) / 2;
}

// Main pipeline
(async function main() {
  try {
    const videoFilePath = process.argv[2];
    const outputFilePath = process.argv[3];
    if (!videoFilePath || !outputFilePath) throw new Error("Missing required arguments: video file or output file");

    console.log(`Processing video: ${videoFilePath}`);
    const FIXED_VIDEO = path.join(os.tmpdir(), `fixed_${uuidv4()}.mp4`);

    console.log("Transcoding video...");
    await transcodeVideo(videoFilePath, FIXED_VIDEO);

    const totalDuration = await getVideoDuration(FIXED_VIDEO);
    console.log(`Total video duration: ${totalDuration}s`);

    const segmentLength = 10;
    const fullSegments = Math.floor(totalDuration / segmentLength); // Only process full 10-second segments
    const finalScores = [];

    for (let segment = 0; segment < fullSegments; segment++) {
      const start = segment * segmentLength;
      const end = start + segmentLength;

      const framePath = path.join(os.tmpdir(), `frame_${uuidv4()}.jpg`);
      const audioPath = path.join(os.tmpdir(), `audio_${uuidv4()}.m4a`);

      try {
        console.log(`Processing segment ${start}-${end}s...`);

        console.log(`Extracting frame at ${end - 1}s...`);
        await extractFrameAtTimestamp(FIXED_VIDEO, end - 1, framePath);

        console.log(`Slicing audio segment: ${start}-${end}s...`);
        await sliceAudioSegment(FIXED_VIDEO, start, end, audioPath);

        const transcript = await getAudioTranscript(audioPath);
        const crowdScore = await getCrowdScoreFromImage(framePath);
        const audioScore = await getAudioScoreFromTranscript(transcript);
        const combined = unifyScores(crowdScore, audioScore);

        console.log(`Segment ${start}-${end}s => Crowd: ${crowdScore}, Audio: ${audioScore}, Combined: ${combined}`);
        finalScores.push({ segment: `${start}-${end}`, crowdScore, audioScore, combined });
      } catch (error) {
        console.error(`Error processing segment ${start}-${end}s:`, error.message);
      } finally {
        if (fs.existsSync(framePath)) fs.unlinkSync(framePath);
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
      }
    }

    console.log("Final scores:", finalScores);

    // Write the scores to the specified output file
    fs.writeFileSync(outputFilePath, JSON.stringify(finalScores, null, 2));
    console.log(`Scores saved to ${outputFilePath}`);
  } catch (err) {
    console.error("Error:", err.message);
  }
})();
