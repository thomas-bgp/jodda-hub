export const dynamic = "force-static";

export default function ConectarErroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900">
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">A conexão não foi concluída</h1>
          <p className="text-sm text-gray-300">
            A autorização expirou ou foi cancelada. Abra de novo o link que a BGP enviou e, no marketplace, entre com o
            login da empresa.
          </p>
          <p className="text-xs text-gray-500 mt-6">
            Se o problema continuar, fale com o seu contato na BGP.
          </p>
        </div>
      </div>
    </div>
  );
}
