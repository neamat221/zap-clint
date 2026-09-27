import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

loadEnv({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".env"),
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zapshift";
const DB_NAME = process.env.DB_NAME || "zapshift";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

let db;

async function connectDB() {
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`[mongo] connected to ${DB_NAME}`);
}

const col = (name) => db.collection(name);

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
const isObjectId = (value) =>
  typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value);

const findByIdFlexible = async (collection, id) => {
  if (isObjectId(id)) {
    const byId = await collection.findOne({ _id: new ObjectId(id) });
    if (byId) return byId;
  }
  return (
    (await collection.findOne({ id })) ||
    (await collection.findOne({ trackingCode: id })) ||
    (await collection.findOne({ email: id }))
  );
};

const deleteByIdFlexible = async (collection, id) => {
  if (isObjectId(id)) {
    const deleted = await collection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (deleted) return deleted;
  }
  return (
    (await collection.findOneAndDelete({ id })) ||
    (await collection.findOneAndDelete({ trackingCode: id })) ||
    (await collection.findOneAndDelete({ email: id }))
  );
};

const cleanBody = (body) => {
  const { updatedAt, ...rest } = body || {};
  return rest;
};

const now = () => new Date().toISOString();

// ------------------------------------------------------------
// /users
// ------------------------------------------------------------
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "ZapShift API", time: now() });
});

