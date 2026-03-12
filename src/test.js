const { prisma } = require("./lib/prisma");

// Small local script to quickly verify DB connectivity and vehicle reads.
async function main() {
  const vehicles = await prisma.vehicle.findMany();
  console.log(vehicles);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
