import React, { useState, useEffect, useRef } from 'react';
import { Mic, Camera, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Layout from '@/components/Layout';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [engagementScore] = useState(75);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-red-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        toast.success('Camera connected successfully');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const handlePresentationToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      stopCamera();
      navigate('/metrics', { state: { duration: timer } });
    } else {
      setIsRecording(true);
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
          <Users 
            className={`w-32 h-32 transition-colors duration-500 ${
              isRecording ? `${getScoreColor(engagementScore)} animate-pulse` : 'text-gray-400'
            }`}
          />

          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className={`p-4 rounded-full ${micActive ? 'bg-primary' : 'bg-red-500'} cursor-pointer`}>
                  <Mic className="h-6 w-6 text-light" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => setMicActive(true)}>
                  Default Microphone
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className={`p-4 rounded-full ${cameraActive ? 'bg-primary' : 'bg-red-500'} cursor-pointer`}>
                  <Camera className="h-6 w-6 text-light" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={startCamera}>
                  Default Camera
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {videoRef.current && cameraActive && (
            <div className="w-full max-w-md rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {canStartPresentation && (
            <p className="text-light text-lg">Ready to present!</p>
          )}

          <button
            onClick={handlePresentationToggle}
            disabled={!canStartPresentation}
            className={`px-8 py-4 text-light rounded-lg transition-colors text-lg font-semibold ${
              canStartPresentation 
                ? 'bg-primary hover:bg-primary-hover cursor-pointer' 
                : 'bg-gray-500 cursor-not-allowed opacity-50'
            }`}
          >
            {isRecording ? 'Stop Presentation' : 'Start Presentation'}
          </button>

          {isRecording && (
            <div className="text-2xl font-mono">
              {formatTime(timer)}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;