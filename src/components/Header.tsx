"use client";

import { useState, useEffect } from "react";
import { Search, MessageCircle, Bell, ChevronDown } from "lucide-react";

export default function Header() {
  const [nickname, setNickname] = useState("Usuario");
  const [initials, setInitials] = useState("U");

  useEffect(() => {
    async function fetchSeller() {
      try {
        const res = await fetch("/api/mercadolivre/seller");
        if (res.ok) {
          const data = await res.json();
          if (data.nickname) {
            setNickname(data.nickname);
            setInitials(
              data.nickname
                .split(" ")
                .map((w: string) => w[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()
            );
          }
        }
      } catch {
        // Not connected, keep defaults
      }
    }

    fetchSeller();
  }, []);

  return (
    <header className="sticky top-0 z-20 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar pedidos, produtos, clientes..."
          className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors outline-none"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-4">
        {/* Support - WhatsApp */}
        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Suporte</span>
        </a>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200" />

        {/* User */}
        <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-700">{nickname}</p>
            <p className="text-xs text-gray-400">Vendedor</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
        </button>
      </div>
    </header>
  );
}
