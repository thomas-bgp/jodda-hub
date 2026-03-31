"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Receipt,
  Package,
  Loader2,
  LinkIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const fmt = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface Metrics {
  connected: boolean;
  faturamento: number;
  pedidos: number;
  ticket_medio: number;
  produtos: number;
}

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

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [sellerName, setSellerName] = useState("Usuario");

  useEffect(() => {
    async function fetchData() {
      try {
        const [metricsRes, itemsRes, sellerRes] = await Promise.all([
          fetch("/api/mercadolivre/metrics"),
          fetch("/api/mercadolivre/items"),
          fetch("/api/mercadolivre/seller"),
        ]);

        if (metricsRes.ok) {
          const data = await metricsRes.json();
          if (data.connected) {
            setConnected(true);
            setMetrics(data);
          }
        }

        if (itemsRes.ok) {
          const data = await itemsRes.json();
          if (data.connected && data.items) {
            setItems(data.items.slice(0, 6));
          }
        }

        if (sellerRes.ok) {
          const data = await sellerRes.json();
          if (data.nickname) {
            setSellerName(data.nickname);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/20">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Ola, {sellerName}
          </h2>
          <p className="text-blue-100 mt-1">
            Aqui esta o resumo do seu negocio hoje.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <LinkIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma integracao ativa
          </h3>
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

  const stats = [
    {
      label: "Faturamento",
      value: fmt.format(metrics?.faturamento ?? 0),
      icon: DollarSign,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Pedidos",
      value: (metrics?.pedidos ?? 0).toLocaleString("pt-BR"),
      icon: ShoppingCart,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      label: "Ticket Medio",
      value: fmt.format(metrics?.ticket_medio ?? 0),
      icon: Receipt,
      color: "from-violet-500 to-violet-600",
    },
    {
      label: "Produtos",
      value: (metrics?.produtos ?? 0).toLocaleString("pt-BR"),
      icon: Package,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/20">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Ola, {sellerName}
        </h2>
        <p className="text-blue-100 mt-1">
          Aqui esta o resumo do seu negocio hoje.
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
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Top Products from ML */}
      {items.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Produtos Mercado Livre
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-semibold text-indigo-600">
                      {fmt.format(item.price)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {item.sold_quantity} vendidos
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
