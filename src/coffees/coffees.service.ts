import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInputError } from 'apollo-server-express';
import { CreateCoffeeInput } from 'src/coffees/dto/create-coffee.input';
import { Repository } from 'typeorm';
import { UpdateCoffeeInput } from './dto/update-coffee.input';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {

  constructor(@InjectRepository(Coffee)
  private readonly coffeesRepository: Repository<Coffee>) {}


  async findAll() {
    return await this.coffeesRepository.find();
  }
  
  async findOne(id: number) {
    const coffee = await this.coffeesRepository.findOne({where: {id}});
    if (!coffee) {
      throw new UserInputError(`Coffee with ID ${id} does not exist`);
    }
    return coffee;
  }

  async update(id: number, updateCoffeeInput: UpdateCoffeeInput) {
    const coffee = await this.coffeesRepository.preload({
      id,
      ...updateCoffeeInput,
    });
    if (!coffee) {
      throw new UserInputError(`Coffee #${id} does not exist`);
    }
    return this.coffeesRepository.save(coffee);
  }
  
  async create(createCoffeeInput: CreateCoffeeInput) {
    const coffee = this.coffeesRepository.create(createCoffeeInput);
    return this.coffeesRepository.save(coffee);
  }
}