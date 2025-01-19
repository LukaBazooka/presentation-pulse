import React from 'react';
import Layout from '@/components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const generateTimeData = (duration: number) => {
  const intervals = 5;
  const timeStep = Math.floor(duration / (intervals - 1));
  const data = [];

  for (let i = 0; i < intervals; i++) {
    const timeInSeconds = i * timeStep;
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const timeLabel = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const score = Math.floor(Math.random() * (100 - 30) + 30);
    
    data.push({
      time: timeLabel,
      score: score
    });
  }

  return data;
};

const calculateAverageScore = (data: Array<{ score: number }>) => {
  const sum = data.reduce((acc, point) => acc + point.score, 0);
  return Math.round(sum / data.length);
};

const improvements = [
  "Try to vary your tone more during key points",
  "Make more eye contact with the camera",
  "Reduce filler words like 'um' and 'uh'"
];

const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
};

const getScoreColor = (score: number) => {
  if (score < 50) return '#ea384c';
  if (score < 70) return '#F97316';
  return '#10B981';
};

const Metrics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const duration = location.state?.duration;
  const [selectedPoint, setSelectedPoint] = React.useState<{ x: number; y: number } | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  if (!duration) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto text-light text-center">
          <h1 className="text-3xl font-bold mb-8">Try out the presentation tool to see your metrics!</h1>
          <Button 
            onClick={() => navigate('/')}
            className="px-8 py-4 text-light rounded-lg transition-colors text-lg font-semibold bg-primary hover:bg-primary-hover"
          >
            Start Presenting
          </Button>
        </div>
      </Layout>
    );
  }

  const graphData = generateTimeData(duration);
  const rating = calculateAverageScore(graphData);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - rating / 100);
  const radialColor = getScoreColor(rating);

  const handleDotClick = (event: any, payload: any) => {
    setSelectedPoint({ x: event.cx, y: event.cy });
    setIsPopoverOpen(true);
  };

  const getRetentionText = (score: number) => {
    if (score > 70) return "High retention";
    if (score >= 50) return "Medium retention";
    return "Low retention";
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto text-light">
        <h1 className="text-3xl font-bold mb-8">Here's how you did.</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Engagement Score */}
          <div className="bg-dark/50 p-6 rounded-lg">
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-700 stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                  r={radius}
                  cx="50"
                  cy="50"
                />
                <circle
                  style={{
                    stroke: radialColor,
                    strokeDasharray: circumference,
                    strokeDashoffset: offset,
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%',
                  }}
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="transparent"
                  r={radius}
                  cx="50"
                  cy="50"
                />
                <text
                  x="50"
                  y="50"
                  className="text-2xl font-bold"
                  textAnchor="middle"
                  dy=".3em"
                  fill="currentColor"
                >
                  {rating}%
                </text>
              </svg>
            </div>
            <p className="text-center text-lg mt-4 text-gray-300">Your presentation rating</p>
          </div>

          {/* Engagement Graph */}
          <div className="bg-dark/50 p-6 rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: 'none' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke={radialColor}
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    return (
                      <Popover open={isPopoverOpen && selectedPoint?.x === cx}>
                        <PopoverTrigger asChild>
                          <circle
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill={radialColor}
                            stroke="none"
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handleDotClick(props, payload)}
                          />
                        </PopoverTrigger>
                        <PopoverContent 
                          className="w-48 bg-dark text-light border-none"
                          onMouseLeave={() => setIsPopoverOpen(false)}
                        >
                          <div className="p-2">
                            <h3 className="font-bold mb-2">{getRetentionText(payload.score)}</h3>
                            <p className="font-semibold mb-2">Time: {payload.time}</p>
                            <p>Score: {payload.score}</p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Duration Heading */}
        <h2 className="text-2xl font-semibold text-center mb-8">
          Your presentation was {formatDuration(duration)} long.
        </h2>

        {/* Improvements Section */}
        <div className="bg-dark/50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">What to improve for next time</h2>
          <ul className="space-y-4">
            {improvements.map((improvement, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                {improvement}
              </li>
            ))}
          </ul>
        </div>

        {/* Present Again Button */}
        <div className="flex justify-center mt-16">
          <Button 
            onClick={() => navigate('/')}
            className="px-8 py-4 text-light rounded-lg transition-colors text-lg font-semibold bg-primary hover:bg-primary-hover"
          >
            Present Again
          </Button>
        </div>

      </div>
    </Layout>
  );
};

export default Metrics;
