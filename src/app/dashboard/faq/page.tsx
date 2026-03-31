"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Como conectar minha conta do Mercado Livre?",
    answer:
      "Acesse a página de Integrações no menu lateral, clique em 'Conectar Mercado Livre' e siga o fluxo de autorização. Você será redirecionado para o Mercado Livre para autorizar o acesso. Após a autorização, seus dados serão sincronizados automaticamente.",
  },
  {
    question: "Como funciona o cálculo de margem dos produtos?",
    answer:
      "A margem é calculada considerando o preço de venda, deduzindo comissões do marketplace, frete, impostos e custo do produto. A fórmula é: Margem = ((Preço Venda - Comissão - Frete - Impostos - Custo) / Preço Venda) × 100. Você pode configurar as taxas na página de Configurações.",
  },
  {
    question: "A Zeny (IA) responde automaticamente no WhatsApp?",
    answer:
      "Sim! Após configurar o número do WhatsApp e as instruções na página de Respostas por IA, a Zeny passará a responder automaticamente as mensagens dos clientes. Você pode personalizar o tom de voz, definir limites de atuação e configurar uma base de conhecimento com informações dos seus produtos.",
  },
  {
    question: "Posso gerenciar múltiplos marketplaces ao mesmo tempo?",
    answer:
      "Sim, o Jodda Hub permite gerenciar Mercado Livre, Shopee, Amazon, Magalu e Via/Tiny ERP em uma única plataforma. Todos os pedidos, produtos e métricas são centralizados no dashboard principal para facilitar a gestão do seu e-commerce.",
  },
  {
    question: "Como exportar relatórios de vendas?",
    answer:
      "Na página de Análise de Pedidos, utilize os filtros de data e marketplace para selecionar o período desejado. Em breve será disponibilizado o botão de exportação para gerar relatórios em PDF e Excel com todas as informações de vendas, comissões e margens.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <HelpCircle className="h-7 w-7 text-primary-600" />
          Perguntas Frequentes
        </h1>
        <p className="text-sm text-gray-500 mt-1">Tire suas dúvidas sobre a plataforma Jodda Hub</p>
      </div>

      {/* Accordion */}
      <div className="space-y-3 max-w-3xl">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
