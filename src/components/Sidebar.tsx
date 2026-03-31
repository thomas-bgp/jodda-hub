"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Package,
  Store,
  Bot,
  Link as LinkIcon,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const mainItems: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "DRE", icon: FileText, href: "/dashboard/dre" },
  { label: "Análise de Pedidos", icon: ShoppingCart, href: "/dashboard/pedidos" },
  { label: "Gestão de Produtos", icon: Package, href: "/dashboard/produtos" },
];

const sections: MenuSection[] = [
  {
    title: "Gestão Marketplaces",
    items: [
      { label: "Gestão Mercado Livre", icon: Store, href: "/dashboard/mercado-livre" },
      { label: "Gestão Shopee", icon: Store, href: "/dashboard/shopee" },
    ],
  },
];

const bottomItems: MenuItem[] = [
  { label: "Respostas por IA", icon: Bot, href: "/dashboard/ia" },
  { label: "Integrações", icon: LinkIcon, href: "/dashboard/integracoes" },
  { label: "Configurações", icon: Settings, href: "/dashboard/configuracoes" },
  { label: "FAQ", icon: HelpCircle, href: "/dashboard/faq" },
];

const recentOrders = [
  { id: "#4832", customer: "Maria Silva", amount: "R$ 189,90", time: "há 5 min" },
  { id: "#4831", customer: "João Santos", amount: "R$ 324,50", time: "há 12 min" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const renderItem = (item: MenuItem) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`
          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
          ${
            active
              ? "bg-white/15 text-white shadow-sm"
              : "text-indigo-100 hover:bg-white/10 hover:text-white"
          }
        `}
        title={collapsed ? item.label : undefined}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={`
        sidebar fixed top-0 left-0 h-screen z-30 flex flex-col
        bg-gradient-to-b from-indigo-700 via-indigo-600 to-indigo-800
        ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Jodda</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-indigo-200 hover:bg-white/10 hover:text-white transition-colors"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-4 space-y-1">
        {mainItems.map(renderItem)}

        {sections.map((section) => (
          <div key={section.title} className="pt-4">
            {!collapsed && (
              <p className="px-3 pb-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                {section.title}
              </p>
            )}
            {collapsed && <div className="border-t border-white/10 my-2" />}
            <div className="space-y-1">{section.items.map(renderItem)}</div>
          </div>
        ))}

        <div className="pt-4 border-t border-white/10 mt-4 space-y-1">
          {bottomItems.map(renderItem)}
        </div>
      </nav>

      {/* Recent Orders */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-2">
              Vendas Recentes
            </p>
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="text-white font-medium">
                      {order.id} - {order.customer}
                    </p>
                    <p className="text-indigo-300">{order.time}</p>
                  </div>
                  <span className="text-emerald-300 font-semibold">{order.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
