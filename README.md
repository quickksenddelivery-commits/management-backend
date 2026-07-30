# fanconnectpro-backend

FanConnectPro platform backend — Node.js + Express 5 + Prisma + Neon Postgres.

## Stack

- **Express 5** — HTTP server & routing
- **Prisma** — type-safe ORM & migrations
- **Neon** — serverless Postgres
- **JWT** — stateless auth (`jsonwebtoken`)
- **Winston** — structured logging (console in dev, files in prod)
- **helmet / cors / hpp / compression / express-rate-limit** — security & hardening
- **express-validator** — request validation

## Project structure

```
fanconnectpro-backend/
├── server.js                 # bootstrap: env, DB, HTTP server, graceful shutdown
├── prisma/
│   └── schema.prisma         # data model: User, Celebrity, Event, TicketTier,
│                              #   Order, OrderItem, Ticket, Sponsor,
│                              #   SponsorshipPackage, SponsorshipApplication
├── scripts/
│   ├── seed.js               # seed celebrities/events/packages/sponsors
│   ├── seed-data.js          # the catalog data (mirrors frontend mock)
│   └── seed-admin.js         # create the first admin user
└── src/
    ├── app.js                # express app: middleware + route mounting
    ├── config/
    │   ├── env.js            # env validation + typed access
    │   ├── database.js       # Prisma client singleton + connect/disconnect
    │   └── coins.js          # supported crypto coins + fiat→USD conversion
    ├── middleware/           # auth, errorHandler, rateLimit, requestLogger, validate
    ├── services/             # user.service.js — password hashing, login-lock logic
    ├── controllers/          # auth, user, celebrity, event, payment,
    │                         #   order, ticket, sponsorship
    ├── routes/               # one router per resource (mounted under /api/*)
    └── utils/                # constants, helpers, logger
```

## Getting started

```bash
# 1. Install dependencies (also runs `prisma generate` via postinstall)
npm install

# 2. Create your env file
cp .env.example .env        # then edit values (DATABASE_URL from Neon, JWT secrets, …)

# 3. Push the schema to your Neon database
npm run migrate              # prisma migrate dev — creates tables + migration history

# 4. Seed the catalog + first admin
npm run seed
npm run seed:admin

# 5. Run the dev server (auto-reload)
npm run dev
```

`DATABASE_URL` comes from your Neon project dashboard → **Connection Details**
(use the pooled connection string, and keep `?sslmode=require`). `npm run studio`
opens Prisma Studio, a GUI for browsing/editing the Neon database directly.

Server starts on `http://localhost:5001` (configurable via `PORT`).

This is the API for the **FanConnectPro** celebrity-events & ticketing platform
(frontend: `../management`). All payments settle in cryptocurrency.

All responses use the shape `{ status, data?, meta?, message? }`. List endpoints
accept `?page=` & `?limit=` and return `meta` pagination. IDs mirror the
frontend (`celeb-1`, `event-1`, `tier-1-2`, `pkg-gold`, …).

## API

### Auth — `/api/auth`
| Method | Endpoint    | Auth   | Description                        |
|--------|-------------|--------|------------------------------------|
| POST   | `/register` | —      | `{name,email,password}` → JWT      |
| POST   | `/login`    | —      | `{email,password}` → JWT           |
| POST   | `/logout`   | Bearer | Log out                            |
| GET    | `/me`       | Bearer | Current user                       |

### Users (self) — `/api/users`
| Method | Endpoint                        | Auth   | Description                |
|--------|---------------------------------|--------|----------------------------|
| PATCH  | `/me`                           | Bearer | Update name / avatar       |
| GET    | `/me/following`                 | Bearer | Followed celebrities       |
| POST   | `/me/following/:celebrityId`    | Bearer | Follow                     |
| DELETE | `/me/following/:celebrityId`    | Bearer | Unfollow                   |
| GET    | `/me/saved-events`              | Bearer | Saved events               |
| POST   | `/me/saved-events/:eventId`     | Bearer | Save event                 |
| DELETE | `/me/saved-events/:eventId`     | Bearer | Unsave event               |

