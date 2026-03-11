import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../auth/auth.interface';
import { ApiResponse } from '../common/utils/api-response';
import { CheckoutDto, CompletePaymentDto } from './order.dto';
import { OrderService } from './order.service';

@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  private getUserId(req: AuthenticatedRequest): string {
    const user = req.user as { uid?: string; userId?: string };
    return user.uid || user.userId || '';
  }

  @Post('checkout')
  @UseGuards(AuthGuard)
  async checkout(
    @Request() req: AuthenticatedRequest,
    @Body() body: CheckoutDto,
  ) {
    const userId = this.getUserId(req);
    const sale = await this.orderService.checkoutFromCart(userId, body);
    return ApiResponse.success(sale, 'order created successfully');
  }

  @Patch(':orderId/payment')
  @UseGuards(AuthGuard)
  async completePayment(
    @Param('orderId') orderId: string,
    @Body() body: CompletePaymentDto,
  ) {
    const sale = await this.orderService.completePayment(orderId, body);
    return ApiResponse.success(sale, 'payment completed successfully');
  }

  @Get('')
  @UseGuards(AuthGuard)
  async fetchOrders() {
    const sales = await this.orderService.listOrders();
    return ApiResponse.success(sales, 'orders fetched successfully');
  }

  @Get(':orderId')
  @UseGuards(AuthGuard)
  async fetchOrder(@Param('orderId') orderId: string) {
    const sale = await this.orderService.getOrderById(orderId);
    return ApiResponse.success(sale, 'order fetched successfully');
  }
}
