export const dynamic = "force-static";

export const metadata = { title: "Termos de Uso — Jodda Hub" };

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <article className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-5 text-sm text-gray-700 leading-relaxed">
        <h1 className="text-2xl font-bold text-gray-900">Termos de Uso</h1>
        <p className="text-xs text-gray-500">Última atualização: 28/09/2026</p>

        <p>
          O Jodda Hub é um painel de gestão de e-commerce operado pela Bertuzzi Gestão Patrimonial (BGP),
          CNPJ 12.547.474/0001-37, para os clientes atendidos pela BGP.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">1. Uso do serviço</h2>
        <p>
          O acesso é restrito a clientes e colaboradores autorizados pela BGP. Cada usuário é responsável por manter
          suas credenciais em sigilo.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">2. Integração com marketplaces</h2>
        <p>
          Ao conectar uma loja (Mercado Livre, Shopee, Magalu ou outro canal), o titular da loja autoriza a BGP a ler,
          pelas APIs oficiais do marketplace, os dados de pedidos, notas fiscais, produtos, preços e estoque. O acesso é
          somente leitura: o Jodda Hub não cria, altera ou cancela anúncios, preços ou pedidos.
        </p>
        <p>
          A autorização pode ser encerrada a qualquer momento pelo botão &quot;Desconectar loja&quot; no painel ou
          diretamente na conta do marketplace.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">3. Finalidade</h2>
        <p>
          Os dados são usados apenas para gerar indicadores e relatórios de gestão para o próprio cliente, no escopo do
          serviço contratado com a BGP.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">4. Disponibilidade</h2>
        <p>
          O serviço depende da disponibilidade das APIs de cada marketplace. A BGP não se responsabiliza por
          indisponibilidades ou mudanças feitas por terceiros.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">5. Contato</h2>
        <p>
          Dúvidas sobre estes termos: <a className="text-indigo-600 underline" href="mailto:contato@bertuzzipatrimonial.com.br">contato@bertuzzipatrimonial.com.br</a>.
          Veja também a <a className="text-indigo-600 underline" href="/privacidade">Política de Privacidade</a>.
        </p>
      </article>
    </main>
  );
}
