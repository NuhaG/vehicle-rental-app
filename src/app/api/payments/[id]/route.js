import { prisma } from "@/lib/prisma";

// Returns one payment by booking id.
export async function GET(req, { params }) {
  params = await params;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return Response.json({ error: "Invalid payment id" }, { status: 400 });
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { booking_id: id }
    });

    if (!payment) {
      return Response.json({ error: "Payment not found" }, { status: 404 });
    }

    return Response.json(payment);
  } catch {
    return Response.json({ error: "Failed to fetch payment" }, { status: 500 });
  }
}

// Updates one payment by booking id.
export async function PUT(req, { params }) {
  params = await params;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return Response.json({ error: "Invalid payment id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const data = {};

    if (body.payment_date !== undefined) data.payment_date = toDate(body.payment_date);
    if (body.payment_method !== undefined) data.payment_method = body.payment_method;
    if (body.payment_status !== undefined) data.payment_status = body.payment_status;

    const payment = await prisma.payment.update({
      where: { booking_id: id },
      data
    });

    return Response.json(payment);
  } catch (error) {
    return handlePrismaError(error, "Failed to update payment");
  }
}

// Deletes one payment by booking id.
export async function DELETE(req, { params }) {
  params = await params;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return Response.json({ error: "Invalid payment id" }, { status: 400 });
  }

  try {
    await prisma.payment.delete({
      where: { booking_id: id }
    });

    return Response.json({ message: "Payment deleted" });
  } catch (error) {
    return handlePrismaError(error, "Failed to delete payment");
  }
}

// Converts date-like inputs to Date objects for Prisma.
function toDate(value) {
  if (!value) return undefined;
  return new Date(value);
}

// Maps common Prisma errors to HTTP responses.
function handlePrismaError(error, fallbackMessage) {
  if (error?.code === "P2003") {
    return Response.json({ error: "booking_id does not reference an existing booking" }, { status: 400 });
  }

  if (error?.code === "P2025") {
    return Response.json({ error: "Payment not found" }, { status: 404 });
  }

  return Response.json({ error: fallbackMessage }, { status: 500 });
}
