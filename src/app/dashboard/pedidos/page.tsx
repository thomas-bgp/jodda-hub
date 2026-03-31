"use client";

import { useState } from "react";
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  Search,
} from "lucide-react";

const stats = [
  { label: "Total Pedidos", value: "297", icon: ShoppingCart, color: "bg-blue-500" },
  { label: "Faturamento", value: "R$ 40.882,29", icon: DollarSign, color: "bg-emerald-500" },
  { label: "Margem Média", value: "25,81%", icon: TrendingUp, color: "bg-indigo-500" },
  { label: "Cancelados", value: "3", icon: XCircle, color: "bg-red-500" },
];

const marketplaceColors: Record<string, string> = {
  "Mercado Livre": "bg-yellow-100 text-yellow-800",
  Shopee: "bg-orange-100 text-orange-800",
  Amazon: "bg-blue-100 text-blue-800",
};

const orders = [
  { id: 1, produto: "Fone Bluetooth TWS Pro", marketplace: "Mercado Livre", data: "28/03/2026", quantidade: 2, preco: "R$ 189,90", comissao: "R$ 22,79", frete: "R$ 18,50", resultado: "R$ 101,23" },
  { id: 2, produto: "Cabo USB-C 2m Reforçado", marketplace: "Shopee", data: "27/03/2026", quantidade: 5, preco: "R$ 29,90", comissao: "R$ 5,38", frete: "R$ 8,90", resultado: "R$ 42,17" },
  { id: 3, produto: "Carregador Turbo 65W", marketplace: "Amazon", data: "27/03/2026", quantidade: 1, preco: "R$ 149,90", comissao: "R$ 19,49", frete: "R$ 12,00", resultado: "R$ 68,41" },
  { id: 4, produto: "Película Vidro iPhone 15", marketplace: "Mercado Livre", data: "26/03/2026", quantidade: 10, preco: "R$ 19,90", comissao: "R$ 23,88", frete: "R$ 15,00", resultado: "R$ 72,12" },
  { id: 5, produto: "Capa Silicone Galaxy S24", marketplace: "Shopee", data: "26/03/2026", quantidade: 3, preco: "R$ 39,90", comissao: "R$ 10,77", frete: "R$ 9,50", resultado: "R$ 49,43" },
  { id: 6, produto: "Mouse Gamer RGB 12000dpi", marketplace: "Amazon", data: "25/03/2026", quantidade: 1, preco: "R$ 259,90", comissao: "R$ 33,79", frete: "R$ 22,00", resultado: "R$ 114,11" },
  { id: 7, produto: "Hub USB 7 Portas", marketplace: "Mercado Livre", data: "25/03/2026", quantidade: 2, preco: "R$ 89,90", comissao: "R$ 10,79", frete: "R$ 14,00", resultado: "R$ 75,01" },
  { id: 8, produto: "Suporte Notebook Alumínio", marketplace: "Shopee", data: "24/03/2026", quantidade: 1, preco: "R$ 199,90", comissao: "R$ 23,99", frete: "R$ 19,00", resultado: "R$ 87,91" },
];

export default function PedidosPage() {
  const [statusFilter, setStatusFilter] = useState("todos");
  const [marketplaceFilter, setMarketplaceFilter] = useState("todos");

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Pedidos</h1>
        <p className="text-sm text-gray-500 mt-1">Acompanhe e gerencie todos os seus pedidos em um só lugar</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input type="date" defaultValue="2026-03-01" className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none" />
            <span className="text-gray-400">até</span>
            <input type="date" defaultValue="2026-03-31" className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none" />
          </div>
          <select
            value={marketplaceFilter}
            onChange={(e) => setMarketplaceFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
          >
            <option value="todos">Todos Marketplaces</option>
            <option value="ml">Mercado Livre</option>
            <option value="shopee">Shopee</option>
            <option value="amazon">Amazon</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
          >
            <option value="todos">Todos Status</option>
            <option value="aprovado">Aprovado</option>
            <option value="pendente">Pendente</option>
            <option value="cancelado">Cancelado</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
            <Filter className="h-4 w-4" />
            Filtrar
          </button>
        </div>
      </div>

      {/* Stats */}
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Produto</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Marketplace</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Data</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Qtd</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Preço</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Comissão</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Frete</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{order.produto}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${marketplaceColors[order.marketplace]}`}>
                      {order.marketplace}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{order.data}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{order.quantidade}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{order.preco}</td>
                  <td className="px-4 py-3 text-right text-red-600">{order.comissao}</td>
                  <td className="px-4 py-3 text-right text-red-600">{order.frete}</td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-600">{order.resultado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">Mostrando 1-8 de 297 pedidos</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-white hover:text-gray-600 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-sm font-medium">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-white transition-colors">2</button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-white transition-colors">3</button>
            <span className="text-gray-400">...</span>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-white transition-colors">38</button>
            <button className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
