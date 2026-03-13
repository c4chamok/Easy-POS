import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SaleStatus, PaymentType, Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CheckoutDto, CompletePaymentDto } from './order.dto';
import { Sql } from '../../generated/prisma/internal/prismaNamespace';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPagination } from '../common/utils/pagination';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private cartKey(userId: string) {
    return `cart:user:${userId}`;
  }

  private async invalidateProductCache(productIds: string[]) {
    if (!productIds.length) return;
    await Promise.all(
      productIds.map((productId) =>
        this.redis.delRedis(`product:${productId}`),
      ),
    );
  }

  private async createSaleFromCart(
    tx: Prisma.TransactionClient,
    userId: string,
    dto: CheckoutDto,
  ) {
    const cartItems = await tx.cart.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!cartItems.length) {
      throw new BadRequestException('Cart is empty');
    }

    //single loop for insufficientStock, invalid quantity, total, productIds, saleItemsData, cases for stock update

    let total = 0;
    const saleItemsData: {
      productId: string;
      quantity: number;
      unitPrice: number;
    }[] = [];
    const cases: Sql[] = [];
    const productIds: string[] = [];

    for (const item of cartItems) {
      if (item.quantity <= 0) {
        throw new BadRequestException('Cart contains invalid quantity');
      }
      if (item.product.stockQty < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${item.product.name}`,
        );
      }

      total += item.quantity * item.product.price; // calculate total price

      saleItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product.price,
      }); // creating sale items data for creating sale record

      cases.push(
        Prisma.sql`WHEN "id" = ${item.productId} THEN "stockQty" - ${item.quantity}`,
      ); // creating cases for batch stock update

      productIds.push(item.productId); // collect productIds for cache invalidation
    }

    await tx.$executeRaw(
      Prisma.sql`
    UPDATE "Product"
    SET "stockQty" = CASE
      ${Prisma.join(cases, ` `)}
      ELSE "stockQty"
    END
    WHERE "id" IN (${Prisma.join(cartItems.map((i) => i.productId))})`,
    ); // batch update stock quantity

    const sale = await tx.sale.create({
      data: {
        paymentMethod: dto.paymentMethod,
        customerName: dto.customerName,
        total,
        status: SaleStatus.PENDING,
        items: {
          createMany: {
            data: saleItemsData,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    await tx.cart.deleteMany({ where: { userId } });
    return { sale, productIds: saleItemsData.map((item) => item.productId) };
  }

  async checkoutFromCart(userId: string, dto: CheckoutDto) {
    const { sale, productIds } = await this.prisma.$transaction((tx) =>
      this.createSaleFromCart(tx, userId, dto),
    );

    await Promise.all([
      this.redis.delRedis(this.cartKey(userId)),
      this.invalidateProductCache(productIds),
    ]);

    return sale;
  }

  async listOrders(dto: PaginationDto) {
    const { limit, skip, page } = getPagination(dto);
    const [orders, total] = await Promise.all([
      this.prisma.sale.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        skip,
        take: limit,
      }),
      this.prisma.sale.count(),
    ]);
    return {
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(orderId: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      throw new NotFoundException('Order not found');
    }

    return sale;
  }

  async completePayment(orderId: string, dto: CompletePaymentDto) {
    const sale = await this.prisma.sale.findUnique({
      where: { id: orderId },
    });

    if (!sale) {
      throw new NotFoundException('Order not found');
    }

    if (sale.status === SaleStatus.COMPLETED) {
      return sale;
    }

    return this.prisma.sale.update({
      where: { id: orderId },
      data: {
        status: SaleStatus.COMPLETED,
        paymentMethod:
          dto.paymentMethod ?? sale.paymentMethod ?? PaymentType.CASH,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
