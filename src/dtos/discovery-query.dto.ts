import 'reflect-metadata';
import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min
} from 'class-validator';
import { Expose } from 'class-transformer';

export class DiscoveryQueryDto {
  @Expose()
  @Max(90)
  @Min(-90)
  @IsLatitude({ message: '$property must be a valid earth latitude' })
  @IsNumber({}, { message: '$property must be a number' })
  @IsOptional()
  lat: number = 0;

  @Expose()
  @Max(180)
  @Min(-180)
  @IsLongitude({ message: '$property must be a valid earth longitude' })
  @IsNumber({}, { message: '$property must be a number' })
  @IsOptional()
  long: number = 0;

  @Expose()
  @Min(-1)
  @IsInt()
  @IsOptional()
  limit: number = -1;

  @Expose()
  @IsNotEmpty()
  @IsOptional()
  type?: string;
}
