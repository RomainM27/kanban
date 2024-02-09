import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BoardsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOne(id: number) {
    return this.databaseService.board.findUnique({
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
  }
}
