import ResourceTester from "../_components/resource-tester";

export default function PaymentsPage() {
  return (
    <ResourceTester
      title="Payments"
      basePath="/api/payments"
      primaryKey="booking_id"
      fields={[
        { name: "booking_id", label: "Booking ID", type: "number", defaultValue: "1", updatable: false },
        { name: "payment_date", label: "Payment Date", type: "date", defaultValue: "2026-03-06" },
        { name: "payment_method", label: "Payment Method", type: "text", defaultValue: "card" },
        {
          name: "payment_status",
          label: "Payment Status",
          type: "select",
          options: ["pending", "in_progress", "done"],
          defaultValue: "pending"
        }
      ]}
      columns={[
        { key: "booking_id", label: "Booking ID" },
        { key: "payment_date", label: "Date" },
        { key: "payment_method", label: "Method" },
        { key: "payment_status", label: "Status" }
      ]}
    />
  );
}
