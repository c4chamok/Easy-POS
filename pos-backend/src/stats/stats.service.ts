import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getStats(days: number) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    // 1️⃣ Total sales amount (last X days)
    const totalSales = await this.prisma.sale.aggregate({
      _sum: { total: true },
      where: {
        createdAt: { gte: fromDate },
        status: 'COMPLETED',
      },
    });

    // 2️⃣ Sales of (last X days)
    const sales = await this.prisma.$queryRaw<
      { date: Date; totalSales: number; salesCount: number }[]
    >`
      SELECT 
      DATE("createdAt") as date,
      SUM(total) as "totalSales",
      COUNT(*)::int as "salesCount"
      FROM "Sale"
      WHERE "createdAt" >= ${fromDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC;
    `;

    // 3️⃣ Top 5 selling products
    const topProducts = await this.prisma.saleItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      where: {
        sale: {
          createdAt: { gte: fromDate },
          status: 'COMPLETED',
        },
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    // fetch product details
    const productIds = topProducts.map((p) => p.productId);

    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const topSellingProducts = topProducts.map((tp) => {
      const product = products.find((p) => p.id === tp.productId);

      return {
        productId: tp.productId,
        name: product?.name,
        unitsSold: tp._sum.quantity || 0,
      };
    });

    // 4️⃣ Pending sales
    const pendingSales = await this.prisma.sale.count({
      where: {
        status: 'PENDING',
      },
    });

    // 5️⃣ Low stock (<10)
    const lowStockProducts = await this.prisma.product.findMany({
      where: {
        stockQty: {
          lt: 10,
        },
      },
    });

    // 6️⃣ Total product count
    const totalProducts = await this.prisma.product.count();

    return {
      totalSalesAmount: totalSales._sum.total || 0,
      sales,
      topSellingProducts,
      pendingSales,
      lowStockProducts,
      totalProducts,
    };
  }
}
