import { prisma } from "@/lib/prisma";

// Returns all payment records.
export async function GET() {
  try {
    const payments = await prisma.payment.findMany();

    return Response.json(payments);
  } catch {
    return Response.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

// Creates a payment record.
export async function POST(req) {
  try {
    const body = await req.json();

    const payment = await prisma.payment.create({
      data: {
        booking_id: Number(body.booking_id),
        payment_date: toDate(body.payment_date),
        payment_method: body.payment_method,
        payment_status: body.payment_status
      }
    });

    return Response.json(payment, { status: 201 });
  } catch (error) {
    return handlePrismaError(error, "Failed to create payment");
  }
}

// Converts date-like inputs to Date objects for Prisma.
function toDate(value) {
  if (!value) return undefined;
  return new Date(value);
}

// Maps common Prisma errors to HTTP responses.
function handlePrismaError(error, fallbackMessage) {
  if (error?.code === "P2002") {
    return Response.json({ error: "Payment already exists for booking_id" }, { status: 409 });
  }

  if (error?.code === "P2003") {
    return Response.json({ error: "booking_id does not reference an existing booking" }, { status: 400 });
  }

  if (error?.code === "P2025") {
    return Response.json({ error: "Payment not found" }, { status: 404 });
  }

  return Response.json({ error: fallbackMessage }, { status: 500 });
}
