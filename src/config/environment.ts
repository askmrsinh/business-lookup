import 'reflect-metadata';
import { Expose } from 'class-transformer';
import { IsOptional, IsPort } from 'class-validator';

export class Environment {
  @Expose()
  @IsPort()
  @IsOptional()
  port: number = 3000;
}
