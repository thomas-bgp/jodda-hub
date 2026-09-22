"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Store, ExternalLink, RefreshCw, ShoppingCart, DollarSign, Receipt, Unplug } from "lucide-react";

interface ShopInfo {
  shop_id: number;
  shop_name?: string;
  region?: string;
  status?: string;
}

interface Order {
  order_sn: string;
  status: string;
  created_at: string;
  total: number;
  items: number;
  payment_method?: string;
}

interface OrdersResponse {
  window_days: number;
  total_orders: number;
  gmv: number;
  avg_ticket: number;
  orders: Order[];
}

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const STATUS_LABEL: Record<string, string> = {
  UNPAID: "Aguardando pagamento",
  READY_TO_SHIP: "Pronto para envio",
  PROCESSED: "Processado",
  SHIPPED: "Enviado",
  TO_CONFIRM_RECEIVE: "Entregue",
  COMPLETED: "Concluído",
  IN_CANCEL: "Em cancelamento",
  CANCELLED: "Cancelado",
  TO_RETURN: "Devolução",
};

export default function ShopeePage() {
  return (
    <Suspense fallback={null}>
      <ShopeeContent />
    </Suspense>
  );
}

function ShopeeContent() {
  const searchParams = useSearchParams();
  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [orders, setOrders] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const shopRes = await fetch("/api/shopee/shop");
        if (shopRes.status === 401) return;
        if (!shopRes.ok) throw new Error("shop");
        setShop(await shopRes.json());
        const ordersRes = await fetch("/api/shopee/orders");
        if (!ordersRes.ok) throw new Error("orders");
        setOrders(await ordersRes.json());
      } catch (err) {
        console.error("Erro ao carregar dados da Shopee:", err);
        setError("Não foi possível carregar os dados da Shopee. Tente novamente em instantes.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const callbackError = searchParams.get("error");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão Shopee</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pedidos e faturamento da sua loja Shopee, atualizados direto pela API oficial
          </p>
        </div>
        {shop && (
          <a
            href="/api/shopee/disconnect"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Unplug className="w-4 h-4" />
            Desconectar loja
          </a>
        )}
      </div>

      {(error || callbackError) && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error || "A autorização da Shopee não foi concluída. Tente conectar novamente."}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" />
          Carregando...
        </div>
      )}

      {!loading && !shop && <ConnectCard />}

      {shop && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
              <Store className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{shop.shop_name || `Loja ${shop.shop_id}`}</p>
              <p className="text-xs text-gray-500">
                Shop ID {shop.shop_id} · Região {shop.region || "—"} · Status {shop.status || "—"}
              </p>
            </div>
            <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
              Conectada
            </span>
          </div>

          {orders && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Kpi icon={ShoppingCart} label={`Pedidos (${orders.window_days} dias)`} value={String(orders.total_orders)} />
                <Kpi icon={DollarSign} label="Faturamento bruto" value={brl(orders.gmv)} />
                <Kpi icon={Receipt} label="Ticket médio" value={brl(orders.avg_ticket)} />
              </div>
              <OrdersTable orders={orders.orders} />
            </>
          )}
        </>
      )}
    </div>
  );
}

function ConnectCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
      <Store className="w-12 h-12 text-orange-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Conecte sua loja Shopee</h3>
      <p className="text-gray-500 mb-6 max-w-lg mx-auto">
        Você será levado ao login da Shopee para autorizar a BGP a ler pedidos, produtos e
        financeiro da sua loja. Nenhum anúncio ou pedido é alterado.
      </p>
      <a
        href="/api/shopee/auth"
        className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        Conectar loja Shopee
      </a>
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function OrdersTable({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
        Nenhum pedido nos últimos 15 dias.
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Pedido</th>
            <th className="px-4 py-3 font-medium">Data</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Itens</th>
            <th className="px-4 py-3 font-medium text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((o) => (
            <tr key={o.order_sn}>
              <td className="px-4 py-3 font-mono text-gray-900">{o.order_sn}</td>
              <td className="px-4 py-3 text-gray-600">{new Date(o.created_at).toLocaleString("pt-BR")}</td>
              <td className="px-4 py-3 text-gray-600">{STATUS_LABEL[o.status] || o.status}</td>
              <td className="px-4 py-3 text-right text-gray-600">{o.items}</td>
              <td className="px-4 py-3 text-right font-medium text-gray-900">{brl(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
