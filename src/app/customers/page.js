import ResourceTester from "../_components/resource-tester";

export default function CustomersPage() {
  return (
    <ResourceTester
      title="Customers"
      basePath="/api/customers"
      primaryKey="customer_id"
      fields={[
        { name: "first_name", label: "First Name", type: "text", defaultValue: "Rahul" },
        { name: "last_name", label: "Last Name", type: "text", defaultValue: "Sharma" },
        { name: "street", label: "Street", type: "text", defaultValue: "MG Road" },
        { name: "city", label: "City", type: "text", defaultValue: "Bengaluru" },
        { name: "state", label: "State", type: "text", defaultValue: "Karnataka" },
        { name: "zip", label: "ZIP", type: "text", defaultValue: "560001" },
        { name: "license_no", label: "License No", type: "text", defaultValue: "DL-12345" },
        {
          name: "phones",
          label: "Phone Numbers",
          type: "array",
          defaultValue: "9999999999, 8888888888",
          placeholder: "Comma separated phone numbers"
        }
      ]}
      columns={[
        { key: "customer_id", label: "ID" },
        { key: "first_name", label: "First Name" },
        { key: "last_name", label: "Last Name" },
        { key: "city", label: "City" },
        { key: "license_no", label: "License" },
        { key: "phones", label: "Phones" }
      ]}
    />
  );
}
