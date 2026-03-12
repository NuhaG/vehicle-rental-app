const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

const customers = [
  { customer_id: 1, first_name: "Rahul", last_name: "Sharma", street: "MG Road", city: "Mumbai", state: "Maharashtra", zip: "400001", license_no: "MH01AB1234" },
  { customer_id: 2, first_name: "Ananya", last_name: "Patel", street: "Ring Road", city: "Ahmedabad", state: "Gujarat", zip: "380001", license_no: "GJ01CD5678" },
  { customer_id: 3, first_name: "Vikram", last_name: "Singh", street: "Connaught Place", city: "Delhi", state: "Delhi", zip: "110001", license_no: "DL01EF9012" },
  { customer_id: 4, first_name: "Priya", last_name: "Kumar", street: "Brigade Road", city: "Bangalore", state: "Karnataka", zip: "560001", license_no: "KA01GH3456" },
  { customer_id: 5, first_name: "Rohan", last_name: "Gupta", street: "Park Street", city: "Kolkata", state: "West Bengal", zip: "700001", license_no: "WB01IJ7890" },
  { customer_id: 6, first_name: "Neha", last_name: "Rao", street: "Juhu Beach", city: "Mumbai", state: "Maharashtra", zip: "400049", license_no: "MH02KL3456" },
  { customer_id: 7, first_name: "Arjun", last_name: "Mehta", street: "S G Highway", city: "Ahmedabad", state: "Gujarat", zip: "380015", license_no: "GJ02MN7890" },
  { customer_id: 8, first_name: "Sanya", last_name: "Kapoor", street: "Sector 18", city: "Noida", state: "Uttar Pradesh", zip: "201301", license_no: "UP01OP2345" },
  { customer_id: 9, first_name: "Karan", last_name: "Malhotra", street: "MG Road", city: "Pune", state: "Maharashtra", zip: "411001", license_no: "MH03QR5678" },
  { customer_id: 10, first_name: "Isha", last_name: "Verma", street: "Park Street", city: "Kolkata", state: "West Bengal", zip: "700071", license_no: "WB02ST9012" },
  { customer_id: 11, first_name: "Kabir", last_name: "Singh", street: "Old Airport Road", city: "Bangalore", state: "Karnataka", zip: "560017", license_no: "KA02UV3456" },
  { customer_id: 12, first_name: "Anika", last_name: "Shah", street: "Andheri East", city: "Mumbai", state: "Maharashtra", zip: "400093", license_no: "MH04WX7890" },
  { customer_id: 13, first_name: "Dev", last_name: "Patel", street: "Navrangpura", city: "Ahmedabad", state: "Gujarat", zip: "380009", license_no: "GJ03YZ1234" },
  { customer_id: 14, first_name: "Riya", last_name: "Khandelwal", street: "Janpath", city: "Delhi", state: "Delhi", zip: "110001", license_no: "DL02AB5678" },
  { customer_id: 15, first_name: "Aditya", last_name: "Joshi", street: "HSR Layout", city: "Bangalore", state: "Karnataka", zip: "560102", license_no: "KA03CD9012" },
];

const customerPhones = [
  { customer_id: 1, phone_number: "9876543210" },
  { customer_id: 1, phone_number: "9123456780" },
  { customer_id: 2, phone_number: "9812345670" },
  { customer_id: 3, phone_number: "9900112233" },
  { customer_id: 4, phone_number: "9988776655" },
  { customer_id: 5, phone_number: "9876501234" },
  { customer_id: 6, phone_number: "9876001234" },
  { customer_id: 7, phone_number: "9811002233" },
  { customer_id: 8, phone_number: "9900223344" },
  { customer_id: 9, phone_number: "9877101234" },
  { customer_id: 10, phone_number: "9877201234" },
  { customer_id: 11, phone_number: "9877301234" },
  { customer_id: 12, phone_number: "9877401234" },
  { customer_id: 13, phone_number: "9877501234" },
  { customer_id: 14, phone_number: "9877601234" },
  { customer_id: 15, phone_number: "9877701234" },
];

