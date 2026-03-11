import { PaymentType } from '../../generated/prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CheckoutDto {
  @IsNotEmpty()
  @IsEnum(PaymentType)
  paymentMethod!: PaymentType;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsNotEmpty()
  @IsNumber()
  paidAmount!: number;
}

export class CompletePaymentDto {
  @IsOptional()
  @IsEnum(PaymentType)
  paymentMethod?: PaymentType;
}
