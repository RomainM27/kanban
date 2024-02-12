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

  async findAll(sectionId?: string) {
    if (sectionId !== undefined && !(await this.isValidSection(sectionId))) {
      throw new BadRequestException(`Section with ID ${sectionId} is invalid.`);
    }

    const queryOptions: { where?: { sectionId: string } } = {};

    if (typeof sectionId !== 'undefined') {
      queryOptions.where = { sectionId };
    }

    return this.databaseService.task.findMany(queryOptions);
  }

  async findOne(id: string) {
    try {
      return await this.databaseService.task.findFirstOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return await this.databaseService.$transaction(async (databaseService) => {
      const task = await databaseService.task.findUnique({
        where: { id },
        select: { sectionId: true, order: true },
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found.`);
      }

      if (updateTaskDto.order) {
        console.log('No order provided in updateTaskDto');

        const { sectionId: newSectionId, order: newOrder } = updateTaskDto;

        const { sectionId: oldSectionId, order: oldOrder } = task;

        if (newOrder < 0) {
          throw new BadRequestException('Order must be a positive integer.');
        }

        // Check if there's a need to update the order within the same or different sections
        if (newOrder !== oldOrder || oldSectionId !== newSectionId) {
          // If the section ID is different, we need to update the order in both sections
          if (oldSectionId !== newSectionId) {
            // check if we can do the movement
            const newSection = await databaseService.section.findUnique({
              where: { id: newSectionId },
              select: { id: true, title: true },
            });

            const oldSection = await databaseService.section.findUnique({
              where: { id: oldSectionId },
              select: { id: true, title: true },
            });

            if (newSection.title === 'TO DO' && oldSection.title === 'DONE') {
              throw new BadRequestException(
                'You cannot move a task from DONE to TO DO.',
              );
            }

            if (newSection.title === 'DONE' && oldSection.title === 'TO DO') {
              throw new BadRequestException(
                'You cannot move a task from TO DO to DONE.',
              );
            }

            // Handle in the old section
            await databaseService.task.updateMany({
              where: { sectionId: oldSectionId, order: { gt: oldOrder } },
              data: { order: { decrement: 1 } },
            });

            // Handle in the new section
            await databaseService.task.updateMany({
              where: {
                sectionId: newSectionId,
                order: { gte: newOrder },
              },
              data: { order: { increment: 1 } },
            });
          }

          // If the section ID is the same, we only need to update the order within the same section
          if (oldSectionId === newSectionId) {
            console.log('Updating order within the same section');

            if (newOrder > oldOrder) {
              console.log('New order is greater than old order');

              await databaseService.task.updateMany({
                where: {
                  sectionId: newSectionId,
                  order: { lte: newOrder, gt: oldOrder },
                },
                data: { order: { decrement: 1 } },
              });
            }

            if (newOrder < oldOrder) {
              console.log('New order is less than old order');

              await databaseService.task.updateMany({
                where: {
                  sectionId: newSectionId,
                  order: { gte: newOrder, lt: oldOrder },
                },
                data: { order: { increment: 1 } },
              });
            }
          }
        }
      }

      const updatedTask = { order: task.order, ...updateTaskDto };

      return databaseService.task.update({
        where: { id },
        data: updatedTask,
      });
    });
  }

  async remove(id: string) {
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

  async findHighestOrderInSection(sectionId: string): Promise<number> {
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

  async isValidSection(sectionId: string): Promise<boolean> {
    const section = await this.databaseService.section.findUnique({
      where: { id: sectionId },
    });
    return !!section;
  }
}
