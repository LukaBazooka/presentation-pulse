import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is already enabled
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      toast({
        title: "Dark mode enabled",
        description: "The application is now in dark mode.",
      });
    } else {
      document.documentElement.classList.remove('dark');
      toast({
        title: "Light mode enabled",
        description: "The application is now in light mode.",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-light mb-8">Settings</h1>
        
        <div className="bg-dark/50 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="h-6 w-6 text-light" />
              ) : (
                <Sun className="h-6 w-6 text-light" />
              )}
              <span className="text-light text-lg">Dark Mode</span>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={toggleDarkMode}
              className="border-primary hover:border-primary/80"
            >
              {isDarkMode ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;