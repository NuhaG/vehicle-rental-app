"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// Shared top navigation used across CRUD pages.
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/customers", label: "Customers" },
  { href: "/bookings", label: "Bookings" },
  { href: "/payments", label: "Payments" }
];

// Resolves nested values like "customer.name" from table rows.
function getValueByPath(obj, path) {
  if (!obj) return undefined;
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

// Converts API date values into yyyy-mm-dd for input fields.
function formatDateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

// Turns array-style values into a comma-separated string for form inputs.
function normalizeArrayValue(value) {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && item.phone_number) return item.phone_number;
      return "";
    })
    .filter(Boolean)
    .join(", ");
}

// Formats raw values for table cells.
function formatDisplayValue(value) {
  if (value === null || value === undefined || value === "") return "-";

  if (Array.isArray(value)) return normalizeArrayValue(value) || "-";

  if (typeof value === "object") return "-";

  if (typeof value === "string") {
    const maybeDate = new Date(value);
    if (!Number.isNaN(maybeDate.getTime()) && value.includes("T")) {
      return maybeDate.toLocaleDateString();
    }
  }

  return String(value);
}

// Generic CRUD UI used by vehicles/customers/bookings/payments pages.
export default function ResourceTester({
  title,
  basePath,
  primaryKey,
  fields,
  columns
}) {
  const [records, setRecords] = useState([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Loading...");
  const [lookupId, setLookupId] = useState("");
  const [updateId, setUpdateId] = useState("");

  // Builds default form state from field configuration.
  const defaultForm = useMemo(() => {
    const form = {};
    for (const field of fields) {
      form[field.name] = field.defaultValue ?? "";
    }
    return form;
  }, [fields]);

  const [createForm, setCreateForm] = useState(defaultForm);
  const [updateForm, setUpdateForm] = useState(defaultForm);

  // Base request helper used by all actions.
  async function callApi(method, path, body) {
    const request = {
      method,
      headers: { "Content-Type": "application/json" }
    };
    if (body !== undefined) request.body = JSON.stringify(body);

    const response = await fetch(path, request);
    const rawText = await response.text();
    let data = null;

    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = rawText;
      }
    }

    return { ok: response.ok, status: response.status, data };
  }

  // Parses form values into API-ready payload values.
  function parseField(field, value) {
    if (value === undefined || value === null || value === "") return undefined;

    if (field.type === "number") {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    }

    if (field.type === "date") return value;

    if (field.type === "array") {
      return String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return String(value);
  }

  // Builds request body based on field config and mode.
  function buildPayload(form, mode) {
    const payload = {};

    for (const field of fields) {
      if (mode === "create" && field.creatable === false) continue;
      if (mode === "update" && field.updatable === false) continue;

      const parsed = parseField(field, form[field.name]);
      if (parsed !== undefined) {
        payload[field.name] = parsed;
      }
    }

    return payload;
  }

  // Pre-fills the update form from a selected table row.
  function setFormFromRecord(record) {
    const nextForm = {};

    for (const field of fields) {
      const rawValue = getValueByPath(record, field.name);

      if (field.type === "date") {
        nextForm[field.name] = formatDateInput(rawValue);
      } else if (field.type === "array") {
        nextForm[field.name] = normalizeArrayValue(rawValue);
      } else if (rawValue === undefined || rawValue === null) {
        nextForm[field.name] = "";
      } else {
        nextForm[field.name] = String(rawValue);
      }
    }

    setUpdateForm(nextForm);
    setUpdateId(String(record?.[primaryKey] ?? ""));
  }

  // Fetches and refreshes the table list.
  async function loadAll() {
    setBusy(true);
    setStatus("Loading data...");

    try {
      const result = await callApi("GET", basePath);

      if (!result.ok) {
        setStatus(`Failed to load (${result.status})`);
        return;
      }

      const list = Array.isArray(result.data) ? result.data : [];
      setRecords(list);
      setStatus(`Loaded ${list.length} record(s)`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }

  // Loads one record and pushes it into update form fields.
  async function lookupById() {
    if (!lookupId) {
      setStatus("Enter an ID to load");
      return;
    }

    setBusy(true);
    setStatus("Loading record...");

    try {
      const result = await callApi("GET", `${basePath}/${lookupId}`);
      if (!result.ok || !result.data || typeof result.data !== "object") {
        setStatus(`Record not found (${result.status})`);
        return;
      }

      setFormFromRecord(result.data);
      setStatus(`Loaded record ${lookupId} into Update form`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }

  // Creates a record from the create form.
  async function createRecord() {
    setBusy(true);
    setStatus("Creating...");

    try {
      const result = await callApi("POST", basePath, buildPayload(createForm, "create"));
      if (!result.ok) {
        setStatus(`Create failed (${result.status})`);
        return;
      }

      setCreateForm(defaultForm);
      setStatus("Record created");
      await loadAll();
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }

  // Updates an existing record by selected ID.
  async function updateRecord() {
    if (!updateId) {
      setStatus("Enter or load an ID for update");
      return;
    }

    setBusy(true);
    setStatus("Updating...");

    try {
      const result = await callApi(
        "PUT",
        `${basePath}/${updateId}`,
        buildPayload(updateForm, "update")
      );

      if (!result.ok) {
        setStatus(`Update failed (${result.status})`);
        return;
      }

      setStatus(`Record ${updateId} updated`);
      await loadAll();
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }

  // Deletes a record either by row action or update form ID.
  async function deleteRecord(id) {
    const selectedId = id || updateId;
    if (!selectedId) {
      setStatus("Select a record to delete");
      return;
    }

    setBusy(true);
    setStatus("Deleting...");

    try {
      const result = await callApi("DELETE", `${basePath}/${selectedId}`);
      if (!result.ok) {
        setStatus(`Delete failed (${result.status})`);
        return;
      }

      if (String(updateId) === String(selectedId)) {
        setUpdateId("");
        setUpdateForm(defaultForm);
      }

      setStatus(`Record ${selectedId} deleted`);
      await loadAll();
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }

  // Initial list load whenever the target resource changes.
  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePath]);

  // Renders field control based on configured field type.
  function renderField(field, value, onChange) {
    if (field.type === "select") {
      return (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2"
        >
          <option value="">Select {field.label}</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "array") {
      return (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder || "Comma separated values"}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2"
        />
      );
    }

    return (
      <input
        type={field.type || "text"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder || field.label}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2"
      />
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-4 text-zinc-900 sm:p-8">
      <header className="mb-6 rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm backdrop-blur">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <span className="rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-700">
            {records.length} records
          </span>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-zinc-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-zinc-700">
            <span className="font-semibold text-zinc-900">Status:</span> {status}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={lookupId}
              onChange={(event) => setLookupId(event.target.value)}
              placeholder="Find by ID"
              className="w-32 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2"
            />
            <button
              type="button"
              disabled={busy}
              onClick={lookupById}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              Load
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:col-span-4">
          <h2 className="mb-3 text-lg font-semibold">Create</h2>
          <div className="space-y-3">
            {fields
              .filter((field) => field.creatable !== false)
              .map((field) => (
                <label key={`create-${field.name}`} className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    {field.label}
                  </span>
                  {renderField(field, createForm[field.name], (nextValue) =>
                    setCreateForm((prev) => ({ ...prev, [field.name]: nextValue }))
                  )}
                </label>
              ))}
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={createRecord}
            className="mt-4 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            Create Record
          </button>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:col-span-4">
          <h2 className="mb-3 text-lg font-semibold">Update</h2>
          <label className="mb-3 block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
              {primaryKey}
            </span>
            <input
              value={updateId}
              onChange={(event) => setUpdateId(event.target.value)}
              placeholder="Record ID"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2"
            />
          </label>

          <div className="space-y-3">
            {fields
              .filter((field) => field.updatable !== false)
              .map((field) => (
                <label key={`update-${field.name}`} className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    {field.label}
                  </span>
                  {renderField(field, updateForm[field.name], (nextValue) =>
                    setUpdateForm((prev) => ({ ...prev, [field.name]: nextValue }))
                  )}
                </label>
              ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={updateRecord}
              className="rounded-lg bg-sky-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-sky-300"
            >
              Save
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => deleteRecord()}
              className="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              Delete
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:col-span-4">
          <h2 className="mb-3 text-lg font-semibold">Overview</h2>
          <div className="space-y-2 text-sm text-zinc-700">
            <p>Endpoint: <span className="font-semibold text-zinc-900">{basePath}</span></p>
            <p>Primary Key: <span className="font-semibold text-zinc-900">{primaryKey}</span></p>
            <p>Total Records: <span className="font-semibold text-zinc-900">{records.length}</span></p>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={loadAll}
            className="mt-4 w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            Refresh List
          </button>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:col-span-12">
          <h2 className="mb-3 text-lg font-semibold">Records</h2>
          <div className="overflow-auto">
            <table className="w-full min-w-170 border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  {columns.map((column) => (
                    <th key={column.key} className="px-3 py-2 text-left font-semibold text-zinc-700">
                      {column.label}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left font-semibold text-zinc-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-3 py-6 text-center text-zinc-500">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record[primaryKey]} className="border-b border-zinc-100 hover:bg-zinc-50">
                      {columns.map((column) => (
                        <td key={`${record[primaryKey]}-${column.key}`} className="px-3 py-2 align-top">
                          {formatDisplayValue(getValueByPath(record, column.key))}
                        </td>
                      ))}
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setFormFromRecord(record)}
                            className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-semibold hover:bg-zinc-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteRecord(record[primaryKey])}
                            className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
