import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from './AppSidebar';
import Header from './Header';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-dark">
      <div className="border-r-[4px] border-primary">
        <AppSidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  </SidebarProvider>
);

export default Layout;