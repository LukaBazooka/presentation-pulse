import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, HelpCircle, Home } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarLink,
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
            {links.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                active={isLinkActive(link.href)}
                icon={link.icon}
              >
                {link.title}
              </SidebarLink>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;