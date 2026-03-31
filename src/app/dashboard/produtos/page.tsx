"use client";

import {
  DollarSign,
  Package,
  TrendingUp,
  Search,
} from "lucide-react";

const stats = [
  { label: "Faturamento Total", value: "R$ 87.432,50", icon: DollarSign, color: "bg-emerald-500" },
  { label: "Total SKUs", value: "142", icon: Package, color: "bg-blue-500" },
  { label: "Margem Média", value: "28,4%", icon: TrendingUp, color: "bg-indigo-500" },
];

const statusColors: Record<string, string> = {
  Ativo: "bg-emerald-100 text-emerald-800",
  Inativo: "bg-gray-100 text-gray-600",
  Pausado: "bg-amber-100 text-amber-800",
};

const marketplaceColors: Record<string, string> = {
  "Mercado Livre": "bg-yellow-100 text-yellow-800",
  Shopee: "bg-orange-100 text-orange-800",
  Amazon: "bg-blue-100 text-blue-800",
};

const products = [
  { sku: "SKU-001", nome: "Fone Bluetooth TWS Pro", marketplace: "Mercado Livre", preco: "R$ 189,90", vendas30d: 84, estoque: 230, margem: "32,1%", status: "Ativo" },
  { sku: "SKU-002", nome: "Cabo USB-C 2m Reforçado", marketplace: "Shopee", preco: "R$ 29,90", vendas30d: 312, estoque: 1450, margem: "45,2%", status: "Ativo" },
  { sku: "SKU-003", nome: "Carregador Turbo 65W", marketplace: "Amazon", preco: "R$ 149,90", vendas30d: 56, estoque: 89, margem: "28,7%", status: "Ativo" },
  { sku: "SKU-004", nome: "Película Vidro iPhone 15", marketplace: "Mercado Livre", preco: "R$ 19,90", vendas30d: 198, estoque: 3200, margem: "52,3%", status: "Ativo" },
  { sku: "SKU-005", nome: "Capa Silicone Galaxy S24", marketplace: "Shopee", preco: "R$ 39,90", vendas30d: 145, estoque: 780, margem: "38,9%", status: "Ativo" },
  { sku: "SKU-006", nome: "Mouse Gamer RGB 12000dpi", marketplace: "Amazon", preco: "R$ 259,90", vendas30d: 23, estoque: 45, margem: "22,4%", status: "Pausado" },
  { sku: "SKU-007", nome: "Hub USB 7 Portas", marketplace: "Mercado Livre", preco: "R$ 89,90", vendas30d: 67, estoque: 120, margem: "30,1%", status: "Ativo" },
  { sku: "SKU-008", nome: "Suporte Notebook Alumínio", marketplace: "Shopee", preco: "R$ 199,90", vendas30d: 31, estoque: 0, margem: "25,8%", status: "Inativo" },
  { sku: "SKU-009", nome: "Webcam Full HD 1080p", marketplace: "Amazon", preco: "R$ 179,90", vendas30d: 42, estoque: 67, margem: "27,3%", status: "Ativo" },
  { sku: "SKU-010", nome: "Teclado Mecânico Compacto", marketplace: "Mercado Livre", preco: "R$ 349,90", vendas30d: 18, estoque: 34, margem: "19,6%", status: "Pausado" },
];

export default function ProdutosPage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Produtos</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie seu catálogo de produtos e acompanhe o desempenho</p>
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
                <th className="text-left px-4 py-3 font-semibold text-gray-600">SKU</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Nome</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Marketplace</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Preço</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Vendas 30d</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Estoque</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Margem</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.sku} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{product.sku}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{product.nome}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${marketplaceColors[product.marketplace]}`}>
                      {product.marketplace}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{product.preco}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{product.vendas30d}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={product.estoque === 0 ? "text-red-600 font-semibold" : "text-gray-700"}>
                      {product.estoque}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{product.margem}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
