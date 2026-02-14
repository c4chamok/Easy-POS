import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CartUpdateDto } from './cart.dto';
import { Prisma } from '../../generated/prisma/client';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
  private logger = new Logger(CartService.name);
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private productService: ProductService,
  ) {}

  private cartKey(userId: string) {
    return `cart:user:${userId}`;
  }

  private async refreshCartCache(userId: string) {
    const items = await this.prisma.cart.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    await this.redis.setRedis(this.cartKey(userId), items);
    return items;
  }

  async getCart(userId: string) {
    const key = this.cartKey(userId);
    const cached =
      await this.redis.getRedis<
        Prisma.CartGetPayload<{ include: { product: true } }>[]
      >(key);

    if (cached) return cached;

    return this.refreshCartCache(userId);
  }

  // async addItem(userId: string, dto: CartAddDto) {
  //   // will add items to cart if not exist, otherwise update quantity and unit price
  //   // will add new item to cache if exist, otherwise refresh cache
  //   if (dto.quantity <= 0) {
  //     throw new BadRequestException('Quantity must be greater than 0');
  //   }

  //   const product = await this.productService.findProductById(dto.productId);
  //   if (!product) {
  //     throw new BadRequestException('Product not found');
  //   }

  //   if (product.stockQty < dto.quantity) {
  //     throw new BadRequestException('Product out of stock');
  //   }

  //   const item = await this.prisma.cart.upsert({
  //     where: {
  //       userId_productId: {
  //         userId,
  //         productId: dto.productId,
  //       },
  //     },
  //     update: {
  //       quantity: dto.quantity,
  //       unitPrice: dto.unitPrice,
  //     },
  //     create: {
  //       userId,
  //       productId: dto.productId,
  //       quantity: dto.quantity,
  //       unitPrice: dto.unitPrice,
  //     },
  //     include: { product: true },
  //   });

  //   const key = this.cartKey(userId);
  //   const cached =
  //     await this.redis.getRedis<
  //       Prisma.CartGetPayload<{ include: { product: true } }>[]
  //     >(key);

  //   if (cached) {
  //     const idx = cached.findIndex((c) => c.productId === dto.productId);
  //     if (idx >= 0) {
  //       cached[idx] = item;
  //     } else {
  //       cached.unshift(item);
  //     }
  //     await this.redis.setRedis(key, cached);
  //   } else {
  //     void this.refreshCartCache(userId);
  //   }

  //   return item;
  // }

  async updateCartItem(userId: string, dto: CartUpdateDto) {
    const product = await this.productService.findProductById(dto.productId);
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.stockQty < dto.quantity) {
      throw new BadRequestException('Product out of stock');
    }

    if (dto.quantity === 0) {
      const result = await this.removeItem(userId, dto.productId);
      return result;
    }

    const item = await this.prisma.cart.upsert({
      where: { userId_productId: { userId, productId: dto.productId } },
      update: {
        quantity: dto.quantity,
        unitPrice: product.price,
      },
      create: {
        userId,
        productId: dto.productId,
        quantity: dto.quantity,
        unitPrice: product.price,
      },
      include: { product: true },
    });

    const key = this.cartKey(userId);
    const cached =
      await this.redis.getRedis<
        Prisma.CartGetPayload<{ include: { product: true } }>[]
      >(key);

    if (cached) {
      const idx = cached.findIndex((c) => c.productId === dto.productId);
      if (idx >= 0) {
        cached[idx] = item;
        await this.redis.setRedis(key, cached);
      } else {
        void this.refreshCartCache(userId);
      }
    } else {
      void this.refreshCartCache(userId);
    }

    return item;
  }

  async removeItem(userId: string, productId: string) {
    const deleted = await this.prisma.cart.deleteMany({
      where: { userId, productId },
    });

    if (!deleted.count) {
      throw new BadRequestException('Cart item not found');
    }

    const key = this.cartKey(userId);
    const cached =
      await this.redis.getRedis<
        Prisma.CartGetPayload<{ include: { product: true } }>[]
      >(key);

    if (cached) {
      const next = cached.filter((c) => c.productId !== productId);
      await this.redis.setRedis(key, next);
    } else {
      void this.refreshCartCache(userId);
    }

    return { removed: deleted.count };
  }

  async clearCart(userId: string) {
    const deleted = await this.prisma.cart.deleteMany({
      where: { userId },
    });
    await this.redis.delRedis(this.cartKey(userId));
    this.logger.log(`Cleared ${deleted.count} cart items for ${userId}`);
    return { removed: deleted.count };
  }
}
