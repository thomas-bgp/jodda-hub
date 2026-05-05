export const dynamic = "force-static";

export default function ConectarPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Conexão Mercado Livre
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Autorize o BGP a acessar os dados da sua conta Mercado Livre
            </p>
          </div>

          <a
            href="/api/mercadolivre/auth?return=/conectado"
            className="block w-full py-3 px-4 rounded-xl font-semibold text-center text-white bg-yellow-500 hover:bg-yellow-600 transition-colors shadow-lg"
          >
            Conectar Mercado Livre
          </a>

          <p className="text-center text-xs text-gray-500 mt-6">
            Você será redirecionado ao site do Mercado Livre para autorizar.
            Nenhuma senha é compartilhada.
          </p>
        </div>
      </div>
    </div>
  );
}
