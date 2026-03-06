import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany();
    return Response.json(vehicles);
  } catch {
    return Response.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const data = {
      brand: body.brand,
      model: body.model,
      fuel_type: body.fuel_type,
      rental_rate: body.rental_rate,
      availability_status: body.availability_status
    };

    const vehicle = await prisma.vehicle.create({ data });
    return Response.json(vehicle, { status: 201 });
  } catch (error) {
    return handlePrismaError(error, "Failed to create vehicle");
  }
}

function handlePrismaError(error, fallbackMessage) {
  if (error?.code === "P2002") {
    return Response.json({ error: "Unique constraint violation" }, { status: 409 });
  }

  if (error?.code === "P2003") {
    return Response.json({ error: "Related record does not exist" }, { status: 400 });
  }

  if (error?.code === "P2025") {
    return Response.json({ error: "Vehicle not found" }, { status: 404 });
  }

  return Response.json({ error: fallbackMessage }, { status: 500 });
}
