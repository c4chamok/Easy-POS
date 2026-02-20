import { Info, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Product } from '@/types/pos';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const isInCart = !!items[product.id];
  const isOutOfStock = product.status === 'out-of-stock';

  const handleClick = () => {
    if (!isOutOfStock) {
      addToCart(product);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative bg-card rounded-xl p-4 shadow-card transition-all duration-200',
        !isOutOfStock && 'cursor-pointer hover:shadow-card-hover hover:scale-[1.02]',
        isOutOfStock && 'opacity-60 cursor-not-allowed',
        isInCart && 'ring-2 ring-primary'
      )}
    >
      {/* Info Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Info className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">৳{product.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stock:</span>
                <span className="font-medium">{product.stockQty} units</span>
              </div>
              {product.description && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Badge */}
      <Badge
        className={cn(
          'absolute top-2 left-2 text-xs',
          product.status === 'in-stock' && 'bg-success/10 text-success border-success/20',
          product.status === 'low-stock' && 'bg-warning/10 text-warning border-warning/20',
          product.status === 'out-of-stock' && 'bg-destructive/10 text-destructive border-destructive/20'
        )}
        variant="outline"
      >
        {product.status === 'in-stock' && 'In Stock'}
        {product.status === 'low-stock' && 'Low Stock'}
        {product.status === 'out-of-stock' && 'Out of Stock'}
      </Badge>

      {/* Cart Indicator */}
      {isInCart && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-fade-in">
          <ShoppingCart className="w-3 h-3 text-primary-foreground" />
        </div>
      )}

      {/* Product Image */}
      <div className="aspect-square mb-3 mt-4 overflow-hidden rounded-lg bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
        <p className="text-lg font-bold text-primary">৳{product.price}</p>
      </div>
    </div>
  );
}
