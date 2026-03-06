import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  params = await params;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return Response.json({ error: "Invalid booking id" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { booking_id: id }
    });

    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    return Response.json(booking);
  } catch {
    return Response.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  params = await params;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return Response.json({ error: "Invalid booking id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const data = {};

    if (body.customer_id !== undefined) data.customer_id = Number(body.customer_id);
    if (body.vehicle_id !== undefined) data.vehicle_id = Number(body.vehicle_id);
    if (body.booking_date !== undefined) data.booking_date = toDate(body.booking_date);
    if (body.pickup_date !== undefined) data.pickup_date = toDate(body.pickup_date);
    if (body.return_date !== undefined) data.return_date = toDate(body.return_date);
    if (body.booking_status !== undefined) data.booking_status = body.booking_status;
    if (body.total_amount !== undefined) data.total_amount = body.total_amount;

    const booking = await prisma.booking.update({
      where: { booking_id: id },
      data
    });

    return Response.json(booking);
  } catch (error) {
    return handlePrismaError(error, "Failed to update booking");
  }
}

export async function DELETE(req, { params }) {
  params = await params;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return Response.json({ error: "Invalid booking id" }, { status: 400 });
  }

  try {
    await prisma.$transaction([
      prisma.payment.deleteMany({
        where: { booking_id: id }
      }),
      prisma.booking.delete({
        where: { booking_id: id }
      })
    ]);

    return Response.json({ message: "Booking deleted" });
  } catch (error) {
    return handlePrismaError(error, "Failed to delete booking");
  }
}

function toDate(value) {
  if (!value) return undefined;
  return new Date(value);
}

function handlePrismaError(error, fallbackMessage) {
  if (error?.code === "P2003") {
    return Response.json(
      { error: "customer_id or vehicle_id does not reference an existing record" },
      { status: 400 }
    );
  }

  if (error?.code === "P2025") {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }

  return Response.json({ error: fallbackMessage }, { status: 500 });
}
