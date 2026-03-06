# Vehicle Rental App

Next.js + Prisma + MySQL application for managing:
- vehicles
- customers
- bookings
- payments

It includes both backend API routes and frontend CRUD pages.

## Tech Stack
- Next.js (App Router)
- React
- Prisma ORM
- MySQL
- Tailwind CSS v4

## Prerequisites
- Node.js 18+
- MySQL running locally (or update `DATABASE_URL` to your DB host)

## Environment Variables
Create/update `.env`:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/VehicleRentalDB"
```

## Install & Run
```bash
npm install
npx prisma generate
npm run dev
```

Open: `http://localhost:3000`

## Frontend Pages
- `/` Home dashboard
- `/vehicles` Vehicle management
- `/customers` Customer management
- `/bookings` Booking management
- `/payments` Payment management

## API Routes
### Vehicles
- `GET /api/vehicles`
- `POST /api/vehicles`
- `GET /api/vehicles/:id`
- `PUT /api/vehicles/:id`
- `DELETE /api/vehicles/:id`

### Customers
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/customers/:id`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id`

### Bookings
- `GET /api/bookings`
- `POST /api/bookings`
- `GET /api/bookings/:id`
- `PUT /api/bookings/:id`
- `DELETE /api/bookings/:id`

### Payments
- `GET /api/payments`
- `POST /api/payments`
- `GET /api/payments/:id` (`id` = `booking_id`)
- `PUT /api/payments/:id`
- `DELETE /api/payments/:id`

## Prisma Notes
- Schema file: `prisma/schema.prisma`
- Current schema is mapped to existing DB naming:
  - `CustomerPhone` -> `customer_phone`
  - `Payment.booking_id` -> DB column `payment_id`

If your database schema changes, regenerate client:

```bash
npx prisma generate
```

## Useful Scripts
- `npm run dev` Start dev server
- `npm run lint` Run ESLint
- `npm run build` Build production bundle
- `npm run start` Start production server
