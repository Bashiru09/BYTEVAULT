const {PrismaClient}  = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  const user = await prisma.user.create({
    data: { name: 'Alice', email: "Bashiru@gmail.com",
        password: "chsdyhgcdvs"
     },
  });

  console.log('Created User:', user);

  
  const file = await prisma.file.create({
    data: {
      name: 'Test File',
      owner_id: user.id, 
    },
  });

  console.log('Created File:', file);

  
  const result = await prisma.user.findUnique({
    where: { id: user.id },
    include: { files: true },
  });

  console.log('User with files:', result);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
