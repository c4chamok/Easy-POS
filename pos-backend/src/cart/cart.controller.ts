import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../auth/auth.interface';
import { CartAddDto, CartUpdateDto } from './cart.dto';
import { ApiResponse } from '../common/utils/api-response';

@Controller('api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  private getUserId(req: AuthenticatedRequest): string {
    const user = req.user as { uid?: string; userId?: string };
    return user.uid || user.userId || '';
  }

  @Get('')
  @UseGuards(AuthGuard)
  async getMyCart(@Request() req: AuthenticatedRequest) {
    const userId = this.getUserId(req);
    const items = await this.cartService.getCart(userId);
    return ApiResponse.success(items, 'cart fetched successfully');
  }

  @Post('')
  @UseGuards(AuthGuard)
  async addToCart(
    @Request() req: AuthenticatedRequest,
    @Body() body: CartAddDto,
  ) {
    const userId = this.getUserId(req);
    const item = await this.cartService.updateCartItem(userId, body);
    return ApiResponse.success(item, 'item added to cart');
  }

  @Put('')
  @UseGuards(AuthGuard)
  async updateCartItem(
    @Request() req: AuthenticatedRequest,
    @Body() body: CartUpdateDto,
  ) {
    const userId = this.getUserId(req);
    const item = await this.cartService.updateCartItem(userId, body);
    return ApiResponse.success(item, 'cart item updated');
  }

  @Delete('item/:productId')
  @UseGuards(AuthGuard)
  async removeCartItem(
    @Request() req: AuthenticatedRequest,
    @Param('productId') productId: string,
  ) {
    const userId = this.getUserId(req);
    const result = await this.cartService.removeItem(userId, productId);
    return ApiResponse.success(result, 'cart item removed');
  }

  @Delete('clear')
  @UseGuards(AuthGuard)
  async clearCart(@Request() req: AuthenticatedRequest) {
    const userId = this.getUserId(req);
    const result = await this.cartService.clearCart(userId);
    return ApiResponse.success(result, 'cart cleared');
  }
}
