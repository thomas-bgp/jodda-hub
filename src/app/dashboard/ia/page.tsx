"use client";

import {
  Bot,
  BookOpen,
  Building2,
  HeadphonesIcon,
  ShieldCheck,
  Save,
  Smartphone,
} from "lucide-react";

const features = [
  {
    title: "Base de conhecimento",
    description: "Zeny aprende com sua base de dados de produtos, preços e políticas para fornecer respostas precisas aos seus clientes.",
    icon: BookOpen,
    color: "bg-blue-500",
  },
  {
    title: "Apoio por empresa",
    description: "Configure respostas personalizadas para cada empresa ou marca do seu portfólio, mantendo a identidade de cada uma.",
    icon: Building2,
    color: "bg-indigo-500",
  },
  {
    title: "Atendimento pré e pós-venda",
    description: "Automatize o atendimento desde dúvidas sobre produtos até acompanhamento de entregas e trocas.",
    icon: HeadphonesIcon,
    color: "bg-purple-500",
  },
  {
    title: "Suporte pós-venda eficiente",
    description: "Resolva problemas de forma rápida e eficiente, com respostas inteligentes baseadas no histórico do cliente.",
    icon: ShieldCheck,
    color: "bg-emerald-500",
  },
];

export default function IAPage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Bot className="h-7 w-7 text-primary-600" />
          Respostas por IA - Zeny
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl">
          Zeny é a assistente virtual inteligente que responde automaticamente às perguntas dos seus clientes
          via WhatsApp e marketplaces, utilizando inteligência artificial para oferecer atendimento rápido e personalizado.
        </p>
      </div>

      {/* Configuration Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações da IA</h2>

        <div className="space-y-5 max-w-2xl">
          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-gray-400" />
                Número WhatsApp
              </span>
            </label>
            <input
              type="text"
              placeholder="+55 (11) 99999-9999"
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">Número que receberá as mensagens dos clientes</p>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Instruções da IA
            </label>
            <textarea
              rows={5}
              placeholder="Ex: Você é a Zeny, assistente virtual da loja XYZ. Responda de forma educada e objetiva. Não ofereça descontos sem autorização..."
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">Defina o comportamento e tom de voz da assistente</p>
          </div>

          {/* Save Button */}
          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
            <Save className="h-4 w-4" />
            Salvar Configurações
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Funcionalidades</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`${feature.color} p-3 rounded-lg flex-shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
