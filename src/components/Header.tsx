import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-dark border-b border-primary/20 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger>
          <Menu className="h-6 w-6 text-light hover:text-primary transition-colors" />
        </SidebarTrigger>
        <Link to="/" className="text-2xl font-bold text-light hover:text-primary transition-colors">
          Pitchington
        </Link>
      </div>
    </header>
  );
};

export default Header;