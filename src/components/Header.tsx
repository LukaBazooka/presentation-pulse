import { Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./AppSidebar";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="bg-dark border-b border-primary/20 p-4 flex items-center justify-between border-b-[4px] border-b-dark">
      <div className="flex items-center gap-4">
        <SidebarTrigger>
          <Menu className="h-6 w-6 text-light hover:text-primary hover:bg-primary/20 rounded transition-all" />
        </SidebarTrigger>
      </div>
      
      {location.pathname === "/metrics" && (
        <Button
          onClick={() => navigate("/")}
          variant="secondary"
          className="text-light"
        >
          Present Again
        </Button>
      )}
    </header>
  );
};

export default Header;