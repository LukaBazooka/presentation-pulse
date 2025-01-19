import React from "react";
import Layout from "@/components/Layout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const getScoreColor = (score: number) => {
  if (score < 50) return "#ea384c";
  if (score < 70) return "#F97316";
  return "#10B981";
};

const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }
};

const calculateAverageScore = (scores: Array<{ combined: number }>) => {
  const total = scores.reduce((sum, { combined }) => sum + combined, 0);
  return (total / scores.length).toFixed(1);
};

const Metrics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scores, duration } = location.state || {};

  if (!scores || !duration) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto text-light text-center">
          <h1 className="text-3xl font-bold mb-8">Try out the presentation tool to see your metrics!</h1>
          <Button
            onClick={() => navigate("/")}
            className="px-8 py-4 text-light rounded-lg transition-colors text-lg font-semibold bg-primary hover:bg-primary-hover"
          >
            Start Presenting
          </Button>
        </div>
      </Layout>
    );
  }

  const averageScore = calculateAverageScore(scores);
  const radialColor = getScoreColor(Number(averageScore));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Number(averageScore) / 10);

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
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
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
                  {Number(averageScore) * 10}%
                </text>
              </svg>
            </div>
            <p className="text-center text-lg mt-4 text-gray-300">Your average engagement score</p>
          </div>

          {/* Engagement Graph */}
          <div className="bg-dark/50 p-6 rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="segment" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#222", border: "none" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="combined"
                  stroke={radialColor}
                  strokeWidth={2}
                  dot={{ r: 4 }}
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
            {["Improve audience engagement", "Speak more clearly", "Use fewer filler words"].map(
              (improvement, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  {improvement}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Present Again Button */}
        <div className="flex justify-center mt-16">
          <Button
            onClick={() => navigate("/")}
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
