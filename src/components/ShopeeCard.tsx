"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, ExternalLink, RefreshCw, Store } from "lucide-react";

export default function ShopeeCard() {
  const [status, setStatus] = useState<{ connected: boolean; shop_id?: number } | null>(null);

  useEffect(() => {
    fetch("/api/shopee/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch((error) => {
        console.error("Erro ao consultar status da Shopee:", error);
        setStatus({ connected: false });
      });
  }, []);

  return (
    <div className="bg-white rounded-xl border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-all duration-200 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
          <Store className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Shopee</h3>
          {status?.connected ? (
            <div className="flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs font-medium text-green-600">Conectada · Shop {status.shop_id}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mt-0.5">
              <XCircle className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">Não configurado</span>
            </div>
          )}
        </div>
      </div>

      {!status && (
        <div className="flex items-center justify-center py-2 text-sm text-gray-400">
          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          Verificando...
        </div>
      )}
      {status?.connected && (
        <Link
          href="/dashboard/shopee"
          className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2"
        >
          Ver pedidos
        </Link>
      )}
      {status && !status.connected && (
        <a
          href="/api/shopee/auth"
          className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Nova Integração Shopee
        </a>
      )}
    </div>
  );
}