app.get("/users", async (req, res) => {
  try {
    const users = await col("users").find().sort({ createdAt: -1 }).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase();
    const user = await col("users").findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const body = cleanBody(req.body);
    const email = String(body.email || "").toLowerCase();
    if (!email) return res.status(400).json({ error: "Email is required" });
    const existing = await col("users").findOne({ email });
    if (existing) return res.json(existing);
    const user = {
      ...body,
      email,
      role: body.role || "User",
      createdAt: now(),
    };
    const result = await col("users").insertOne(user);
    res.status(201).json({ ...user, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = isObjectId(id)
      ? { _id: new ObjectId(id) }
      : { email: decodeURIComponent(id).toLowerCase() };
    const user = await col("users").findOneAndUpdate(
      filter,
      { $set: cleanBody(req.body) },
      { returnDocument: "after" }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = isObjectId(id)
      ? { _id: new ObjectId(id) }
      : { email: decodeURIComponent(id).toLowerCase() };
    const user = await col("users").findOneAndDelete(filter);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, deleted: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------------------------------------
// /riders
// ------------------------------------------------------------
app.get("/riders", async (req, res) => {
  try {
    const riders = await col("riders").find().sort({ createdAt: -1 }).toArray();
    res.json(riders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/riders", async (req, res) => {
  try {
    const body = cleanBody(req.body);
    const rider = { ...body, status: body.status || "pending", createdAt: now() };
    const result = await col("riders").insertOne(rider);
    res.status(201).json({ ...rider, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/riders/:id", async (req, res) => {
  try {
    const rider = await findByIdFlexible(col("riders"), req.params.id);
    if (!rider) return res.status(404).json({ error: "Rider not found" });

    const body = cleanBody(req.body);
    const isApproved = ["approved", "accepted"].includes(
      String(body.status || "").toLowerCase()
    );

    if (isApproved) {
      const email = String(rider.email || "").toLowerCase();
      if (email) {
        await col("users").updateOne(
          { email },
          {
            $set: { role: "Rider" },
            $setOnInsert: {
              name: rider.name || "",
              createdAt: now(),
            },
          },
          { upsert: true }
        );
      }
    }

    const updated = await col("riders").findOneAndUpdate(
      { _id: rider._id },
      { $set: body },
      { returnDocument: "after" }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/riders/:id", async (req, res) => {
  try {
    const deleted = await deleteByIdFlexible(col("riders"), req.params.id);
    if (!deleted) return res.status(404).json({ error: "Rider not found" });
    res.json({ success: true, deleted: deleted._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------------------------------------
// /parceals
// ------------------------------------------------------------
app.get("/parceals", async (req, res) => {
  try {
    const { riderEmail, riderId, userId, email } = req.query;
    let filter = {};
    if (riderEmail) {
      filter.assignedRiderEmail = decodeURIComponent(String(riderEmail));
    } else if (riderId) {
      filter.assignedRiderId = String(riderId);
    } else if (userId || email) {
      // Owner-scoped query: only return parcels belonging to this user.
      const or = [];
      if (userId) or.push({ userId: String(userId) });
      if (email) or.push({ senderEmail: decodeURIComponent(String(email)) });
      filter.$or = or;
    }
    const parcels = await col("parceals")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    res.json(parcels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/parceals/:id", async (req, res) => {
  try {
    const parcel = await findByIdFlexible(col("parceals"), req.params.id);
    if (!parcel) return res.status(404).json({ error: "Parcel not found" });
    res.json(parcel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/parceals", async (req, res) => {
  try {
    const body = cleanBody(req.body);
    const parcel = {
      ...body,
      status: body.status || "Pending",
      paymentStatus: body.paymentStatus || "Unpaid",
      assignmentStatus: body.assignmentStatus || "",
      rejectedRiderIds: Array.isArray(body.rejectedRiderIds)
        ? body.rejectedRiderIds
        : [],
      createdAt: body.createdAt || now(),
    };
    const result = await col("parceals").insertOne(parcel);
    res.status(201).json({ ...parcel, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/parceals/:id", async (req, res) => {
  try {
    const parcel = await findByIdFlexible(col("parceals"), req.params.id);
    if (!parcel) return res.status(404).json({ error: "Parcel not found" });

    const body = cleanBody(req.body);
    const update = { ...body };
    if (body.rejectedRiderIds !== undefined) {
      update.rejectedRiderIds = Array.isArray(body.rejectedRiderIds)
        ? body.rejectedRiderIds
        : [];
    }

    if (body.assignedRiderEmail) {
      const riderEmail = String(body.assignedRiderEmail).toLowerCase();
      if (riderEmail) {
        await col("users").updateOne(
          { email: riderEmail },
          { $set: { role: "Rider" } },
          { upsert: true }
        );
      }
    }

    const updated = await col("parceals").findOneAndUpdate(
      { _id: parcel._id },
      { $set: update },
      { returnDocument: "after" }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/parceals/:id", async (req, res) => {
  try {
    const deleted = await deleteByIdFlexible(col("parceals"), req.params.id);
    if (!deleted) return res.status(404).json({ error: "Parcel not found" });
    res.json({ success: true, deleted: deleted._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------------------------------------
// /payments
// ------------------------------------------------------------
// /trackings
// ------------------------------------------------------------
app.get("/trackings", async (req, res) => {
  try {
    const trackings = await col("trackings")
      .find()
      .sort({ updatedAt: -1 })
      .toArray();
    res.json(trackings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/trackings/:id", async (req, res) => {
  try {
    const tracking = await findByIdFlexible(col("trackings"), req.params.id);
    if (!tracking) return res.status(404).json({ error: "Tracking not found" });
    res.json(tracking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/trackings", async (req, res) => {
  try {
    const body = cleanBody(req.body);
    const { trackingCode } = body;
    if (!trackingCode) {
      return res.status(400).json({ error: "trackingCode is required" });
    }
    const existing = await col("trackings").findOne({ trackingCode });
    if (existing) {
      const updated = await col("trackings").findOneAndUpdate(
        { _id: existing._id },
        { $set: cleanBody(req.body), $setOnInsert: { createdAt: now() } },
        { returnDocument: "after", upsert: true }
      );
      return res.json(updated);
    }
    const tracking = {
      ...body,
      trackingCode,
      createdAt: now(),
      updatedAt: now(),
    };
    const result = await col("trackings").insertOne(tracking);
    res.status(201).json({ ...tracking, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/trackings/:id", async (req, res) => {
  try {
    const tracking = await findByIdFlexible(col("trackings"), req.params.id);
    if (!tracking) return res.status(404).json({ error: "Tracking not found" });
    const updated = await col("trackings").findOneAndUpdate(
      { _id: tracking._id },
      { $set: { ...cleanBody(req.body), updatedAt: now() } },
      { returnDocument: "after" }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/trackings/:id", async (req, res) => {
  try {
    const deleted = await deleteByIdFlexible(col("trackings"), req.params.id);
    if (!deleted) return res.status(404).json({ error: "Tracking not found" });
    res.json({ success: true, deleted: deleted._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------------------------------------
// /payments
// ------------------------------------------------------------
app.get("/payments", async (req, res) => {
  try {
    const { userId, email } = req.query;
    // Payment history must always be owner-scoped. Without an explicit
    // userId/email no records are returned, so one user can never read
    // another user's payment history.
    if (!userId && !email) {
      return res.json([]);
    }
    const or = [];
    if (userId) or.push({ userId: String(userId) });
    if (email) or.push({ email: decodeURIComponent(String(email)) });
    const payments = await col("payments")
      .find({ $or: or })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/payments", async (req, res) => {
  try {
    const body = cleanBody(req.body);
    const payment = { ...body, createdAt: body.createdAt || now() };
    const result = await col("payments").insertOne(payment);

    const trackingCode = payment.trackingCode || payment.parcelId || "";
    if (trackingCode) {
      const tracking = {
        trackingCode,
        parcelId: payment.parcelId || "",
        parcelName: payment.parcelName || "",
        amount: payment.amount || 0,
        method: payment.method || "unknown",
        transactionId: payment.transactionId || payment.paymentId || "",
        paid: true,
        paidAt: payment.createdAt || now(),
        status: "Paid",
        updatedAt: now(),
      };
      await col("trackings").updateOne(
        { trackingCode },
        {
          $set: tracking,
          $setOnInsert: { createdAt: now() },
          $addToSet: {
            events: {
              type: "payment",
              message: `Payment of ৳${payment.amount || 0} received via ${
                payment.method || "unknown"
              }.`,
              at: payment.createdAt || now(),
            },
          },
        },
        { upsert: true }
      );
    }

    res.status(201).json({ ...payment, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error("[server] error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[server] ZapShift API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("[server] Failed to connect to MongoDB:", error.message);
    console.error("[server] Check MONGODB_URI in server/.env");
    process.exit(1);
  });