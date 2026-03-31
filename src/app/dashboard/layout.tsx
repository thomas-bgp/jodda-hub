"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(260);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const sidebar = document.querySelector("aside");
      if (sidebar) {
        setSidebarWidth(sidebar.offsetWidth);
      }
    });

    const sidebar = document.querySelector("aside");
    if (sidebar) {
      setSidebarWidth(sidebar.offsetWidth);
      observer.observe(sidebar, { attributes: true, attributeFilter: ["class"] });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div
        className="transition-all duration-200 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
