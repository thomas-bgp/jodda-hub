"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Receipt,
  Package,
  User,
  Star,
  CalendarDays,
  Loader2,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";

const fmt = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface Seller {
  id: number;
  nickname: string;
  first_name: string;
  last_name: string;
  email: string;
  registration_date: string;
  seller_reputation: {
    level_id: string;
    power_seller_status: string | null;
    transactions: {
      completed: number;
      canceled: number;
      total: number;
    };
  };
}

interface Metrics {
  connected: boolean;
  faturamento: number;
  pedidos: number;
  ticket_medio: number;
  produtos: number;
}

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

export default function MercadoLivrePage() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sellerRes, metricsRes] = await Promise.all([
          fetch("/api/mercadolivre/seller"),
          fetch("/api/mercadolivre/metrics"),
        ]);

        if (sellerRes.ok) {
          const data = await sellerRes.json();
          if (data.nickname) {
            setConnected(true);
            setSeller(data);
          }
        }

        if (metricsRes.ok) {
          const data = await metricsRes.json();
          if (data.connected) {
            setConnected(true);
            setMetrics(data);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dados ML:", err);
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestao Mercado Livre</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie sua conta e acompanhe metricas do Mercado Livre</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <LinkIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Conta nao conectada</h3>
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

  const metricCards = [
    {
      label: "Faturamento",
      value: fmt.format(metrics?.faturamento ?? 0),
      icon: DollarSign,
      color: "bg-emerald-500",
    },
    {
      label: "Pedidos",
      value: (metrics?.pedidos ?? 0).toLocaleString("pt-BR"),
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      label: "Ticket Medio",
      value: fmt.format(metrics?.ticket_medio ?? 0),
      icon: Receipt,
      color: "bg-indigo-500",
    },
    {
      label: "Produtos",
      value: (metrics?.produtos ?? 0).toLocaleString("pt-BR"),
      icon: Package,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestao Mercado Livre</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie sua conta e acompanhe metricas do Mercado Livre</p>
      </div>

      {/* Seller Info */}
      {seller && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informacoes do Vendedor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Nickname</p>
                <p className="font-semibold text-gray-900">{seller.nickname}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Reputacao</p>
                <p className="font-semibold text-gray-900">
                  {seller.seller_reputation?.level_id?.replace(/_/g, " ") || "N/A"}
                  {seller.seller_reputation?.power_seller_status && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                      {seller.seller_reputation.power_seller_status}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <CalendarDays className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cadastro</p>
                <p className="font-semibold text-gray-900">
                  {seller.registration_date ? formatDate(seller.registration_date) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
