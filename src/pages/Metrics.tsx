import React from 'react';
import Layout from '@/components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const data = [
  { time: '0:00', score: 65 },
  { time: '1:00', score: 75 },
  { time: '2:00', score: 85 },
  { time: '3:00', score: 70 },
  { time: '4:00', score: 90 },
];

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

const Metrics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const duration = location.state?.duration || 0;

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
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 40}`,
                    strokeDashoffset: `${2 * Math.PI * 40 * (1 - 0.75)}`,
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%',
                  }}
                />
                <text
                  x="50"
                  y="50"
                  className="text-2xl font-bold"
                  textAnchor="middle"
                  dy=".3em"
                  fill="currentColor"
                >
                  75%
                </text>
              </svg>
            </div>
            <p className="text-center text-lg mt-4 text-gray-300">Your presentation rating</p>
          </div>

          {/* Engagement Graph */}
          <div className="bg-dark/50 p-6 rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
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
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
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
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary-hover text-light font-semibold text-lg"
          >
            Present Again
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Metrics;