const vehicles = [
  { vehicle_id: 1, brand: "Maruti", fuel_type: "petrol", model: "Swift", rental_rate: "1500", availability_status: "available" },
  { vehicle_id: 2, brand: "Hyundai", fuel_type: "diesel", model: "i20", rental_rate: "1800", availability_status: "available" },
  { vehicle_id: 3, brand: "Tata", fuel_type: "electric", model: "Nexon EV", rental_rate: "2200", availability_status: "available" },
  { vehicle_id: 4, brand: "Mahindra", fuel_type: "diesel", model: "Thar", rental_rate: "2500", availability_status: "available" },
  { vehicle_id: 5, brand: "Honda", fuel_type: "petrol", model: "City", rental_rate: "2000", availability_status: "available" },
  { vehicle_id: 6, brand: "Kia", fuel_type: "petrol", model: "Seltos", rental_rate: "2300", availability_status: "available" },
  { vehicle_id: 7, brand: "Toyota", fuel_type: "diesel", model: "Innova", rental_rate: "3000", availability_status: "available" },
  { vehicle_id: 8, brand: "MG", fuel_type: "electric", model: "ZS EV", rental_rate: "2700", availability_status: "available" },
  { vehicle_id: 9, brand: "Renault", fuel_type: "petrol", model: "Kwid", rental_rate: "1200", availability_status: "available" },
  { vehicle_id: 10, brand: "Skoda", fuel_type: "diesel", model: "Rapid", rental_rate: "2100", availability_status: "available" },
  { vehicle_id: 11, brand: "Ford", fuel_type: "petrol", model: "EcoSport", rental_rate: "2400", availability_status: "available" },
  { vehicle_id: 12, brand: "Volkswagen", fuel_type: "diesel", model: "Vento", rental_rate: "2000", availability_status: "available" },
  { vehicle_id: 13, brand: "Mercedes", fuel_type: "diesel", model: "C-Class", rental_rate: "5000", availability_status: "available" },
  { vehicle_id: 14, brand: "BMW", fuel_type: "petrol", model: "X1", rental_rate: "4800", availability_status: "available" },
  { vehicle_id: 15, brand: "Audi", fuel_type: "diesel", model: "A4", rental_rate: "5200", availability_status: "available" },
];

const bookings = [
  { booking_id: 1, customer_id: 1, vehicle_id: 1, booking_date: "2026-02-20", pickup_date: "2026-02-21", return_date: "2026-02-23", booking_status: "confirmed", total_amount: "3000" },
  { booking_id: 2, customer_id: 2, vehicle_id: 2, booking_date: "2026-02-21", pickup_date: "2026-02-22", return_date: "2026-02-24", booking_status: "confirmed", total_amount: "3600" },
  { booking_id: 3, customer_id: 3, vehicle_id: 3, booking_date: "2026-02-22", pickup_date: "2026-02-23", return_date: "2026-02-25", booking_status: "pending", total_amount: "4400" },
  { booking_id: 4, customer_id: 4, vehicle_id: 4, booking_date: "2026-02-23", pickup_date: "2026-02-24", return_date: "2026-02-26", booking_status: "confirmed", total_amount: "5000" },
  { booking_id: 5, customer_id: 5, vehicle_id: 5, booking_date: "2026-02-24", pickup_date: "2026-02-25", return_date: "2026-02-27", booking_status: "cancelled", total_amount: "4000" },
  { booking_id: 6, customer_id: 6, vehicle_id: 6, booking_date: "2026-02-25", pickup_date: "2026-02-26", return_date: "2026-02-28", booking_status: "confirmed", total_amount: "4600" },
  { booking_id: 7, customer_id: 7, vehicle_id: 7, booking_date: "2026-02-26", pickup_date: "2026-02-27", return_date: "2026-03-01", booking_status: "pending", total_amount: "6000" },
  { booking_id: 8, customer_id: 8, vehicle_id: 8, booking_date: "2026-02-27", pickup_date: "2026-02-28", return_date: "2026-03-02", booking_status: "confirmed", total_amount: "5400" },
  { booking_id: 9, customer_id: 9, vehicle_id: 9, booking_date: "2026-02-28", pickup_date: "2026-03-01", return_date: "2026-03-03", booking_status: "confirmed", total_amount: "3600" },
  { booking_id: 10, customer_id: 10, vehicle_id: 10, booking_date: "2026-03-01", pickup_date: "2026-03-02", return_date: "2026-03-04", booking_status: "pending", total_amount: "4200" },
  { booking_id: 11, customer_id: 11, vehicle_id: 11, booking_date: "2026-03-02", pickup_date: "2026-03-03", return_date: "2026-03-05", booking_status: "confirmed", total_amount: "4700" },
  { booking_id: 12, customer_id: 12, vehicle_id: 12, booking_date: "2026-03-03", pickup_date: "2026-03-04", return_date: "2026-03-06", booking_status: "confirmed", total_amount: "4800" },
  { booking_id: 13, customer_id: 13, vehicle_id: 13, booking_date: "2026-03-04", pickup_date: "2026-03-05", return_date: "2026-03-07", booking_status: "pending", total_amount: "10000" },
  { booking_id: 14, customer_id: 14, vehicle_id: 14, booking_date: "2026-03-05", pickup_date: "2026-03-06", return_date: "2026-03-08", booking_status: "confirmed", total_amount: "9600" },
  { booking_id: 15, customer_id: 15, vehicle_id: 15, booking_date: "2026-03-06", pickup_date: "2026-03-07", return_date: "2026-03-09", booking_status: "confirmed", total_amount: "10400" },
];

