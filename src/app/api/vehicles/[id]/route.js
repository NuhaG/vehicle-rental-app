import { prisma } from "@/lib/prisma";

// Returns one vehicle by id.
export async function GET(req, context) {
  const params = await context.params;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return Response.json({ error: "Invalid vehicle id" }, { status: 400 });
  }

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { vehicle_id: id },
    });

    if (!vehicle) {
      return Response.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return Response.json(vehicle);
  } catch {
    return Response.json({ error: "Failed to fetch vehicle" }, { status: 500 });
  }
}

// Updates one vehicle by id.
export async function PUT(req, context) {
  const params = await context.params;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return Response.json({ error: "Invalid vehicle id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const data = {};

    if (body.brand !== undefined) data.brand = body.brand;
    if (body.model !== undefined) data.model = body.model;
    if (body.fuel_type !== undefined) data.fuel_type = body.fuel_type;
    if (body.rental_rate !== undefined) data.rental_rate = body.rental_rate;
    if (body.availability_status !== undefined) data.availability_status = body.availability_status;

    const vehicle = await prisma.vehicle.update({
      where: { vehicle_id: id },
      data,
    });

    return Response.json(vehicle);
  } catch (error) {
    return handlePrismaError(error, "Failed to update vehicle");
  }
}

// Deletes one vehicle by id.
export async function DELETE(req, context) {
  const params = await context.params;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return Response.json({ error: "Invalid vehicle id" }, { status: 400 });
  }

  try {
    await prisma.vehicle.delete({
      where: { vehicle_id: id },
    });

    return Response.json({ message: "Vehicle deleted" });
  } catch (error) {
    return handlePrismaError(error, "Failed to delete vehicle");
  }
}

// Maps common Prisma errors to HTTP responses.
function handlePrismaError(error, fallbackMessage) {
  if (error?.code === "P2003") {
    return Response.json(
      { error: "Vehicle is referenced by existing bookings" },
      { status: 409 }
    );
  }

  if (error?.code === "P2025") {
    return Response.json({ error: "Vehicle not found" }, { status: 404 });
  }

  return Response.json({ error: fallbackMessage }, { status: 500 });
}
