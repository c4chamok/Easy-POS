import { useState, useMemo } from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';
import { ProductCard } from '@/components/sales/ProductCard';
import { CartPanel } from '@/components/sales/CartPanel';
import { PaymentModal } from '@/components/sales/PaymentModal';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories } from '@/data/mockData';
import useProducts from '@/hooks/useProducts';

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc';

export function SalesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const { products } = useProducts();


  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'stock-asc':
          return a.stockQty - b.stockQty;
        case 'stock-desc':
          return b.stockQty - a.stockQty;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 animate-fade-in">
      {/* Left Side - Products */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search & Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px] bg-card">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[150px] bg-card">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low)</SelectItem>
              <SelectItem value="price-desc">Price (High)</SelectItem>
              <SelectItem value="stock-asc">Stock (Low)</SelectItem>
              <SelectItem value="stock-desc">Stock (High)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-auto scrollbar-thin">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <p className="text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground/70">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-[380px] flex-shrink-0">
        <CartPanel onCheckout={() => setIsPaymentOpen(true)} />
      </div>

      {/* Payment Modal */}
      <PaymentModal open={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />
    </div>
  );
}
