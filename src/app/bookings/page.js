import ResourceTester from "../_components/resource-tester";

export default function BookingsPage() {
  return (
    <ResourceTester
      title="Bookings"
      basePath="/api/bookings"
      primaryKey="booking_id"
      fields={[
        { name: "customer_id", label: "Customer ID", type: "number", defaultValue: "1" },
        { name: "vehicle_id", label: "Vehicle ID", type: "number", defaultValue: "1" },
        { name: "booking_date", label: "Booking Date", type: "date", defaultValue: "2026-03-06" },
        { name: "pickup_date", label: "Pickup Date", type: "date", defaultValue: "2026-03-07" },
        { name: "return_date", label: "Return Date", type: "date", defaultValue: "2026-03-10" },
        {
          name: "booking_status",
          label: "Status",
          type: "select",
          options: ["pending", "confirmed", "cancelled"],
          defaultValue: "pending"
        },
        { name: "total_amount", label: "Total Amount", type: "number", defaultValue: "7500" }
      ]}
      columns={[
        { key: "booking_id", label: "ID" },
        { key: "customer_id", label: "Customer ID" },
        { key: "vehicle_id", label: "Vehicle ID" },
        { key: "pickup_date", label: "Pickup" },
        { key: "return_date", label: "Return" },
        { key: "booking_status", label: "Status" },
        { key: "total_amount", label: "Amount" }
      ]}
    />
  );
}
