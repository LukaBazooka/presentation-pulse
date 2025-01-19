import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";

// 1) Instantiate the OpenAI (Groq) client
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,  // or a string if you want
  baseURL: "https://api.groq.com/openai/v1",
});

// ---------------------------------------------------------------------
// Helper: runCommand => call FFmpeg via child_process
// ---------------------------------------------------------------------
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

// ---------------------------------------------------------------------
// fixVideoFile: remove extra audio streams => test_fixed.mp4
// ---------------------------------------------------------------------
async function fixVideoFile(inputPath, outputPath) {
  await runCommand("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-i",
    inputPath,
    "-map",
    "0:v:0",
    "-map",
    "0:a:0",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-strict",
    "-2",
    outputPath,
  ]);
}

// ---------------------------------------------------------------------
// extractFrameAtTimestamp: single frame at timeSec => .jpg
// ---------------------------------------------------------------------
async function extractFrameAtTimestamp(videoPath, timeSec, outPath) {
  await runCommand("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-ss",
    String(timeSec),
    "-i",
    videoPath,
    "-frames:v",
    "1",
    outPath,
  ]);
}

// ---------------------------------------------------------------------
// sliceAudioSegment: subclip [start, end) => .m4a
// ---------------------------------------------------------------------
async function sliceAudioSegment(videoPath, startSec, endSec, outPath) {
  await runCommand("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-ss",
    String(startSec),
    "-to",
    String(endSec),
    "-i",
    videoPath,
    "-vn",
    "-acodec",
    "aac",
    "-strict",
    "-2",
    "-b:a",
    "192k",
    outPath,
  ]);
}

// ---------------------------------------------------------------------
// getAudioTranscript: transcribe snippet with Groq’s Whisper
// ---------------------------------------------------------------------
async function getAudioTranscript(audioPath) {
  const transcription = await client.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: "distil-whisper-large-v3-en", // or your choice
  });
  return transcription.text;
}

// ---------------------------------------------------------------------
// getCrowdScoreFromImage: single user message with the image + instructions
// ---------------------------------------------------------------------
async function getCrowdScoreFromImage(imagePath) {
  // 1) Convert image to Base64
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  // 2) Single user message combining instructions + the data URI
  const messages = [
    {
      role: "user",
      content: [
        {
          type: "text",
          // Merged instructions:
          text: `
Your role is to evaluate audience engagement based on the analysis of inputted images. Specifically, you will assess the engagement level of the crowd using criteria such as facial expressions, body language, and gaze direction. Analyze facial expressions for signs of attentiveness, interest, or distraction, assess body language for posture, gestures, and overall physical activity, and evaluate gaze direction to determine whether individuals are focused on the speaker or presentation area.

Based on your analysis, provide an engagement score out of 10, where 10 represents an extremely engaged audience and 0 represents a completely disengaged audience. Focus on visible individuals while ignoring areas of the image with no relevant data, such as empty chairs or background objects. Return only valid JSON as {"score": <0..10>} with no extra text.

Here's the image:
          `.trim(),
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`,
          },
        },
      ],
    },
  ];

  // 3) Use "json_object" response_format for JSON mode
  const response_format = { type: "json_object" };

  const resp = await client.chat.completions.create({
    model: "llama-3.2-11b-vision-preview",
    messages,
    temperature: 0.2,
    max_completion_tokens: 500,
    response_format,
  });

  // 4) Parse JSON
  const raw = resp.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("No response from crowd engagement call");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error("Crowd LLM did not return valid JSON. Full response:", raw);
    throw err;
  }

  if (typeof parsed.score !== "number") {
    throw new Error(`No valid 'score' found. Got: ${JSON.stringify(parsed)}`);
  }
  return parsed.score;
}

// ---------------------------------------------------------------------
// getAudioScoreFromTranscript: single user message with instructions + transcript
// ---------------------------------------------------------------------
async function getAudioScoreFromTranscript(transcript) {
  const messages = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `
Your role is to evaluate audience engagement based on transcribed audio segments of a presentation. Specifically, you will analyze the provided text to distinguish between statements made by the presenter and any questions asked by the audience. This requires a thorough understanding of context, conversational flow, and linguistic cues. For audience questions, assess their relevance to the presentation topic and their level of engagement. Questions that demonstrate curiosity, interest, or meaningful interaction should receive a higher score, while questions indicating confusion, misunderstanding, or lack of interest should receive a lower score. If no audience questions are present in the segment, the engagement score should be 0.

Provide an engagement score out of 10, where 10 represents highly engaging and relevant audience interaction, and 0 represents no interaction or irrelevant engagement. Return only valid JSON as {"score": <0..10>} and no extra text.

Here is the transcript:
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
  if (!raw) {
    throw new Error("No response from audio engagement call");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error("Audio LLM did not return valid JSON. Full response:", raw);
    throw err;
  }

  if (typeof parsed.score !== "number") {
    throw new Error(`No valid 'score' found in audio response. Got: ${JSON.stringify(parsed)}`);
  }
  return parsed.score;
}

// ---------------------------------------------------------------------
// unifyScores => simple average
// ---------------------------------------------------------------------
function unifyScores(crowdScore, audioScore) {
  return (crowdScore + audioScore) / 2;
}

// ---------------------------------------------------------------------
// MAIN pipeline
// ---------------------------------------------------------------------
(async function main() {
  try {
    const RAW_VIDEO = "test.mp4";
    const FIXED_VIDEO = "test_fixed.mp4";

    console.log("Fixing video...");
    await fixVideoFile(RAW_VIDEO, FIXED_VIDEO);
    console.log(`Video fixed -> ${FIXED_VIDEO}`);

    const totalDuration = 40;
    const segmentLength = 10;

    const finalScores = [];

    for (let start = 0; start < totalDuration; start += segmentLength) {
      const end = start + segmentLength;

      const framePath = path.join(os.tmpdir(), `frame_${uuidv4()}.jpg`);
      const audioPath = path.join(os.tmpdir(), `audio_${uuidv4()}.m4a`);

      // 1) Extract frame at the end of interval
      await extractFrameAtTimestamp(FIXED_VIDEO, end, framePath);

      // 2) Slice audio
      await sliceAudioSegment(FIXED_VIDEO, start, end, audioPath);

      // 3) Transcribe
      const transcript = await getAudioTranscript(audioPath);

      // 4) Score crowd
      const crowdScore = await getCrowdScoreFromImage(framePath);

      // 5) Score audio
      const audioScore = await getAudioScoreFromTranscript(transcript);

      // 6) Combine
      const combined = unifyScores(crowdScore, audioScore);

      console.log(
        `Segment ${start}-${end}s => crowd=${crowdScore.toFixed(2)}, audio=${audioScore.toFixed(
          2
        )}, combined=${combined.toFixed(2)}`
      );

      fs.unlinkSync(framePath);
      fs.unlinkSync(audioPath);

      finalScores.push({
        segment: `${start}-${end}`,
        crowdScore,
        audioScore,
        combined,
      });
    }

    console.log("All segments processed. Final scores:", finalScores);
  } catch (err) {
    console.error(err);
  }
})();
