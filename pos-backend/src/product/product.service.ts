import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '../../generated/prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  fetchProducts() {
    return this.prisma.product.findMany();
  }

  async addProduct(p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    await this.prisma.product.create({
      data: {
        name: p.name,
        sku: p.sku,
        category: p.category,
        price: p.price,
        stockQty: p.stockQty,
        description: p.description,
        image: p.image,
      },
    });
    return { success: true, message: `product ${p.sku} added successfully` };
  }

  async updateProduct(p: Partial<Product>) {
    await this.prisma.product.update({
      where: { id: p.id },
      data: p,
    });
    return { success: true, message: `product ${p.sku} updated successfully` };
  }
  deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
