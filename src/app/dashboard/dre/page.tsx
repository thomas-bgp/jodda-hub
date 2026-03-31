"use client";

import { FileText, Clock } from "lucide-react";

export default function DREPage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">DRE - Demonstrativo de Resultado</h1>
        <p className="text-sm text-gray-500 mt-1">Visualize o demonstrativo de resultado do exercício</p>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Em breve</h2>
          <p className="text-gray-500">
            O módulo de DRE está em desenvolvimento. Em breve você poderá acompanhar o demonstrativo
            de resultado do exercício com detalhes de receitas, custos e despesas.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-600">
            <FileText className="h-4 w-4" />
            <span className="font-medium">Previsão de lançamento: Abril 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
