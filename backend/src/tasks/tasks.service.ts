import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createTaskDto: CreateTaskDto) {
    const highestOrder = await this.findHighestOrderInSection(
      createTaskDto.sectionId,
    );

    const newTaskOrder = highestOrder + 1;
    const newTask = { ...createTaskDto, order: newTaskOrder };
    return this.databaseService.task.create({
      data: newTask,
    });
  }

  async findAll(sectionId?: number) {
    const queryOptions: { where?: { sectionId: number } } = {};

    if (typeof sectionId !== 'undefined') {
      queryOptions.where = { sectionId };
    }

    return this.databaseService.task.findMany(queryOptions);
  }

  async findOne(id: number) {
    return this.databaseService.task.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.databaseService.task.update({
      where: {
        id,
      },
      data: updateTaskDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.task.delete({
      where: {
        id,
      },
    });
  }

  async findHighestOrderInSection(sectionId: number): Promise<number> {
    const tasks = await this.databaseService.task.findMany({
      where: { sectionId },
      orderBy: { order: 'desc' },
      take: 1,
    });

    // If there are no tasks in the section, return a default value (e.g., 0)
    if (tasks.length === 0) {
      return 0;
    }

    // Return the order of the first task, which has the highest order
    return tasks[0].order;
  }
}