### Celebrities — `/api/celebrities`
| Method | Endpoint        | Auth  | Description                                   |
|--------|-----------------|-------|-----------------------------------------------|
| GET    | `/`             | —     | List. Filters: `category`, `search`, `verified` |
| GET    | `/:id`          | —     | One celebrity                                 |
| GET    | `/:id/events`   | —     | Events for a celebrity                        |
| POST   | `/`             | Admin | Create                                        |
| PATCH  | `/:id`          | Admin | Update                                        |
| DELETE | `/:id`          | Admin | Delete                                        |

### Events — `/api/events`
| Method | Endpoint     | Auth  | Description                                                        |
|--------|--------------|-------|-------------------------------------------------------------------|
| GET    | `/`          | —     | List. Filters: `category`,`city`,`country`,`status`,`featured`,`celebrityId`,`search` |
| GET    | `/featured`  | —     | Featured events                                                   |
| GET    | `/:id`       | —     | One event (with ticket tiers)                                    |
| POST   | `/`          | Admin | Create                                                            |
| PATCH  | `/:id`       | Admin | Update                                                            |
| DELETE | `/:id`       | Admin | Delete                                                            |

### Payments — `/api/payments`
| Method | Endpoint  | Auth | Description                                  |
|--------|-----------|------|----------------------------------------------|
| GET    | `/coins`  | —    | Supported coins, networks & wallet addresses |

### Orders & Tickets (checkout) — `/api/orders`, `/api/tickets`
| Method | Endpoint               | Auth   | Description                                              |
|--------|------------------------|--------|---------------------------------------------------------|
| POST   | `/orders`              | Bearer | Create order; reserves seats, returns crypto payment info |
| POST   | `/orders/:id/confirm`  | Bearer | Confirm payment → issues tickets                        |
| GET    | `/orders`              | Bearer | My orders                                               |
| GET    | `/orders/:id`          | Bearer | One order                                               |
| GET    | `/tickets`             | Bearer | My tickets (`?status=active`)                           |
| GET    | `/tickets/:id`         | Bearer | One ticket                                              |

### Sponsorship — `/api/sponsorship`
| Method | Endpoint              | Auth  | Description                                |
|--------|-----------------------|-------|--------------------------------------------|
| GET    | `/packages`           | —     | Sponsorship packages                       |
| GET    | `/packages/:id`       | —     | One package                                |
| GET    | `/sponsors`           | —     | Sponsors. Filters: `eventId`, `platform=true` |
| GET    | `/pending?eventId=`   | —     | Pending sponsor applications for an event (company + tier only) |
| POST   | `/applications`       | —     | Submit a sponsorship application           |
| GET    | `/applications`       | Admin | List applications (`?status=`)             |
| PATCH  | `/applications/:id`   | Admin | Update application status                  |

### Checkout flow

```
POST /api/orders          # { items:[{eventId,tierId,quantity}], attendeeName, attendeeEmail, coin:"USDT" }
   → reserves seats, returns { order, payment:{ coin, network, address, usdTotal, cryptoAmount } }
POST /api/orders/:id/confirm   # { txHash? }  → issues one ticket per seat
GET  /api/tickets         # the user's tickets, each with a qrCode
```

Fiat prices are converted to USD (indicative rates in `src/config/coins.js`)
then to the chosen coin. Seat reservation is atomic and guarded against oversell.

### Example: login

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@fanconnectpro.local","password":"ChangeMe@123"}'
```

## Seeding

```bash
npm run seed         # celebrities, events, sponsorship packages & sponsors (mirrors frontend mock)
npm run seed:admin   # first admin user (admin@fanconnectpro.local / ChangeMe@123)
```

## Adding a resource

1. Add a `model` block to `prisma/schema.prisma`, then run `npm run migrate` to generate & apply the migration.
2. Add `src/controllers/<name>.controller.js` (wrap handlers in `asyncHandler`, query via `prisma.<model>`).
3. Add `src/routes/<name>.routes.js` (validation via `express-validator` + `validate`).
4. Mount it in `src/app.js`: `app.use('/api/<name>', require('./routes/<name>.routes'))`.
5. Protect routes with `authenticate` and, if needed, `authorize('admin')`.
