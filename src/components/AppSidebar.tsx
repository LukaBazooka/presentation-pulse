import { Presentation, BarChart3, HelpCircle, Mic, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Present",
    url: "/",
    icon: Presentation,
  },
  {
    title: "Metrics",
    url: "/metrics",
    icon: BarChart3,
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
  },
  {
    title: "About",
    url: "/about",
    icon: Users,
  },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar className="bg-dark border-r border-primary/20">
      <div className="p-4">
        <Link to="/" className="text-4xl font-bold text-white hover:text-primary transition-colors flex items-center gap-2">
          <Mic className="h-12 w-12" />
          pitchington
        </Link>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${location.pathname === item.url ? "text-primary" : "text-light"} p-3 transition-colors hover:text-primary`}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-6 w-6" />
                      <span className="text-lg">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;