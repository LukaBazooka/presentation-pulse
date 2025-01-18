import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, HelpCircle, Home } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const location = useLocation();

  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  const links = [
    {
      title: 'Home',
      icon: Home,
      href: '/',
    },
    {
      title: 'Metrics',
      icon: BarChart3,
      href: '/metrics',
    },
    {
      title: 'Help',
      icon: HelpCircle,
      href: '/help',
    },
  ];

  return (
    <Sidebar className="bg-dark">
      <div className="p-4">
        <Link to="/" className="text-2xl font-bold text-light hover:text-primary transition-colors">
          Pitchington
        </Link>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    className={isLinkActive(link.href) ? "text-primary" : "text-light"}
                  >
                    <Link to={link.href} className="flex items-center gap-2">
                      <link.icon className="h-5 w-5" />
                      <span>{link.title}</span>
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