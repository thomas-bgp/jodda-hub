export const dynamic = "force-static";

export const metadata = { title: "Política de Privacidade — Jodda Hub" };

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <article className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-5 text-sm text-gray-700 leading-relaxed">
        <h1 className="text-2xl font-bold text-gray-900">Política de Privacidade</h1>
        <p className="text-xs text-gray-500">Última atualização: 28/09/2026</p>

        <p>
          Esta política explica como a Bertuzzi Gestão Patrimonial (BGP), CNPJ 12.547.474/0001-37, trata os dados
          acessados pelo Jodda Hub, em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).
        </p>

        <h2 className="text-lg font-semibold text-gray-900">1. Dados coletados</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Dados de login dos usuários do painel (nome e e-mail).</li>
          <li>
            Dados da loja autorizada nos marketplaces: pedidos, valores, status, notas fiscais, produtos, preços e
            estoque. Pedidos podem conter dados dos compradores (nome, documento, contato) enviados pelo marketplace.
          </li>
          <li>Tokens de acesso emitidos pelos marketplaces, que permitem a leitura desses dados.</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-900">2. Finalidade</h2>
        <p>
          Os dados são usados exclusivamente para gerar indicadores de vendas e relatórios de gestão para o próprio
          lojista. Não vendemos, alugamos nem compartilhamos dados com terceiros para fins comerciais.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">3. Armazenamento e segurança</h2>
        <p>
          Os tokens ficam em servidor próprio da BGP, sem acesso público, e são renovados automaticamente conforme as
          regras de cada marketplace. O acesso ao painel exige login.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">4. Retenção e exclusão</h2>
        <p>
          Ao desconectar a loja, o token de acesso é apagado e o Jodda Hub deixa de ler novos dados. O titular pode
          pedir a exclusão dos dados a qualquer momento pelo contato abaixo.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">5. Direitos do titular</h2>
        <p>
          O titular pode solicitar confirmação, acesso, correção, anonimização ou exclusão dos seus dados, nos termos
          da LGPD.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">6. Contato</h2>
        <p>
          <a className="text-indigo-600 underline" href="mailto:contato@bertuzzipatrimonial.com.br">contato@bertuzzipatrimonial.com.br</a>.
          Veja também os <a className="text-indigo-600 underline" href="/termos">Termos de Uso</a>.
        </p>
      </article>
    </main>
  );
}
