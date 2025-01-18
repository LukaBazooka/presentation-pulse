import React from 'react';
import Layout from '@/components/Layout';

const Help = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto text-light">
        <h1 className="text-3xl font-bold mb-8">Help & Guidelines</h1>
        
        <div className="space-y-8">
          <section className="bg-dark/50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            <p className="text-gray-300">
              Welcome to Pitchington! This tool helps you improve your presentation skills through real-time feedback and analytics.
            </p>
          </section>

          <section className="bg-dark/50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-300">
              <li>Ensure your camera and microphone are properly connected</li>
              <li>Click "Start Presentation" to begin recording</li>
              <li>Present your content naturally</li>
              <li>Click "Stop Presentation" when finished</li>
              <li>Review your metrics and suggested improvements</li>
            </ol>
          </section>

          <section className="bg-dark/50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Tips for Success</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Maintain good lighting for better camera detection</li>
              <li>Speak clearly and at a consistent volume</li>
              <li>Position yourself centered in the camera frame</li>
              <li>Review your metrics after each session to track improvement</li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Help;