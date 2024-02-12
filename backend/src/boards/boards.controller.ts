import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boards: BoardsService) {}

  @Get('/first')
  findFirst() {
    return this.boards.findFirst();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.boards.findOne(id);
  }
}
