import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createTaskDto: CreateTaskDto) {
    if (!(await this.isValidSection(createTaskDto.sectionId))) {
      throw new BadRequestException(
        `Section with ID ${createTaskDto.sectionId} is invalid.`,
      );
    }

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
    if (sectionId !== undefined && !(await this.isValidSection(sectionId))) {
      throw new BadRequestException(`Section with ID ${sectionId} is invalid.`);
    }

    const queryOptions: { where?: { sectionId: number } } = {};

    if (typeof sectionId !== 'undefined') {
      queryOptions.where = { sectionId };
    }

    return this.databaseService.task.findMany(queryOptions);
  }

  async findOne(id: number) {
    try {
      return await this.databaseService.task.findFirstOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    return await this.databaseService.$transaction(async (databaseService) => {
      const task = await databaseService.task.findUnique({
        where: { id },
        select: { sectionId: true, order: true },
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found.`);
      }

      const { sectionId: newSectionId, order: newOrder } = updateTaskDto;

      const { sectionId: oldSectionId, order: oldOrder } = task;

      if (newOrder < 0) {
        throw new BadRequestException('Order must be a positive integer.');
      }

      // Check if there's a need to update the order within the same or different sections
      if (newOrder !== oldOrder || oldSectionId !== newSectionId) {
        // Handle in the old section
        if (oldSectionId !== newSectionId) {
          await databaseService.task.updateMany({
            where: { sectionId: oldSectionId, order: { gt: oldOrder } },
            data: { order: { decrement: 1 } },
          });
        }

        // Handle in the new section
        await databaseService.task.updateMany({
          where: {
            sectionId: newSectionId,
            ...(oldSectionId !== newSectionId && {
              order: { gte: newOrder },
            }),
          },
          data: { order: { increment: 1 } },
        });
      }

      return databaseService.task.update({
        where: { id },
        data: updateTaskDto,
      });
    });
  }

  async remove(id: number) {
    const task = await this.databaseService.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
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

    // If there are no tasks in the section, return a default value
    if (tasks.length === 0) {
      return 0;
    }

    // Return the order of the first task
    return tasks[0].order;
  }

  async isValidSection(sectionId: number): Promise<boolean> {
    const section = await this.databaseService.section.findUnique({
      where: { id: sectionId },
    });
    return !!section;
  }
}
