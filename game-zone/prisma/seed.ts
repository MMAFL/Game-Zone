import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const user1 = await prisma.users.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      username: 'user1',
      password: 'password1',
      email: 'user1@example.com',
      first_name: 'User',
      last_name: 'One',
      age: 25,
      address: '123 Main St',
      sexe: 'male',
      role: 'player',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const user2 = await prisma.users.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      username: 'user2',
      password: 'password2',
      email: 'user2@example.com',
      first_name: 'User',
      last_name: 'Two',
      age: 30,
      address: '456 Elm St',
      sexe: 'female',
      role: 'player',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create rooms
  const room1 = await prisma.rooms.create({
    data: {
      name: 'Room 1',
      created_by: user1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const room2 = await prisma.rooms.create({
    data: {
      name: 'Room 2',
      created_by: user2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Add messages to rooms
  await prisma.messages.createMany({
    data: [
      {
        content: 'Hello from User 1 in Room 1',
        user_id: user1.id,
        room_id: room1.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'Hello from User 2 in Room 2',
        user_id: user2.id,
        room_id: room2.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'Another message from User 1 in Room 1',
        user_id: user1.id,
        room_id: room1.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  // Add user-room relationships
  await prisma.userrooms.createMany({
    data: [
      {
        user_id: user1.id,
        room_id: room1.id,
        joined_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: user2.id,
        room_id: room2.id,
        joined_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: user1.id,
        room_id: room2.id,
        joined_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
