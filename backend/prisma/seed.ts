import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create dummy data
  const board = await prisma.board.create({
    data: {
      title: 'First board',
      description: 'The first board created with seed',
    },
  });

  const sectionsToCreate = [
    {
      title: 'TO DO',
      description: 'The first section created with seed',
      order: 1,
      boardId: board.id,
    },
    {
      title: 'IN PROGRESS',
      description: 'The second section created with seed',
      order: 2,
      boardId: board.id,
    },
    {
      title: 'DONE',
      description: 'The third section created with seed',
      order: 3,
      boardId: board.id,
    },
  ];

  await prisma.section.createMany({
    data: sectionsToCreate,
  });

  const sections = await prisma.section.findMany();

  const tasksToCreate = [
    {
      title: 'The first task',
      description: 'Enjoy your kanban board',
      order: 1,
      sectionId: sections[0].id,
    },
    {
      title: 'The second task',
      description: 'Enjoy your kanban board',
      order: 1,
      sectionId: sections[1].id,
    },
    {
      title: 'The done task',
      description: 'Enjoy your kanban board',
      order: 1,
      sectionId: sections[2].id,
    },
  ];

  await prisma.task.createMany({
    data: tasksToCreate,
  });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
