"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  DollarSign,
  Receipt,
  Loader2,
  LinkIcon,
  Filter,
  Calendar,
} from "lucide-react";
import Link from "next/link";

const fmt = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const statusMap: Record<string, { label: string; color: string }> = {
  paid: { label: "Pago", color: "bg-emerald-100 text-emerald-800" },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
  pending: { label: "Pendente", color: "bg-amber-100 text-amber-800" },
  shipped: { label: "Enviado", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Entregue", color: "bg-emerald-100 text-emerald-800" },
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface Order {
  id: number;
  date_created: string;
  total_amount: number;
  currency_id: string;
  status: string;
  order_items: Array<{
    item: { id: string; title: string };
    quantity: number;
    unit_price: number;
  }>;
}

export default function PedidosPage() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [marketplaceFilter, setMarketplaceFilter] = useState("todos");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/mercadolivre/orders");
        if (res.ok) {
          const data = await res.json();
          if (data.connected) {
            setConnected(true);
            setOrders(data.orders || []);
            setTotal(data.total || 0);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">Acompanhe e gerencie todos os seus pedidos em um so lugar</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <LinkIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma integracao ativa</h3>
          <p className="text-gray-500 mb-6">
            Conecte seu Mercado Livre em Integracoes para visualizar seus dados
          </p>
          <Link
            href="/dashboard/integracoes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
            Ir para Integracoes
          </Link>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const avgTicket = orders.length > 0 ? totalRevenue / orders.length : 0;

  const stats = [
    { label: "Total Pedidos", value: total.toLocaleString("pt-BR"), icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Faturamento", value: fmt.format(totalRevenue), icon: DollarSign, color: "bg-emerald-500" },
    { label: "Ticket Medio", value: fmt.format(avgTicket), icon: Receipt, color: "bg-indigo-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Pedidos</h1>
        <p className="text-sm text-gray-500 mt-1">Acompanhe e gerencie todos os seus pedidos em um so lugar</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input type="date" className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none" />
            <span className="text-gray-400">ate</span>
            <input type="date" className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
          >
            <option value="todos">Todos Status</option>
            <option value="paid">Pago</option>
            <option value="pending">Pendente</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
            <Filter className="h-4 w-4" />
            Filtrar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Data</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Qtd</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Preco</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Nenhum pedido encontrado
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const firstItem = order.order_items?.[0];
                  const statusInfo = statusMap[order.status] || {
                    label: order.status,
                    color: "bg-gray-100 text-gray-800",
                  };
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {firstItem?.item?.title || "Sem titulo"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(order.date_created)}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {firstItem?.quantity || 1}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {fmt.format(order.total_amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination info */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            Mostrando {orders.length} de {total.toLocaleString("pt-BR")} pedidos
          </p>
        </div>
      </div>
    </div>
  );
}
