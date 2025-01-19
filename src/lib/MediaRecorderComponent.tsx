import React, { useRef } from "react";

interface MediaRecorderComponentProps {
  onStart: () => void;
  onStop: () => void;
  isRecording: boolean;
}

const MediaRecorderComponent: React.FC<MediaRecorderComponentProps> = ({
  onStart,
  onStop,
  isRecording,
}) => {
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  const handleStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      onStart();
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleStop = () => {
    if (videoPreviewRef.current?.srcObject) {
      const tracks = (videoPreviewRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    onStop();
  };

  React.useEffect(() => {
    if (isRecording) {
      handleStart();
    } else {
      handleStop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "300px", // Fixed width
        height: "300px", // Set height equal to width to make it a square
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        borderRadius: "10px",
        padding: "15px",
        color: "white",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      {/* Video Preview */}
      <video
        ref={videoPreviewRef}
        autoPlay
        muted
        style={{
          width: "100%",
          height: "100%", // Match height to container
          objectFit: "cover",
          borderRadius: "8px",
          backgroundColor: "black",
        }}
      />
    </div>
  );
};

export default MediaRecorderComponent;