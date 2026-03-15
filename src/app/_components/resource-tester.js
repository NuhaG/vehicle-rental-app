"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/customers", label: "Customers" },
  { href: "/bookings", label: "Bookings" },
  { href: "/payments", label: "Payments" },
];

function getValueByPath(obj, path) {
  if (!obj) return undefined;
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

function formatDateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function normalizeArrayValue(value) {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && item.phone_number)
        return item.phone_number;
      return "";
    })
    .filter(Boolean)
    .join(", ");
}

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

export default function ResourceTester({
  title,
  basePath,
  primaryKey,
  fields,
  columns,
}) {
  const [records, setRecords] = useState([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Loading...");
  const [lookupId, setLookupId] = useState("");
  const [updateId, setUpdateId] = useState("");

  const defaultForm = useMemo(() => {
    const form = {};
    for (const field of fields) {
      form[field.name] = field.defaultValue ?? "";
    }
    return form;
  }, [fields]);

  const [createForm, setCreateForm] = useState(defaultForm);
  const [updateForm, setUpdateForm] = useState(defaultForm);

  async function callApi(method, path, body) {
    const request = {
      method,
      headers: { "Content-Type": "application/json" },
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

  async function createRecord() {
    setBusy(true);
    setStatus("Creating...");

    try {
      const result = await callApi(
        "POST",
        basePath,
        buildPayload(createForm, "create"),
      );
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
        buildPayload(updateForm, "update"),
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

  useEffect(() => {
    loadAll();
  }, [basePath]);

  function renderField(field, value, onChange) {
    if (field.type === "select") {
      return (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2"
        >
          {" "}
          <option value="">Select {field.label}</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}{" "}
            </option>
          ))}{" "}
        </select>
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
    <main className="mx-auto max-w-7xl p-4 sm:p-6 md:p-8 text-zinc-900">
      <header className="mb-6 rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {title}
          </h1>
          <span className="rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase">
            {records.length} records
          </span>
        </div>

        <nav className="flex flex-wrap gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm">
            <span className="font-semibold">Status:</span> {status}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              value={lookupId}
              onChange={(event) => setLookupId(event.target.value)}
              placeholder="Find by ID"
              className="w-full sm:w-32 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
            <button
              disabled={busy}
              onClick={lookupById}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
            >
              Load
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:col-span-4">
          <h2 className="mb-3 text-lg font-semibold">Create</h2>

          <div className="space-y-3">
            {fields
              .filter((field) => field.creatable !== false)
              .map((field) => (
                <label key={field.name} className="block">
                  <span className="text-xs font-semibold">{field.label}</span>
                  {renderField(field, createForm[field.name], (nextValue) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      [field.name]: nextValue,
                    })),
                  )}
                </label>
              ))}
          </div>

          <button
            disabled={busy}
            onClick={createRecord}
            className="mt-4 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Create Record
          </button>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:col-span-4">
          <h2 className="mb-3 text-lg font-semibold">Update</h2>

          <input
            value={updateId}
            onChange={(event) => setUpdateId(event.target.value)}
            placeholder="Record ID"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm mb-3"
          />

          <div className="space-y-3">
            {fields
              .filter((field) => field.updatable !== false)
              .map((field) => (
                <label key={field.name} className="block">
                  <span className="text-xs font-semibold">{field.label}</span>
                  {renderField(field, updateForm[field.name], (nextValue) =>
                    setUpdateForm((prev) => ({
                      ...prev,
                      [field.name]: nextValue,
                    })),
                  )}
                </label>
              ))}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              disabled={busy}
              onClick={updateRecord}
              className="rounded-lg bg-sky-700 px-3 py-2 text-sm font-semibold text-white"
            >
              Save
            </button>

            <button
              disabled={busy}
              onClick={() => deleteRecord()}
              className="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white"
            >
              Delete
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:col-span-4">
          <h2 className="mb-3 text-lg font-semibold">Overview</h2>

          <div className="space-y-2 text-sm">
            <p>
              Endpoint: <b>{basePath}</b>
            </p>
            <p>
              Primary Key: <b>{primaryKey}</b>
            </p>
            <p>
              Total Records: <b>{records.length}</b>
            </p>
          </div>

          <button
            disabled={busy}
            onClick={loadAll}
            className="mt-4 w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white"
          >
            Refresh List
          </button>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:col-span-12">
          <h2 className="mb-3 text-lg font-semibold">Records</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="border-b bg-zinc-50">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-3 py-2 text-left font-semibold"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr
                    key={record[primaryKey]}
                    className="border-b hover:bg-zinc-50"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-3 py-2">
                        {formatDisplayValue(getValueByPath(record, column.key))}
                      </td>
                    ))}

                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setFormFromRecord(record)}
                          className="text-xs border px-2 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteRecord(record[primaryKey])}
                          className="text-xs border border-red-300 bg-red-50 text-red-700 px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
