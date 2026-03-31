"use client";

import {
  DollarSign,
  ShoppingCart,
  Receipt,
  Package,
  TrendingUp,
  TrendingDown,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

const stats = [
  {
    label: "Faturamento",
    value: "R$ 336.063,29",
    change: "+12,5%",
    up: true,
    icon: DollarSign,
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Pedidos",
    value: "2.079",
    change: "+8,3%",
    up: true,
    icon: ShoppingCart,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    label: "Ticket Médio",
    value: "R$ 154,34",
    change: "-2,1%",
    up: false,
    icon: Receipt,
    color: "from-violet-500 to-violet-600",
  },
  {
    label: "Produtos",
    value: "3.388",
    change: "+5,7%",
    up: true,
    icon: Package,
    color: "from-purple-500 to-purple-600",
  },
];

const topProducts = [
  { name: "Fone Bluetooth Pro X", price: "R$ 89,90", sold: 342 },
  { name: "Capinha iPhone 15 Ultra", price: "R$ 34,90", sold: 287 },
  { name: "Carregador Turbo 65W", price: "R$ 129,90", sold: 231 },
  { name: "Smartwatch Fit Band 7", price: "R$ 199,90", sold: 198 },
  { name: "Cabo USB-C Premium 2m", price: "R$ 24,90", sold: 176 },
  { name: "Película Galaxy S24", price: "R$ 19,90", sold: 164 },
];

const marketplaces = [
  { name: "Mercado Livre", pct: 45, color: "bg-yellow-400" },
  { name: "Shopee", pct: 30, color: "bg-orange-500" },
  { name: "Amazon", pct: 15, color: "bg-blue-500" },
  { name: "Magalu", pct: 10, color: "bg-indigo-500" },
];

export default function DashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout");
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Jodda
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/20">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Olá, Usuário Teste
          </h2>
          <p className="text-blue-100 mt-1">
            Aqui está o resumo do seu negócio hoje.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.up ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {stat.up ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Sales Chart Area */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vendas Últimos 30 dias
          </h3>
          <div className="h-64 rounded-lg bg-gradient-to-t from-indigo-50 to-white border border-gray-100 relative overflow-hidden">
            {/* Decorative chart bars */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around px-4 pb-2 h-full pt-8 gap-1">
              {[40, 55, 35, 60, 50, 70, 45, 65, 80, 55, 75, 90, 70, 60, 85, 65, 50, 72, 88, 60, 55, 78, 92, 68, 58, 82, 73, 62, 77, 85].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-indigo-500 to-blue-400 opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${h}%` }}
                  />
                )
              )}
            </div>
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/60 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Produtos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topProducts.map((product, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-semibold text-indigo-600">
                        {product.price}
                      </span>
                      <span className="text-xs text-gray-400">
                        {product.sold} vendidos
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marketplaces */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comparativo de Marketplaces
            </h3>
            <div className="space-y-5">
              {marketplaces.map((mp) => (
                <div key={mp.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">
                      {mp.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {mp.pct}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${mp.color} rounded-full transition-all duration-500`}
                      style={{ width: `${mp.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total de vendas</span>
                <span className="font-semibold text-gray-900">2.079 pedidos</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
