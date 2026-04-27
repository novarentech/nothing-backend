import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { generateSlug } from '@helpers/slug.helper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const slug = generateSlug(createProductDto.name);
    const existing = await this.productRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('Product with this name already exists');
    }

    const categories = createProductDto.categoryIds?.length 
      ? await this.categoryRepository.findByIds(createProductDto.categoryIds) 
      : [];

    const product = this.productRepository.create({
      name: createProductDto.name,
      price: createProductDto.price,
      stock: createProductDto.stock,
      slug,
      categories,
    });

    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['categories'] });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id },
      relations: ['categories']
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.name) {
      product.slug = generateSlug(updateProductDto.name);
      product.name = updateProductDto.name;
    }
    if (updateProductDto.price !== undefined) product.price = updateProductDto.price;
    if (updateProductDto.stock !== undefined) product.stock = updateProductDto.stock;

    if (updateProductDto.categoryIds) {
      product.categories = await this.categoryRepository.findByIds(updateProductDto.categoryIds);
    }

    return this.productRepository.save(product);
  }

  async updateImage(id: string, imageUrl: string): Promise<Product> {
    const product = await this.findOne(id);
    product.imageUrl = imageUrl;
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
