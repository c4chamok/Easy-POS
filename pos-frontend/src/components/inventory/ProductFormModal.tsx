import { useState } from 'react';
import { type Product } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories } from '@/data/mockData';
import { toast } from 'sonner';
import { useCreateProductMutation, useUpdateProductMutation } from '@/store/api/productsApi';
import { Loader2 } from 'lucide-react';
// import ImageUpload from '../common/ImageUpload';

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  product?: Omit<Product, 'status'> | null;
}

export function ProductFormModal({ open, onClose, product }: ProductFormModalProps) {
  const [createProduct, { isLoading: createLoading }] = useCreateProductMutation()
  const [updateProduct, { isLoading: updateLoading }] = useUpdateProductMutation();
  const isEditing = !!product;
  const isLoading = createLoading || updateLoading;

  const [formData, setFormData] = useState<Omit<Product, 'status'>>(product ?? {
    name: '',
    sku: '',
    category: 'Beverages',
    price: 0,
    stockQty: 0,
    image: '',
    description: '',
    id: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.sku || !formData.price || !formData.stockQty) {
      toast.warning('Validation Error', {
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const productData = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: formData.price,
      stockQty: formData.stockQty,
      image: formData.image,
      description: formData.description,
    };

    if (isEditing && product) {
      try {
        await updateProduct({ id: product.id, data: productData });
        toast.success('Product Updated', {
          description: `${formData.name} has been updated successfully.`,
        });
      } catch (e) {
        if (e instanceof Error) {
          console.error(e);
          toast.error(`Update Error`, {
            description: `${e.message}`
          })
        }
      }
    } else {
      try {
        await createProduct(productData);
        toast.success('Product Added', {
          description: `${formData.name} has been added to inventory.`,
        });
      } catch (e) {
        if (e instanceof Error) {
          console.error(e);
          toast.error(`Create Error`, {
            description: `${e.message}`
          })
        }
      }
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card max-w-md flex-1 overflow-y-auto p-6 scrollbar-thin">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. BEV-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {categories.filter(c => c !== 'All').map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (৳) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Initial Stock *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stockQty}
                onChange={(e) => setFormData({ ...formData, stockQty: parseInt(e.target.value) })}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
            />
            {/* <ImageUpload/> */}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 cursor-pointer"
              disabled={isLoading}
            >
              {
                isLoading ? <Loader2 className="w-4 h-4 animate-spin" />
                :
                isEditing ? 'Update Product' : 'Add Product'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
