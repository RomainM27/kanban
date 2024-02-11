import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BoardsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOne(id: number) {
    try {
      return this.databaseService.board.findFirstOrThrow({
        where: {
          id,
        },
        include: {
          sections: {
            orderBy: {
              order: 'asc',
            },
            include: {
              tasks: {
                orderBy: {
                  order: 'asc',
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
  }
}
