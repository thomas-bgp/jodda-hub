"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Package,
  Loader2,
  LinkIcon,
  Search,
} from "lucide-react";
import Link from "next/link";

const fmt = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  paused: "bg-amber-100 text-amber-800",
  closed: "bg-gray-100 text-gray-600",
  under_review: "bg-yellow-100 text-yellow-800",
  inactive: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<string, string> = {
  active: "Ativo",
  paused: "Pausado",
  closed: "Fechado",
  under_review: "Em revisao",
  inactive: "Inativo",
};

interface Item {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  sold_quantity: number;
  available_quantity: number;
  status: string;
  currency_id: string;
}

export default function ProdutosPage() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("/api/mercadolivre/items");
        if (res.ok) {
          const data = await res.json();
          if (data.connected) {
            setConnected(true);
            setItems(data.items || []);
            setTotal(data.total || 0);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
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
          <h1 className="text-2xl font-bold text-gray-900">Gestao de Produtos</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie seu catalogo de produtos e acompanhe o desempenho</p>
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

  const totalValue = items.reduce((sum, item) => sum + (item.price * (item.available_quantity || 0)), 0);

  const stats = [
    { label: "Total Produtos", value: total.toLocaleString("pt-BR"), icon: Package, color: "bg-blue-500" },
    { label: "Valor Total em Estoque", value: fmt.format(totalValue), icon: DollarSign, color: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestao de Produtos</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie seu catalogo de produtos e acompanhe o desempenho</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produto..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Preco</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Vendidos</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Estoque</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Nenhum produto encontrado
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const statusLabel = statusLabels[item.status] || item.status;
                  const statusColor = statusColors[item.status] || "bg-gray-100 text-gray-800";
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 truncate max-w-xs">
                            {item.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {fmt.format(item.price)}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {(item.sold_quantity || 0).toLocaleString("pt-BR")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={item.available_quantity === 0 ? "text-red-600 font-semibold" : "text-gray-700"}>
                          {(item.available_quantity || 0).toLocaleString("pt-BR")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
