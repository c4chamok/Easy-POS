import { useState } from 'react';
import { Banknote, CreditCard, Smartphone, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePOS } from '@/context/POSContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
}

type PaymentMethod = 'cash' | 'card' | 'mobile';

export function PaymentModal({ open, onClose }: PaymentModalProps) {
  const { items, grandTotal, clearCart } = useCart();
  const { addOrder } = usePOS();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountPaid, setAmountPaid] = useState<string>(grandTotal.toString());
  const [customerName, setCustomerName] = useState('');

  const change = parseFloat(amountPaid || '0') - grandTotal;
  const cartItems = Object.values(items);

  const handleConfirm = () => {
    if (parseFloat(amountPaid) < grandTotal && paymentMethod === 'cash') {
      toast.warning('Insufficient Amount', {
        description: 'Amount paid is less than the total.',
      });
      return;
    }

    addOrder({
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
      total: grandTotal,
      paidAmount: parseFloat(amountPaid),
      fullPaid: parseFloat(amountPaid) >= grandTotal,
      status: 'pending',
      paymentMethod,
      customerName: customerName || undefined,
    });

    toast('Order Created!',{
      description: `Order has been placed successfully.${change > 0 ? ` Change: ৳${change.toFixed(2)}` : ''}`,
    });

    clearCart();
    onClose();
    setAmountPaid('');
    setCustomerName('');
  };

  const paymentMethods = [
    { id: 'cash' as const, label: 'Cash', icon: Banknote },
    { id: 'card' as const, label: 'Card', icon: CreditCard },
    { id: 'mobile' as const, label: 'Mobile', icon: Smartphone },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Complete Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Order Summary</h3>
            <div className="space-y-1 max-h-32 overflow-auto scrollbar-thin">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>৳{item.lineTotal}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-border flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Name (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name (Optional)</Label>
            <Input
              id="customer"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setPaymentMethod(id)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                    paymentMethod === id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <Icon className={cn('w-5 h-5', paymentMethod === id && 'text-primary')} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Paid (for cash) */}
          {paymentMethod === 'cash' && (
            <div className="space-y-2">
              <Label htmlFor="amount">Amount Paid</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="text-lg font-semibold"
              />
              {change > 0 && (
                <p className="text-sm text-success font-medium">
                  Change: ৳{change.toFixed(2)}
                </p>
              )}
            </div>
          )}

          {/* Confirm Button */}
          <Button onClick={handleConfirm} className="w-full gap-2" size="lg">
            <Check className="w-4 h-4" />
            Confirm Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
