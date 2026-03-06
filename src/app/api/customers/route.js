import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: { phones: true }
    });

    return Response.json(customers);
  } catch {
    return Response.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const phoneNumbers = normalizePhoneNumbers(body.phones);

    const customer = await prisma.customer.create({
      data: {
        first_name: body.first_name,
        last_name: body.last_name,
        street: body.street,
        city: body.city,
        state: body.state,
        zip: body.zip,
        license_no: body.license_no,
        phones: phoneNumbers
          ? {
              create: phoneNumbers.map((phone_number) => ({ phone_number }))
            }
          : undefined
      },
      include: { phones: true }
    });

    return Response.json(customer, { status: 201 });
  } catch (error) {
    return handlePrismaError(error, "Failed to create customer");
  }
}

function normalizePhoneNumbers(phones) {
  if (phones === undefined) return undefined;
  if (!Array.isArray(phones)) return undefined;

  return phones
    .map((item) => (typeof item === "string" ? item : item?.phone_number))
    .filter((phone) => typeof phone === "string" && phone.trim().length > 0);
}

function handlePrismaError(error, fallbackMessage) {
  if (error?.code === "P2002") {
    return Response.json({ error: "license_no must be unique" }, { status: 409 });
  }

  if (error?.code === "P2003") {
    return Response.json({ error: "Related record does not exist" }, { status: 400 });
  }

  if (error?.code === "P2025") {
    return Response.json({ error: "Customer not found" }, { status: 404 });
  }

  return Response.json({ error: fallbackMessage }, { status: 500 });
}
