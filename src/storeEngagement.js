import { addEngagementNumber } from './database'; // Import the function to add engagement numbers

const startStoringEngagement = () => {
  setInterval(() => {
    const engagementNumber = Math.floor(Math.random() * (95 - 60) + 60); // Generate a random score between 60 and 95
    addEngagementNumber(engagementNumber); // Add the engagement number to the database
  }, 10000); // Run every 10 seconds
};

export default startStoringEngagement;
