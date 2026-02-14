import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '../../generated/prisma/client';
import { RedisService } from '../redis/redis.service';
import { ProductAddDto } from './product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPagination } from '../common/utils/pagination';

@Injectable()
export class ProductService {
  private logger: Logger = new Logger(ProductService.name);
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}
  async fetchProducts(query: PaginationDto) {
    //get many products from redis
    const { page, limit, skip } = getPagination(query);
    // const { data: products, count } = await
    const [{ data: products }, dbCount] = await Promise.all([
      this.redis.getMany<Product>('product', {
        page,
        limit,
      }),
      this.prisma.product.count(),
    ]);

    if (products.length == dbCount) {
      return {
        data: products,
        meta: {
          page,
          limit,
          total: dbCount,
          totalPages: Math.ceil(dbCount / limit),
        },
      };
    }

    const productsFromDB = await this.prisma.product.findMany({
      skip,
      take: limit,
    });

    void this.addManyProductToRedis(productsFromDB);
    return {
      data: productsFromDB,
      meta: { page, limit, dbCount, totalPages: Math.ceil(dbCount / limit) },
    };
  }

  async findProductById(id: string) {
    const cached = await this.redis.getRedis<Product>(`product:${id}`);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (product) {
      void this.redis.setRedis(`product:${id}`, product);
    }
    return product;
  }

  async addProduct(p: ProductAddDto) {
    const { id: productId } = await this.prisma.product.create({
      data: { ...p, stockQty: p.stockQty || 0 },
    });
    void this.redis.setRedis(`product:${productId}`, p);
    return { message: `product ${p.sku} added successfully` };
  }

  async addManyProductToRedis(products: ProductAddDto[]) {
    const result = await this.redis.setMany('product', 'id', products);
    if (result.length < products.length) {
      this.logger.error('Failed to add product to redis');
    }
  }

  async updateProduct(p: Partial<Product>) {
    const product = await this.prisma.product.update({
      where: { id: p.id },
      data: p,
    });
    await this.redis.setRedis(`product:${p.id}`, product);
    return { success: true, message: `product ${p.sku} updated successfully` };
  }
  deleteProduct(id: string) {
    void this.redis.delRedis(`product:${id}`);
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
