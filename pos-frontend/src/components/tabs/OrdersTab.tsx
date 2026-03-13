import { useState } from 'react';
import { Search, ClipboardList } from 'lucide-react';
import type { Order } from '@/types/pos';
import { Input } from '@/components/ui/input';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderPaymentModal } from '@/components/orders/OrderPaymentModal';
import { cn } from '@/lib/utils';
import { useChangeStatusMutation, useGetOrdersQuery } from '@/store/api/orderApi';
import CustomPagination, { type IPagination } from '../common/CustomPagination';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function OrdersTab() {
  // const { orders, updateOrderStatus } = usePOS();
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: 1,
    limit: 10
  });
  const { data, isFetching: isLoading } = useGetOrdersQuery(pagination);
  const [changeStatus] = useChangeStatusMutation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'PAID'>('all');
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);

  const { orders, meta } = data ?? { orders: [], meta: { total: 0, page: 1, limit: 10 } };
  const totalPages = Math.ceil(meta?.total / meta.limit);

  // console.log(meta.page, pagination.currentPage);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">View and manage your orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v: 'all' | 'PENDING' | 'PAID') => setStatusFilter(v)}>
          <SelectTrigger className="w-[150px] bg-card">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              {/* <TableHead className="text-center">Payment</TableHead> */}
              <TableHead className="text-center">Status</TableHead>
              {/* <TableHead className="text-right">Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                {/* Span the cell across all columns to center the message */}
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                </TableCell>
              </TableRow>) :
              filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="w-12 h-12 text-muted-foreground/30" />
                      <p className="text-muted-foreground">No orders found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{order.customerName || '-'}</TableCell>
                    <TableCell className="text-center">{order.items.length}</TableCell>
                    <TableCell className="text-right font-medium">৳{order.total}</TableCell>
                    {/* <TableCell className="text-center">
                    <Badge
                      className={cn(
                        order.fullPaid
                          ? 'bg-success/10 text-success border-success/20'
                          : 'bg-warning/10 text-warning border-warning/20'
                      )}
                      variant="outline"
                    >
                      {order.fullPaid ? 'Paid' : `Due: ৳${order.total - order.paidAmount}`}
                    </Badge>
                  </TableCell> */}
                    <TableCell className="text-center">
                      <Select
                        value={order.status}
                        onValueChange={(v: Order['status']) => 
                          changeStatus({ orderId: order.id, status: v })}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <SelectTrigger
                            className={cn(
                              'w-[110px] h-8 text-xs',
                              order.status === 'PENDING' && 'bg-warning/10 text-warning border-warning/20',
                              order.status === 'COMPLETED' && 'bg-success/10 text-success border-success/20'
                            )}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover z-50">
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="COMPLETED">Delivered</SelectItem>
                          </SelectContent>
                        </div>
                      </Select>
                    </TableCell>
                    {/* <TableCell className="text-right">
                    {!order.fullPaid && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => setPayingOrder(order)}
                      >
                        <CreditCard className="w-3 h-3" />
                        Pay
                      </Button>
                    )}
                    {order.fullPaid && (
                      <Badge variant="outline" className="gap-1 bg-muted">
                        <Check className="w-3 h-3" />
                        Complete
                      </Badge>
                    )}
                  </TableCell> */}
                  </TableRow>
                ))
              )}
          </TableBody>
        </Table>
        <CustomPagination totalPages={totalPages} onChange={(p) => setPagination(p)} />
      </div>

      {/* Payment Modal */}
      <OrderPaymentModal
        order={payingOrder}
        onClose={() => setPayingOrder(null)}
      />
    </div>
  );
}
