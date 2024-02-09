import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SectionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOne(id: number) {
    return this.databaseService.section.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  async findAll() {
    return this.databaseService.section.findMany();
  }
}
