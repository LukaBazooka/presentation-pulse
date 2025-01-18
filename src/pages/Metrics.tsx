import React from 'react';
import Layout from '@/components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const Metrics = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto text-light">
        <h1 className="text-3xl font-bold mb-8">Here's how you did</h1>
        
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
                  stroke="#1EAEDB" 
                  strokeWidth={2}
                  dot={{ fill: '#1EAEDB' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Improvements Section */}
        <div className="bg-dark/50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">What to improve for next time</h2>
          <ul className="space-y-2">
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
      </div>
    </Layout>
  );
};

export default Metrics;