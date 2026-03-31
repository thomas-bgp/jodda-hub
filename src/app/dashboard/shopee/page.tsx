"use client";

import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  MousePointer,
  Eye,
  Target,
  BarChart3,
  Percent,
} from "lucide-react";

const stats = [
  { label: "Faturamento", value: "R$ 843,88", icon: DollarSign, color: "bg-emerald-500" },
  { label: "Investimento", value: "R$ 8.539,79", icon: TrendingUp, color: "bg-blue-500" },
  { label: "Pedidos", value: "1", icon: ShoppingCart, color: "bg-purple-500" },
  { label: "CPC", value: "R$ 12,93", icon: MousePointer, color: "bg-amber-500" },
  { label: "Impressões", value: "47", icon: Eye, color: "bg-indigo-500" },
  { label: "Cliques", value: "2.263", icon: Target, color: "bg-pink-500" },
  { label: "CTR", value: "2,99%", icon: Percent, color: "bg-cyan-500" },
  { label: "ACOS", value: "6,34%", icon: BarChart3, color: "bg-orange-500" },
];

export default function ShopeePage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestão Shopee</h1>
        <p className="text-sm text-gray-500 mt-1">Acompanhe o desempenho das suas campanhas na Shopee</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary-600" />
          Desempenho Mensal
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">Gráfico de desempenho será exibido aqui</p>
            <p className="text-xs text-gray-300 mt-1">Conecte sua conta Shopee para visualizar dados</p>
          </div>
        </div>
      </div>
    </div>
  );
}
