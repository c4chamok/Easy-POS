import { Minus, Plus, Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface CartPanelProps {
  onCheckout: () => void;
}

export function CartPanel({ onCheckout }: CartPanelProps) {
  const { items, subtotal, grandTotal, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const cartItems = Object.values(items);

  return (
    <div className="h-full flex flex-col bg-card rounded-xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">Cart</h2>
          </div>
          {itemCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
              {itemCount} items
            </span>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto p-4 space-y-3 scrollbar-thin">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground/70">Click on products to add them</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg animate-fade-in"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">৳{item.price} each</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-7 h-7"
                  onClick={() => updateQuantity(item.productId, item.qty - 1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <Input
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                  className="w-12 h-7 text-center text-sm px-1"
                  min={1}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="w-7 h-7"
                  onClick={() => updateQuantity(item.productId, item.qty + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              {/* Line Total & Remove */}
              <div className="text-right min-w-[60px]">
                <p className="font-semibold text-sm">৳{item.lineTotal}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-destructive hover:text-destructive"
                  onClick={() => removeFromCart(item.productId)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {cartItems.length > 0 && (
        <div className="p-4 border-t border-border space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>৳{subtotal.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Grand Total</span>
              <span className="text-primary">৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={onCheckout}
              className="w-full gap-2"
              size="lg"
            >
              <CreditCard className="w-4 h-4" />
              Make Order
            </Button>
            <Button
              variant="outline"
              onClick={clearCart}
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Clear Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
