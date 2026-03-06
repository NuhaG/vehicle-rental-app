const prisma = require("./lib/prisma");

async function main() {
  const vehicles = await prisma.vehicle.findMany();
  console.log(vehicles);
}

main();