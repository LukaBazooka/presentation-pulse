import { Menu } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = () => (
  <header className="bg-dark border-b border-primary/20 p-4 flex items-center justify-between border-b-[4px] border-b-dark">
    <SidebarTrigger>
      <Menu className="h-6 w-6 text-light hover:text-primary hover:bg-primary/20 rounded transition-all" />
    </SidebarTrigger>
  </header>
);

export default Header;