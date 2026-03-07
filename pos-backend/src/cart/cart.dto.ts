import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CartAddDto {
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @IsNotEmpty()
  @IsNumber()
  quantity!: number;
}

export class CartUpdateDto {
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @IsOptional()
  @IsNumber()
  quantity!: number;
}
