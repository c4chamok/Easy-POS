import { useState } from 'react';
import { usePOS } from '@/context/POSContext';
import type { Order } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface OrderPaymentModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderPaymentModal({ order, onClose }: OrderPaymentModalProps) {
  const { updateOrderPayment } = usePOS();
  const [amount, setAmount] = useState('');

  if (!order) return null;

  const dueAmount = order.total - order.paidAmount;

  const handlePayment = () => {
    const paymentAmount = parseFloat(amount);
    if (!paymentAmount || paymentAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid payment amount.',
        variant: 'destructive',
      });
      return;
    }

    updateOrderPayment(order.id, paymentAmount);
    toast({
      title: 'Payment Recorded',
      description: `৳${paymentAmount} has been recorded for ${order.id}.`,
    });
    setAmount('');
    onClose();
  };

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="bg-card max-w-sm">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-medium">{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Total:</span>
              <span className="font-medium">৳{order.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Already Paid:</span>
              <span className="font-medium">৳{order.paidAmount}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t">
              <span className="text-destructive">Due Amount:</span>
              <span className="text-destructive">৳{dueAmount}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment">Payment Amount</Label>
            <Input
              id="payment"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Enter amount (Max: ৳${dueAmount})`}
              className="text-lg"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setAmount(dueAmount.toString())}
            >
              Pay Full (৳{dueAmount})
            </Button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handlePayment} className="flex-1">
              Record Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
