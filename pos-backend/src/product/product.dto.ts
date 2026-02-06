import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Product } from '../../generated/prisma/client';

export class ProductAddDto implements Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt'
> {
  @IsNotEmpty()
  @IsString()
  category: string;

  @IsString()
  description: string | null;

  @IsNotEmpty()
  @IsString()
  image: string | null;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @IsNumber()
  stockQty: number;
}
