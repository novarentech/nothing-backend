import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { S3Helper } from '@helpers/s3.helper';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductsController],
  providers: [ProductsService, S3Helper],
  exports: [ProductsService]
})
export class ProductsModule { }
