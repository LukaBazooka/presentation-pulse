import React, { useState, useEffect, useRef } from "react";
import { Mic, Camera, Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Layout from "@/components/Layout";

const Index = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [engagementScores, setEngagementScores] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = () => {
    console.log("Requesting media devices...");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("Media stream acquired:", stream.getTracks());

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const options = { mimeType: "video/webm; codecs=vp8" };
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          console.log("Data available:", event.data.size, "bytes");
          if (event.data.size > 0) {
            recordedChunks.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          console.log("Recording stopped.");

          if (recordedChunks.current.length > 0) {
            console.log("Recorded chunks:", recordedChunks.current.length);

            const videoBlob = new Blob(recordedChunks.current, { type: "video/webm" });
            const formData = new FormData();
            formData.append("video", videoBlob, "presentation.webm");

            console.log("Uploading video...");
            try {
              const response = await fetch("http://localhost:3001/upload", {
                method: "POST",
                body: formData,
              });

              if (!response.ok) {
                throw new Error(`Upload failed with status ${response.status}`);
              }

              const result = await response.json();
              console.log("Upload result:", result);
              setEngagementScores(JSON.stringify(result, null, 2));
            } catch (error) {
              console.error("Upload failed:", error);
            }
          } else {
            console.warn("No recorded chunks available to upload.");
          }

          // Clean up
          stream.getTracks().forEach((track) => track.stop());
          setIsRecording(false);
          recordedChunks.current = [];
        };

        mediaRecorder.start();
        console.log("Recording started.");
        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing camera/mic:", error);
      });
  };

  const stopRecording = () => {
    console.log("Stopping recording...");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handlePresentationToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const canStartPresentation = micActive && cameraActive;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto text-light">
        <h1 className="text-3xl font-bold mb-16 text-center">
          {isRecording ? "Good luck on your presentation!" : "Use pitchington to evaluate your presentation skills."}
        </h1>

        <div className="flex flex-col items-center gap-8">
          <video ref={videoRef} className="w-full max-w-lg bg-black rounded-lg" autoPlay playsInline muted></video>

          <Users2
            className={`w-32 h-32 transition-colors duration-500 ${
              isRecording ? "text-green-500 animate-pulse" : "text-gray-400"
            }`}
          />

          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  className={`p-4 rounded-full ${micActive ? "bg-primary" : "bg-red-500"} cursor-pointer`}
                  onClick={() => setMicActive((prev) => !prev)}
                >
                  <Mic className="h-6 w-6 text-light" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => setMicActive(true)}>Default Microphone</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  className={`p-4 rounded-full ${cameraActive ? "bg-primary" : "bg-red-500"} cursor-pointer`}
                  onClick={() => setCameraActive((prev) => !prev)}
                >
                  <Camera className="h-6 w-6 text-light" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => setCameraActive(true)}>Default Camera</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {canStartPresentation && <p className="text-light text-lg">Ready to present!</p>}

          <button
            onClick={handlePresentationToggle}
            disabled={!canStartPresentation}
            className={`px-8 py-4 text-light rounded-lg transition-colors text-lg font-semibold ${
              canStartPresentation
                ? "bg-primary hover:bg-primary-hover cursor-pointer"
                : "bg-gray-500 cursor-not-allowed opacity-50"
            }`}
          >
            {isRecording ? "Stop Presentation" : "Start Presentation"}
          </button>

          {isRecording && <div className="text-2xl font-mono">{formatTime(timer)}</div>}

          {engagementScores && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Engagement Scores</h2>
              <pre className="bg-gray-100 p-4 rounded-lg text-black">{engagementScores}</pre>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
