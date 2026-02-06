import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Product } from '../../generated/prisma/client';
import { ProductService } from './product.service';
import { ProductAddDto } from './product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/utils/api-response';

@Controller('api/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('')
  async fetchProducts(@Query() query: PaginationDto) {
    const dbResponse = await this.productService.fetchProducts(query);
    return ApiResponse.success(
      dbResponse.data,
      'products fetched successfully',
      dbResponse.meta,
    );
  }

  @Post()
  addProduct(@Body() p: ProductAddDto) {
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
