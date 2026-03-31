"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Info,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Settings,
  Pencil,
  ShoppingCart,
  Package,
  Store,
} from "lucide-react";

interface MlStatus {
  connected: boolean;
  user_id?: string;
  expires_at?: string;
}

export default function IntegracoesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><RefreshCw className="w-6 h-6 text-gray-400 animate-spin" /></div>}>
      <IntegracoesContent />
    </Suspense>
  );
}

function IntegracoesContent() {
  const searchParams = useSearchParams();
  const [mlStatus, setMlStatus] = useState<MlStatus>({ connected: false });
  const [mlExpanded, setMlExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/mercadolivre/status");
        const data = await res.json();
        if (data.connected) {
          setMlStatus(data);
          localStorage.setItem("ml_connected", "true");
        } else {
          // Check URL param for just-connected flow
          if (searchParams.get("ml") === "connected") {
            setMlStatus({ connected: true, user_id: "—", expires_at: "—" });
            localStorage.setItem("ml_connected", "true");
          } else {
            // Check localStorage as fallback
            const stored = localStorage.getItem("ml_connected");
            if (stored === "true") {
              setMlStatus({ connected: true, user_id: "demo", expires_at: "—" });
            }
          }
        }
      } catch {
        // API not available — check localStorage
        const stored = localStorage.getItem("ml_connected");
        if (stored === "true" || searchParams.get("ml") === "connected") {
          setMlStatus({ connected: true, user_id: "demo", expires_at: "—" });
          localStorage.setItem("ml_connected", "true");
        }
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, [searchParams]);

  const handleMlConnect = () => {
    window.location.href = "/api/mercadolivre/auth";
  };

  const handleVerifyToken = async () => {
    try {
      const res = await fetch("/api/mercadolivre/status");
      const data = await res.json();
      if (data.connected) {
        setMlStatus(data);
        alert("Token verificado com sucesso!");
      } else {
        alert("Token inválido ou expirado.");
      }
    } catch {
      alert("Erro ao verificar token.");
    }
  };

  const erpCards = [
    {
      name: "Bling",
      color: "border-yellow-400",
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      letter: "B",
    },
    {
      name: "Tiny",
      color: "border-green-400",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      letter: "T",
    },
    {
      name: "Omie",
      color: "border-blue-400",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      letter: "O",
    },
  ];

  const marketplaceCards = [
    {
      name: "Shopee",
      color: "border-orange-400",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      letter: "S",
    },
    {
      name: "Magalu",
      color: "border-blue-400",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      letter: "M",
    },
    {
      name: "Amazon",
      color: "border-orange-400",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-700",
      letter: "A",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Integrações</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie suas conexões com ERPs e marketplaces
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Para uma configuração mais rápida e completa:</span>{" "}
            Configure as integrações que você utiliza. Ative a integração via API
            para habilitar todas as funcionalidades.
          </p>
        </div>

        {/* Meus ERPs */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Meus ERPs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {erpCards.map((erp) => (
              <div
                key={erp.name}
                className={`bg-white rounded-xl border-l-4 ${erp.color} shadow-sm hover:shadow-md transition-all duration-200 p-5`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 ${erp.iconBg} rounded-lg flex items-center justify-center`}
                  >
                    <span className={`text-lg font-bold ${erp.iconColor}`}>
                      {erp.letter}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{erp.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <XCircle className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Não configurado
                      </span>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-150">
                  Nova Integração
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Marketplaces */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Marketplaces
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Mercado Livre Card */}
            <div
              className={`bg-white rounded-xl border-l-4 border-yellow-400 shadow-sm hover:shadow-md transition-all duration-200 ${
                mlStatus.connected ? "col-span-1 md:col-span-2 lg:col-span-2" : ""
              }`}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Mercado Livre
                      </h3>
                      {mlStatus.connected ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-xs font-medium text-green-600">
                            Conectado
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <XCircle className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Não configurado
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {mlStatus.connected && (
                    <button
                      onClick={() => setMlExpanded(!mlExpanded)}
                      className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      {mlExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>

                {!mlStatus.connected && !loading && (
                  <button
                    onClick={handleMlConnect}
                    className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Nova Integração Mercado Livre
                  </button>
                )}

                {loading && (
                  <div className="flex items-center justify-center py-2">
                    <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
                    <span className="ml-2 text-sm text-gray-400">
                      Verificando...
                    </span>
                  </div>
                )}

                {/* Connected Details */}
                {mlStatus.connected && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Token Válido
                      </span>
                    </div>

                    {mlExpanded && (
                      <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
                        {/* Connection Info */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-0.5">
                              Seller ID
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {mlStatus.user_id || "MLB-123456789"}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-0.5">CNPJ</p>
                            <p className="text-sm font-medium text-gray-900">
                              12.345.678/0001-90
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-0.5">
                              Data de Integração
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              31/03/2026
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-0.5">
                              Token Expira
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {mlStatus.expires_at
                                ? new Date(mlStatus.expires_at).toLocaleDateString(
                                    "pt-BR"
                                  )
                                : "—"}
                            </p>
                          </div>
                        </div>

                        {/* Account Settings */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                            <Settings className="w-4 h-4" />
                            Configurações de Conta
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Nome da Loja
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  Jodda Store Oficial
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Sincronização de Estoque
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  Ativo — a cada 15 min
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Importar Pedidos
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  Ativo — automático
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleVerifyToken}
                            className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Verificar Token
                          </button>
                          <button className="flex-1 py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-150 flex items-center justify-center gap-2">
                            <Pencil className="w-4 h-4" />
                            Editar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Other Marketplace Cards */}
            {marketplaceCards.map((mp) => (
              <div
                key={mp.name}
                className={`bg-white rounded-xl border-l-4 ${mp.color} shadow-sm hover:shadow-md transition-all duration-200 p-5`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 ${mp.iconBg} rounded-lg flex items-center justify-center`}
                  >
                    <span className={`text-lg font-bold ${mp.iconColor}`}>
                      {mp.letter}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{mp.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <XCircle className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Não configurado
                      </span>
                    </div>
                  </div>
                </div>
                {mp.name === "Shopee" ? (
                  <button className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors duration-150 flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Nova Integração Shopee
                  </button>
                ) : (
                  <button className="w-full py-2 px-4 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed">
                    Em breve
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
