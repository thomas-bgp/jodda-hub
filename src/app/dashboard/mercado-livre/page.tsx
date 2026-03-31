"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Eye,
  MousePointer,
  BarChart3,
  Target,
  Star,
  Megaphone,
} from "lucide-react";

const tabs = ["Dashboard", "Campanhas", "Anúncios", "Métricas", "Reputação"];

const cards = [
  { label: "Faturamento ADS", value: "R$ 12.847,30", icon: DollarSign, color: "bg-emerald-500", change: "+12,3%" },
  { label: "Investimento", value: "R$ 2.156,80", icon: TrendingUp, color: "bg-blue-500", change: "+5,7%" },
  { label: "ACOS", value: "16,78%", icon: Target, color: "bg-indigo-500", change: "-2,1%" },
  { label: "Impressões", value: "284.532", icon: Eye, color: "bg-purple-500", change: "+18,4%" },
  { label: "Cliques", value: "8.432", icon: MousePointer, color: "bg-amber-500", change: "+9,2%" },
];

const adTypes = [
  { tipo: "Product Ads", quantidade: 45, faturamento: "R$ 8.234,50", percentual: 64 },
  { tipo: "Brand Ads", quantidade: 12, faturamento: "R$ 3.112,80", percentual: 24 },
  { tipo: "Display Ads", quantidade: 8, faturamento: "R$ 1.500,00", percentual: 12 },
];

export default function MercadoLivrePage() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestão Mercado Livre</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie campanhas, anúncios e métricas do Mercado Livre Ads</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "Dashboard" && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {cards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`${card.color} p-2 rounded-lg`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xs text-gray-500">{card.label}</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{card.value}</p>
                      <p className={`text-xs mt-1 ${card.change.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>
                        {card.change} vs mês anterior
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Anúncios por Tipo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary-600" />
                  Anúncios por Tipo
                </h3>
                <div className="space-y-4">
                  {adTypes.map((ad) => (
                    <div key={ad.tipo} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{ad.tipo}</p>
                          <p className="text-xs text-gray-500">{ad.quantidade} anúncios ativos</p>
                        </div>
                        <p className="font-semibold text-gray-900">{ad.faturamento}</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary-600 h-2.5 rounded-full transition-all"
                          style={{ width: `${ad.percentual}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{ad.percentual}% do faturamento total</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Campanhas" && (
            <div className="text-center py-12 text-gray-500">
              <Megaphone className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="font-medium">Gerenciamento de Campanhas</p>
              <p className="text-sm mt-1">Conecte sua conta do Mercado Livre para visualizar campanhas</p>
            </div>
          )}

          {activeTab === "Anúncios" && (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="font-medium">Gestão de Anúncios</p>
              <p className="text-sm mt-1">Conecte sua conta do Mercado Livre para visualizar anúncios</p>
            </div>
          )}

          {activeTab === "Métricas" && (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="font-medium">Métricas Detalhadas</p>
              <p className="text-sm mt-1">Conecte sua conta do Mercado Livre para visualizar métricas</p>
            </div>
          )}

          {activeTab === "Reputação" && (
            <div className="text-center py-12 text-gray-500">
              <Star className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="font-medium">Reputação do Vendedor</p>
              <p className="text-sm mt-1">Conecte sua conta do Mercado Livre para visualizar reputação</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
