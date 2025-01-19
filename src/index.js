import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import setupDatabase from './setupDatabase';
import { getEngagementNumbers } from './database';

setupDatabase();

const Root = () => {
  const [engagementNumbers, setEngagementNumbers] = useState([]);
  const [isPresentationRunning, setIsPresentationRunning] = useState(false);

  useEffect(() => {
    const fetchEngagementNumbers = async () => {
      const numbers = await getEngagementNumbers();
      setEngagementNumbers(numbers);
    };

    fetchEngagementNumbers();
  }, []);

  const startPresentation = () => {
    setIsPresentationRunning(true);
    import('./storeEngagement').then(({ default: startStoringEngagement }) => {
      startStoringEngagement();
    });
  };

  return (
    <React.StrictMode>
      <App 
        engagementNumbers={engagementNumbers} 
        isPresentationRunning={isPresentationRunning} 
        startPresentation={startPresentation} 
      />
    </React.StrictMode>
  );
};

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);

// ...existing code...
