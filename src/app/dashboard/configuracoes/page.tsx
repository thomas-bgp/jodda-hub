"use client";

import { useState } from "react";
import { Settings, Save } from "lucide-react";

const marketplaceTabs = ["Amazon", "Magalu", "Mercado Livre", "Shopee", "Via/Tiny ERP"];

const taxData: Record<string, Array<{ sellerId: string; cnpj: string; tax: string; comissao: string; frete: string; imposto: string }>> = {
  Amazon: [
    { sellerId: "AMZ-001", cnpj: "12.345.678/0001-90", tax: "6,0%", comissao: "15,0%", frete: "8,5%", imposto: "12,0%" },
    { sellerId: "AMZ-002", cnpj: "98.765.432/0001-10", tax: "6,0%", comissao: "12,0%", frete: "7,0%", imposto: "12,0%" },
  ],
  Magalu: [
    { sellerId: "MAG-001", cnpj: "12.345.678/0001-90", tax: "5,5%", comissao: "16,0%", frete: "9,0%", imposto: "11,5%" },
  ],
  "Mercado Livre": [
    { sellerId: "ML-001", cnpj: "12.345.678/0001-90", tax: "6,0%", comissao: "13,0%", frete: "10,0%", imposto: "12,0%" },
    { sellerId: "ML-002", cnpj: "98.765.432/0001-10", tax: "6,0%", comissao: "11,0%", frete: "8,0%", imposto: "12,0%" },
  ],
  Shopee: [
    { sellerId: "SHP-001", cnpj: "12.345.678/0001-90", tax: "5,0%", comissao: "14,0%", frete: "12,0%", imposto: "10,5%" },
  ],
  "Via/Tiny ERP": [
    { sellerId: "VIA-001", cnpj: "12.345.678/0001-90", tax: "6,0%", comissao: "18,0%", frete: "11,0%", imposto: "12,0%" },
  ],
};

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("Amazon");

  const rows = taxData[activeTab] || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="h-7 w-7 text-primary-600" />
          Configurações
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure taxas e comissões por marketplace</p>
      </div>

      {/* Marketplace Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {marketplaceTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
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
          {/* Tax Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Seller ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">CNPJ</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Tax %</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Comissão %</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Frete %</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Imposto %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row.sellerId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900">{row.sellerId}</td>
                    <td className="px-4 py-3 text-gray-600">{row.cnpj}</td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="text"
                        defaultValue={row.tax}
                        className="w-20 text-center text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="text"
                        defaultValue={row.comissao}
                        className="w-20 text-center text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="text"
                        defaultValue={row.frete}
                        className="w-20 text-center text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="text"
                        defaultValue={row.imposto}
                        className="w-20 text-center text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
              <Save className="h-4 w-4" />
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
