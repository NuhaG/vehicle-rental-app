import { prisma } from "@/lib/prisma";

// Returns one customer by id with phone numbers.
export async function GET(req, { params }) {
  params = await params;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return Response.json({ error: "Invalid customer id" }, { status: 400 });
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { customer_id: id },
      include: { phones: true }
    });

    if (!customer) {
      return Response.json({ error: "Customer not found" }, { status: 404 });
    }

    return Response.json(customer);
  } catch {
    return Response.json({ error: "Failed to fetch customer" }, { status: 500 });
  }
}

// Updates one customer by id (including phones replacement if provided).
export async function PUT(req, { params }) {
  params = await params;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return Response.json({ error: "Invalid customer id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const phoneNumbers = normalizePhoneNumbers(body.phones);

    const customer = await prisma.customer.update({
      where: { customer_id: id },
      data: {
        first_name: body.first_name,
        last_name: body.last_name,
        street: body.street,
        city: body.city,
        state: body.state,
        zip: body.zip,
        license_no: body.license_no,
        phones:
          phoneNumbers !== undefined
            ? {
                deleteMany: {},
                create: phoneNumbers.map((phone_number) => ({ phone_number }))
              }
            : undefined
      },
      include: { phones: true }
    });

    return Response.json(customer);
  } catch (error) {
    return handlePrismaError(error, "Failed to update customer");
  }
}

// Deletes one customer by id.
export async function DELETE(req, { params }) {
  params = await params;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return Response.json({ error: "Invalid customer id" }, { status: 400 });
  }

  try {
    await prisma.customer.delete({
      where: { customer_id: id }
    });

    return Response.json({ message: "Customer deleted" });
  } catch (error) {
    return handlePrismaError(error, "Failed to delete customer");
  }
}

// Normalizes mixed phone input to a clean string array.
function normalizePhoneNumbers(phones) {
  if (phones === undefined) return undefined;
  if (!Array.isArray(phones)) return undefined;

  return phones
    .map((item) => (typeof item === "string" ? item : item?.phone_number))
    .filter((phone) => typeof phone === "string" && phone.trim().length > 0);
}

// Maps common Prisma errors to HTTP responses.
function handlePrismaError(error, fallbackMessage) {
  if (error?.code === "P2002") {
    return Response.json({ error: "license_no must be unique" }, { status: 409 });
  }

  if (error?.code === "P2003") {
    return Response.json(
      { error: "Customer is referenced by existing bookings" },
      { status: 409 }
    );
  }

  if (error?.code === "P2025") {
    return Response.json({ error: "Customer not found" }, { status: 404 });
  }

  return Response.json({ error: fallbackMessage }, { status: 500 });
}
