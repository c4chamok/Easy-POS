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
import { recentActivity } from '@/data/mockData';
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
import { useGetStatsQuery, type SaleByDayStat } from '@/store/api/statsApi';
import type { Product } from '@/types/pos';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useNavigate } from 'react-router';

type SaleStatType = { date: string; salesTotal: number; salesCount: number };

const SaleDatatoStats = (data: SaleByDayStat[], days: number) => {
  const result: SaleStatType[] = [];

  const saleMap = new Map<string, SaleByDayStat>();
  data.forEach(sale => {
    const d = new Date(sale.createdAt);
    saleMap.set(d.toISOString().split("T")[0], sale)
  });

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const daySale = saleMap.get(key)

    result.push(daySale ? {
      date: key,
      salesCount: daySale._count.id,
      salesTotal: daySale._sum.total,
    } :
      {
        date: key,
        salesCount: 0,
        salesTotal: 0,
      });
  }

  return result;
}

const calculateGrowth = (todaySale: SaleStatType, yesterdaySale: SaleStatType) => {
  const totalDiff = todaySale.salesTotal - yesterdaySale.salesTotal;
  const totalGrowth = totalDiff * 100 / yesterdaySale.salesTotal;
  if (!yesterdaySale.salesTotal) return { value: totalDiff, isPositive: true };
  if (totalDiff > 0) return { value: totalGrowth, isPositive: true };
  if (totalDiff === 0) return { value: 0, isPositive: true };
  return { value: (-1) * totalGrowth, isPositive: false };
}


export function OverviewTab() {
  const { data, isFetching } = useGetStatsQuery();
  const navigate = useNavigate();
  const lowStockItems: Product[] = [];
  const outOfStockItems: Product[] = [];

  const stats = data?.data;

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!stats) {
    throw new Error("Could not fetch stats");
  }

  const {
    lowStockProducts,
    pendingSales,
    sales,
    topSellingProducts,
    totalProducts,
  } = stats!;

  const salesStat = SaleDatatoStats(sales, 30);
  const today = salesStat[salesStat.length - 1];
  const yesterday = salesStat[salesStat.length - 2];

  lowStockProducts.forEach(item => {
    if (item.stockQty < 10 && item.stockQty > 0) {
      lowStockItems.push(item);
    };
    if (item.stockQty === 0){ 
      outOfStockItems.push(item);
    }
  });

  const change = calculateGrowth(today, yesterday);



  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <KPICard
          title="Today's Sales"
          value={`৳${today.salesTotal.toLocaleString()}`}
          change={change}
          icon={DollarSign}
          variant="primary"
          onClick={() => navigate('sales')}
        />
        <KPICard
          title="Orders Today"
          value={today.salesCount}
          icon={ShoppingBag}
          onClick={() => navigate('orders')}
        />
        <KPICard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          onClick={() => navigate('inventory')}
        />
        {pendingSales > 0 &&
          <KPICard
            title="Pending Orders"
            value={pendingSales}
            icon={Clock}
            variant={pendingSales > 0 ? 'warning' : 'default'}
            onClick={() => navigate('orders')}
          />}
        {lowStockItems.length > 0 &&
          <KPICard
            title="Low Stock Items"
            value={lowStockItems.length}
            icon={AlertTriangle}
            variant={lowStockItems.length > 0 ? 'warning' : 'default'}
            onClick={() => navigate('inventory')}
          />}
        {outOfStockItems.length &&
          <KPICard
            title="Out of Stock"
            value={outOfStockItems.length}
            icon={AlertTriangle}
            variant={outOfStockItems.length > 0 ? 'destructive' : 'default'}
            onClick={() => navigate('inventory')}
          />}
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
                <AreaChart data={salesStat}>
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
                    dataKey="salesTotal"
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
                <BarChart data={topSellingProducts} layout="vertical">
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
          <CardContent className=''>
            <div className="space-y-3 max-h-80 overflow-auto scrollbar-thin">
              
              {lowStockProducts
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
                      variant={product.stockQty === 0 ? 'destructive' : 'secondary'}
                      className={product.stockQty === 0 ? 'bg-warning/10 text-warning border-warning/20' : ''}
                    >
                      {product.stockQty === 0 ? 'Out of Stock' : 'Low Stock'}
                    </Badge>
                  </div>
                ))}
              {lowStockItems.length === 0 && (
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
                      className={`w-2 h-2 rounded-full ${activity.type === 'order'
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
