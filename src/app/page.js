import Link from "next/link";

const pages = [
  {
    href: "/vehicles",
    title: "Vehicles",
    desc: "Create inventory, update rates, and track availability.",
    accent: "bg-emerald-500"
  },
  {
    href: "/customers",
    title: "Customers",
    desc: "Capture license details and manage contact numbers.",
    accent: "bg-sky-500"
  },
  {
    href: "/bookings",
    title: "Bookings",
    desc: "Handle rental windows, statuses, and total charges.",
    accent: "bg-amber-500"
  },
  {
    href: "/payments",
    title: "Payments",
    desc: "Record payment method and status by booking.",
    accent: "bg-rose-500"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen p-6 text-zinc-900 sm:p-10">
      <main className="mx-auto max-w-5xl rounded-3xl border border-zinc-200 bg-white/95 p-8 shadow-sm backdrop-blur sm:p-10">
        <p className="mb-3 inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-zinc-600">
          Admin Console
        </p>
        <h1 className="mb-2 text-4xl font-black tracking-tight sm:text-5xl">
          Vehicle Rental Frontend
        </h1>
        <p className="mb-8 max-w-2xl text-zinc-600">
          Unified pages for operations teams to run CRUD actions, validate API responses,
          and troubleshoot data quickly.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className={`h-2.5 w-12 rounded-full ${page.accent}`} />
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Open
                </span>
              </div>
              <h2 className="mb-1 text-xl font-bold">{page.title}</h2>
              <p className="text-sm text-zinc-600">{page.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
