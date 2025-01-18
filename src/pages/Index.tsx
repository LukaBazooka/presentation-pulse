import React, { useState } from 'react';
import { Mic, Camera, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Layout from '@/components/Layout';

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [engagementScore] = useState(75); // Placeholder score

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
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

  const canStartPresentation = micActive && cameraActive;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto text-light">
        <h1 className="text-3xl font-bold mb-8 text-center">Use Pitchington to evaluate your presentation skills</h1>
        <div className="flex flex-col items-center gap-8">
          {/* Engagement Score Visualization */}
          <Users 
            className={`w-32 h-32 transition-colors duration-500 ${getScoreColor(engagementScore)} animate-pulse`}
          />

          {/* Device Controls */}
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className={`p-4 rounded-full ${micActive ? 'bg-green-500' : 'bg-red-500'} cursor-pointer`}>
                  <Mic className="h-6 w-6 text-light" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setMicActive(true)}>
                  Default Microphone
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className={`p-4 rounded-full ${cameraActive ? 'bg-green-500' : 'bg-red-500'} cursor-pointer`}>
                  <Camera className="h-6 w-6 text-light" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCameraActive(true)}>
                  Default Camera
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Timer Display */}
          {isRecording && (
            <div className="text-2xl font-mono">
              {formatTime(timer)}
            </div>
          )}

          {/* Start/Stop Button */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            disabled={!canStartPresentation}
            className={`px-8 py-4 text-light rounded-lg transition-colors text-lg font-semibold ${
              canStartPresentation 
                ? 'bg-primary hover:bg-primary-hover cursor-pointer' 
                : 'bg-gray-500 cursor-not-allowed opacity-50'
            }`}
          >
            {isRecording ? 'Stop Presentation' : 'Start Presentation'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;