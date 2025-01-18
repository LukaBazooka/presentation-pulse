import { useState, useRef } from 'react';
import Layout from '@/components/Layout';

const Index = () => {
  const [isPresenting, setIsPresenting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startPresentation = () => {
    setIsPresenting(true);
    // Start timer logic here
    timerRef.current = setInterval(() => {
      console.log('Timer tick');
    }, 1000);
  };

  const stopPresentation = () => {
    setIsPresenting(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))]">
        <button
          onClick={isPresenting ? stopPresentation : startPresentation}
          className="bg-primary hover:bg-primary-hover text-light px-8 py-4 rounded-lg text-xl font-semibold transition-colors"
        >
          {isPresenting ? 'Stop Presentation' : 'Start Presentation'}
        </button>
      </div>
    </Layout>
  );
};

export default Index;