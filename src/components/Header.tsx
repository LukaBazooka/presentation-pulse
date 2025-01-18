import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-dark border-b border-primary/20 p-4 flex items-center justify-between border-b-[4px] border-b-dark">
      <div className="flex items-center gap-4">
        <SidebarTrigger>
          <Menu className="h-6 w-6 text-light hover:text-primary transition-colors" />
        </SidebarTrigger>
      </div>
      <button 
        className="text-light hover:text-primary transition-colors"
        onClick={() => console.log('Notifications clicked')}
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
      </button>
    </header>
  );
};

export default Header;