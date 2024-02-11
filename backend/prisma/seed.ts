import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const board = await prisma.board.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'First board',
      description: 'The first board created with seed',
    },
  });

  const sectionsToCreate = [
    {
      id: 2,
      title: 'TO DO',
      description: 'The first section created with seed',
      order: 1,
      boardId: board.id,
    },
    {
      id: 3,
      title: 'IN PROGRESS',
      description: 'The second section created with seed',
      order: 2,
      boardId: board.id,
    },
    {
      id: 4,
      title: 'DONE',
      description: 'The third section created with seed',
      order: 3,
      boardId: board.id,
    },
  ];

  for (const section of sectionsToCreate) {
    await prisma.section.upsert({
      where: { id: section.id },
      update: {},
      create: section,
    });
  }

  const task = await prisma.task.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'The first task',
      description: 'Enjoy your kanban board',
      order: 1,
      sectionId: 3,
    },
  });

  console.log({ board, task });
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