const payments = [
  { booking_id: 2, payment_date: "2026-02-20", payment_method: "Credit Card", payment_status: "done" },
  { booking_id: 3, payment_date: "2026-02-21", payment_method: "UPI", payment_status: "pending" },
  { booking_id: 4, payment_date: "2026-02-22", payment_method: "Debit Card", payment_status: "done" },
  { booking_id: 5, payment_date: "2026-02-23", payment_method: "Cash", payment_status: "done" },
  { booking_id: 6, payment_date: "2026-02-24", payment_method: "Net Banking", payment_status: "in_progress" },
  { booking_id: 7, payment_date: "2026-02-25", payment_method: "Credit Card", payment_status: "done" },
  { booking_id: 8, payment_date: "2026-02-26", payment_method: "UPI", payment_status: "pending" },
  { booking_id: 9, payment_date: "2026-02-27", payment_method: "Debit Card", payment_status: "done" },
  { booking_id: 10, payment_date: "2026-02-28", payment_method: "Cash", payment_status: "done" },
  { booking_id: 11, payment_date: "2026-03-01", payment_method: "Net Banking", payment_status: "in_progress" },
  { booking_id: 12, payment_date: "2026-03-02", payment_method: "Credit Card", payment_status: "done" },
  { booking_id: 13, payment_date: "2026-03-03", payment_method: "UPI", payment_status: "pending" },
  { booking_id: 14, payment_date: "2026-03-04", payment_method: "Debit Card", payment_status: "done" },
  { booking_id: 15, payment_date: "2026-03-05", payment_method: "Cash", payment_status: "done" },
  { booking_id: 16, payment_date: "2026-03-06", payment_method: "Net Banking", payment_status: "in_progress" },
];

async function main() {
  const [customerCount, vehicleCount, bookingCount, paymentCount] =
    await Promise.all([
      prisma.customer.count(),
      prisma.vehicle.count(),
      prisma.booking.count(),
      prisma.payment.count(),
    ]);

  if (customerCount || vehicleCount || bookingCount || paymentCount) {
    console.log("Seed skipped: database already has data.");
    return;
  }

  await prisma.customer.createMany({
    data: customers,
    skipDuplicates: true,
  });

  await prisma.customerPhone.createMany({
    data: customerPhones,
    skipDuplicates: true,
  });

  await prisma.vehicle.createMany({
    data: vehicles,
    skipDuplicates: true,
  });

  await prisma.booking.createMany({
    data: bookings.map((booking) => ({
      ...booking,
      booking_date: new Date(booking.booking_date),
      pickup_date: new Date(booking.pickup_date),
      return_date: new Date(booking.return_date),
    })),
    skipDuplicates: true,
  });

  const bookingIds = new Set(bookings.map((booking) => booking.booking_id));
  const validPayments = payments.filter((payment) =>
    bookingIds.has(payment.booking_id)
  );

  const skippedPayments = payments.filter(
    (payment) => !bookingIds.has(payment.booking_id)
  );

  if (skippedPayments.length) {
    console.warn(
      `Skipped ${skippedPayments.length} payment(s) with missing booking IDs: ${skippedPayments
        .map((payment) => payment.booking_id)
        .join(", ")}`
    );
  }

  await prisma.payment.createMany({
    data: validPayments.map((payment) => ({
      ...payment,
      payment_date: new Date(payment.payment_date),
    })),
    skipDuplicates: true,
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
