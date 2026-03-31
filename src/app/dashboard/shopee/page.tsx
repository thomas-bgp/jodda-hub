"use client";

import { Store, LinkIcon } from "lucide-react";
import Link from "next/link";

export default function ShopeePage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestao Shopee</h1>
        <p className="text-sm text-gray-500 mt-1">Acompanhe o desempenho das suas campanhas na Shopee</p>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
        <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Conta nao conectada</h3>
        <p className="text-gray-500 mb-6">
          Conecte sua conta Shopee em Integracoes para visualizar seus dados
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
