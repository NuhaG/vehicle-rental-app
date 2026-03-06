import ResourceTester from "../_components/resource-tester";

export default function VehiclesPage() {
  return (
    <ResourceTester
      title="Vehicles"
      basePath="/api/vehicles"
      primaryKey="vehicle_id"
      fields={[
        { name: "brand", label: "Brand", type: "text", defaultValue: "Toyota" },
        { name: "model", label: "Model", type: "text", defaultValue: "Corolla" },
        {
          name: "fuel_type",
          label: "Fuel Type",
          type: "select",
          options: ["petrol", "diesel", "electric"],
          defaultValue: "petrol"
        },
        { name: "rental_rate", label: "Rental Rate", type: "number", defaultValue: "2500" },
        {
          name: "availability_status",
          label: "Availability",
          type: "select",
          options: ["available", "booked"],
          defaultValue: "available"
        }
      ]}
      columns={[
        { key: "vehicle_id", label: "ID" },
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "fuel_type", label: "Fuel" },
        { key: "rental_rate", label: "Rate" },
        { key: "availability_status", label: "Status" }
      ]}
    />
  );
}
