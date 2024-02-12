import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BoardsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findFirst() {
    const boards = await this.databaseService.board.findMany({
      take: 1,
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

    if (!boards) {
      throw new NotFoundException(`No board found.`);
    }

    return boards[0];
  }

  async findOne(id: string) {
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
