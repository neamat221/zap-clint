# ZapShift API (Express + MongoDB)

The backend that the frontend (`src/`) connects to at `https://zap-server-xi.vercel.app`.

## Setup

1. Make sure `mongodb` is installed in the project root (already in `package.json`).

2. Open `server/.env` and set your MongoDB connection string:

   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/zapshift
   ```

   For a hosted database use your Atlas string, e.g.:

   ```
   MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/zapshift
   ```

3. Start a MongoDB instance (or use Atlas), then run:

   ```
   npm run server
   ```

   It starts on port `3000` (the same port the frontend axios uses).

## Endpoints

| Method | Route            | Purpose                                                                       |
| ------ | ---------------- | ----------------------------------------------------------------------------- |
| GET    | `/`              | Health check                                                                  |
| GET    | `/users`         | List users                                                                    |
| GET    | `/users/:email`  | Get user by email                                                             |
| POST   | `/users`         | Create user                                                                   |
| PATCH  | `/users/:id`     | Update user (role, name, etc.)                                                |
| DELETE | `/users/:id`     | Delete user                                                                   |
| GET    | `/riders`        | List riders                                                                   |
| POST   | `/riders`        | Submit rider application (Be a Rider)                                         |
| PATCH  | `/riders/:id`    | Approve/reject rider (`{ status }`)                                           |
| DELETE | `/riders/:id`    | Delete rider                                                                  |
| GET    | `/parceals`      | List parcels                                                                  |
| GET    | `/parceals/:id`  | Get parcel by id / tracking code                                              |
| POST   | `/parceals`      | Create parcel                                                                 |
| PATCH  | `/parceals/:id`  | Update parcel (assign rider, accept/reject...)                                |
| DELETE | `/parceals/:id`  | Delete parcel                                                                 |
| GET    | `/payments`      | List payments                                                                 |
| POST   | `/payments`      | Record a payment (also upserts a `trackings` record when the payment is paid) |
| GET    | `/trackings`     | List tracking records                                                         |
| GET    | `/trackings/:id` | Get tracking by id / trackingCode                                             |
| POST   | `/trackings`     | Create tracking record (upserts by trackingCode)                              |
| PATCH  | `/trackings/:id` | Update tracking record                                                        |
| DELETE | `/trackings/:id` | Delete tracking record                                                        |

## Rider assignment flow

The parcel document stores the rider assignment state the frontend relies on:

- `assignedRiderId`, `assignedRiderName`, `assignedRiderPhone`, `assignedRiderEmail`, `riderAssignedAt` — who is assigned.
- `assignmentStatus` — `"pending"` (assigned, awaiting rider), `"accepted"` (rider accepted), `"rejected"` (rider/admin rejected).
- `rejectedRiderIds` — array of rider ids that rejected this parcel (no longer eligible).

These are set/extended via `PATCH /parceals/:id` from the dashboard.
