import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SectionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOne(id: string) {
    try {
      return await this.databaseService.section.findFirstOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Section with ID ${id} not found.`);
    }
  }

  async findAll() {
    return this.databaseService.section.findMany();
  }
}
