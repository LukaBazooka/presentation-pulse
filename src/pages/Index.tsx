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
  const streamRef = useRef<MediaStream | null>(null);

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

  const startDevices = async () => {
    try {
      console.log('Requesting media devices...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true 
      });
      
      console.log('Media devices accessed successfully');
      if (videoRef.current) {
        console.log('Setting video stream...');
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setMicActive(true);
        setIsRecording(true);
        toast.success('Camera and microphone connected successfully');
      } else {
        console.error('Video reference not found');
      }
    } catch (error) {
      console.error('Error accessing devices:', error);
      toast.error('Failed to access camera and microphone');
      setCameraActive(false);
      setMicActive(false);
    }
  };

  const stopDevices = () => {
    if (streamRef.current) {
      console.log('Stopping all tracks...');
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setCameraActive(false);
      setMicActive(false);
      setIsRecording(false);
      navigate('/metrics', { 
        state: { 
          duration: timer,
          stream: streamRef.current
        } 
      });
    }
  };

  const handlePresentationToggle = async () => {
    console.log('Toggling presentation, current state:', isRecording);
    if (isRecording) {
      stopDevices();
    } else {
      await startDevices();
    }
  };

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
            <div className={`p-4 rounded-full ${micActive ? 'bg-primary' : 'bg-red-500'}`}>
              <Mic className="h-6 w-6 text-light" />
            </div>

            <div className={`p-4 rounded-full ${cameraActive ? 'bg-primary' : 'bg-red-500'}`}>
              <Camera className="h-6 w-6 text-light" />
            </div>
          </div>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full max-w-2xl rounded-lg ${cameraActive ? 'block' : 'hidden'}`}
          />

          <button
            onClick={handlePresentationToggle}
            className="px-8 py-4 text-light rounded-lg transition-colors text-lg font-semibold bg-primary hover:bg-primary-hover cursor-pointer"
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