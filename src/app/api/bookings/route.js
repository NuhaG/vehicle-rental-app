import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany();

    return Response.json(bookings);
  } catch {
    return Response.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const booking = await prisma.booking.create({
      data: {
        customer_id: Number(body.customer_id),
        vehicle_id: Number(body.vehicle_id),
        booking_date: toDate(body.booking_date),
        pickup_date: toDate(body.pickup_date),
        return_date: toDate(body.return_date),
        booking_status: body.booking_status,
        total_amount: body.total_amount
      }
    });

    return Response.json(booking, { status: 201 });
  } catch (error) {
    return handlePrismaError(error, "Failed to create booking");
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
