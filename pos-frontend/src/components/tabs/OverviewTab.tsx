import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Package,
  Activity,
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePOS } from '@/context/POSContext';
import { salesData, topProducts, recentActivity } from '@/data/mockData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export function OverviewTab() {
  const { products, orders, setActiveTab } = usePOS();
  
  const todaysSales = salesData[salesData.length - 1]?.sales || 0;
  const todaysOrders = salesData[salesData.length - 1]?.orders || 0;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockItems = products.filter(p => p.status === 'low-stock').length;
  const outOfStockItems = products.filter(p => p.status === 'out-of-stock').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <KPICard
          title="Today's Sales"
          value={`৳${todaysSales.toLocaleString()}`}
          change={{ value: 12.5, isPositive: true }}
          icon={DollarSign}
          variant="primary"
          onClick={() => setActiveTab('sales')}
        />
        <KPICard
          title="Orders Today"
          value={todaysOrders}
          change={{ value: 8.2, isPositive: true }}
          icon={ShoppingBag}
          onClick={() => setActiveTab('orders')}
        />
        <KPICard
          title="Pending Orders"
          value={pendingOrders}
          icon={Clock}
          variant={pendingOrders > 0 ? 'warning' : 'default'}
          onClick={() => setActiveTab('orders')}
        />
        <KPICard
          title="Low Stock Items"
          value={lowStockItems}
          icon={AlertTriangle}
          variant={lowStockItems > 0 ? 'destructive' : 'default'}
          onClick={() => setActiveTab('inventory')}
        />
        <KPICard
          title="Total Products"
          value={products.length}
          icon={Package}
          onClick={() => setActiveTab('inventory')}
        />
        <KPICard
          title="Out of Stock"
          value={outOfStockItems}
          icon={AlertTriangle}
          variant={outOfStockItems > 0 ? 'destructive' : 'default'}
          onClick={() => setActiveTab('inventory')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Sales Analytics</CardTitle>
            <Badge variant="secondary">Last 7 Days</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--popover)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                    tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 12)}...` : value}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--popover)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="unitsSold" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Alerts */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products
                .filter(p => p.status !== 'in-stock')
                .slice(0, 5)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">Stock: {product.stockQty}</p>
                      </div>
                    </div>
                    <Badge
                      variant={product.status === 'out-of-stock' ? 'destructive' : 'secondary'}
                      className={product.status === 'low-stock' ? 'bg-warning/10 text-warning border-warning/20' : ''}
                    >
                      {product.status === 'out-of-stock' ? 'Out of Stock' : 'Low Stock'}
                    </Badge>
                  </div>
                ))}
              {products.filter(p => p.status !== 'in-stock').length === 0 && (
                <p className="text-center text-muted-foreground py-8">All products are well stocked!</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === 'order'
                          ? 'bg-primary'
                          : activity.type === 'alert'
                          ? 'bg-warning'
                          : 'bg-success'
                      }`}
                    />
                    <p className="text-sm">{activity.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
