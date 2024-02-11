import { Module } from '@nestjs/common';

import { TasksModule } from './tasks/tasks.module';
import { SectionsModule } from './sections/sections.module';
import { BoardsModule } from './boards/boards.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [TasksModule, SectionsModule, BoardsModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
