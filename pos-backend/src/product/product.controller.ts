import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Product } from '../../generated/prisma/client';
import { ProductService } from './product.service';

@Controller('api/product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get('')
  fetchProducts() {
    return this.productService.fetchProducts();
  }

  @Post()
  addProduct(@Body() p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.productService.addProduct(p);
  }

  @Put()
  updateProduct(@Body() p: Partial<Product>) {
    return this.productService.updateProduct(p);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
