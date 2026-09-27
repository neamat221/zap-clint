// Browser-only (localStorage) data store used by the "Assign Riders" flow so
// that assigning a rider instantly shows up in that rider's dashboard
// "Pending Response" section — no API server / MongoDB required.
//
// When the server happens to be reachable, components may also post/patch the
// same changes as a best-effort sync; the local store is always the source of
// truth for the assignment UI.

const PARCELS_KEY = "zap_my_parcels";
const RIDERS_KEY = "zap_riders";
const USERS_KEY = "zap_users";
const CURRENT_USER_KEY = "zapshift_current_user";

export const STORE_EVENT = "zapshift:store-change";

export const keyOf = (item) => item?._id || item?.id || item?.trackingCode || "";

export const readJSON = (key, fallback) => {
  try {
    const raw = JSON.parse(localStorage.getItem(key));
    return raw === null || raw === undefined ? fallback : raw;
  } catch {
    return fallback;
  }
};

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("[ClientStore] write failed:", error);
  }
};

export const notifyStore = (type) => {
  try {
    window.dispatchEvent(new CustomEvent(STORE_EVENT, { detail: { type } }));
  } catch {
    // ignore
  }
};

// Subscribes to in-tab store changes + cross-tab localStorage events.
export const onStoreChange = (handler) => {
  const onCustom = () => handler();
  const onStorage = () => handler();
  window.addEventListener(STORE_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(STORE_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
};

// Dedupes by key; earlier lists win (so local data keeps its assignment state).
export const mergeKeepFirst = (...lists) => {
  const seen = new Set();
  const out = [];
  lists.forEach((list) => {
    if (!Array.isArray(list)) return;
    list.forEach((item) => {
      const k = keyOf(item);
      if (!k || seen.has(k)) return;
      seen.add(k);
      out.push(item);
    });
  });
  return out;
};

// Ownership gate: a logged-in user must only ever see their OWN parcels.
// Matches on the Firebase uid (userId) or the sender email, so legacy parcels
// that only stored an email still resolve to their owner. Parcels with neither
// userId nor senderEmail are hidden (secure default — no leaking).
export const isOwnParcel = (parcel, { uid, email } = {}) => {
  if (!parcel) return false;
  if (uid && parcel.userId && String(parcel.userId) === String(uid)) return true;
  if (
    email &&
    parcel.senderEmail &&
    String(parcel.senderEmail).toLowerCase() === String(email).toLowerCase()
  ) {
    return true;
  }
  return false;
};

export const scopeParcels = (list, owner = {}) =>
  Array.isArray(list) ? list.filter((p) => isOwnParcel(p, owner)) : [];

// Normalized paid check — accepts any casing of paymentStatus plus the paid flag.
export const isPaidParcel = (parcel) =>
  Boolean(
    parcel &&
      (parcel.paid === true ||
        /^paid$/i.test(String(parcel.paymentStatus || "")))
  );

// ---------------------------------------------------------------
// Parcels (deliveries)
// ---------------------------------------------------------------
export const getParcels = () => readJSON(PARCELS_KEY, []);

export const saveParcels = (list) => {
  writeJSON(PARCELS_KEY, Array.isArray(list) ? list : []);
  notifyStore("parcels");
};

export const patchParcel = (id, patch) => {
  if (!id) return getParcels();
  const list = getParcels();
  const at = list.findIndex((p) => keyOf(p) === String(id));
  const next = [...list];
  if (at >= 0) next[at] = { ...next[at], ...patch };
  else next.push({ ...patch, id });
  saveParcels(next);
  return next;
};

// ---------------------------------------------------------------
// Riders
// ---------------------------------------------------------------
export const getRiders = () => readJSON(RIDERS_KEY, []);

export const saveRiders = (list) => {
  writeJSON(RIDERS_KEY, Array.isArray(list) ? list : []);
  notifyStore("riders");
};

export const upsertRider = (rider) => {
  if (!rider) return getRiders();
  const list = getRiders();
  const id = String(rider._id || rider.id || rider.email || "");
  const at = list.findIndex((r) => String(r._id || r.id || r.email || "") === id);
  const next = [...list];
  if (at >= 0) next[at] = { ...next[at], ...rider };
  else next.push({ ...rider, id: rider.id || rider.email || `rider-${Date.now()}` });
  saveRiders(next);
  return next;
};

// ---------------------------------------------------------------
// Users
// ---------------------------------------------------------------
export const getUsers = () => readJSON(USERS_KEY, []);

export const saveUsers = (list) => {
  writeJSON(USERS_KEY, Array.isArray(list) ? list : []);
  notifyStore("users");
};

export const getCurrentUser = () => readJSON(CURRENT_USER_KEY, {});

export const setCurrentUser = (user) => writeJSON(CURRENT_USER_KEY, user);

// ---------------------------------------------------------------
// Demo seed — only fills stores that are COMPLETELY empty, so real
// local data is never overwritten.
// ---------------------------------------------------------------
const sampleRiders = [
  {
    id: "rider-001",
    name: "Rahim Uddin",
    email: "rahim@zapshift.dev",
    phone: "01711-123001",
    region: "Dhaka",
    district: "Dhaka",
    bike: "Yamaha FZS 2022",
    bikeRegistration: "DHA-2201",
    drivingLicense: "DL-0091",
    nid: "NID-5591",
    about: "Experienced courier rider in Dhaka city.",
    status: "approved",
  },
  {
    id: "rider-002",
    name: "Karim Hossain",
    email: "karim@zapshift.dev",
    phone: "01711-123002",
    region: "Chattogram",
    district: "Chattogram",
    bike: "TVS Apache 2021",
    bikeRegistration: "CHA-3301",
    drivingLicense: "DL-0092",
    nid: "NID-5592",
    about: "Focus on Chattogram metro deliveries.",
    status: "approved",
  },
  {
    id: "rider-003",
    name: "Jashim Ahmed",
    email: "jashim@zapshift.dev",
    phone: "01711-123003",
    region: "Sylhet",
    district: "Sylhet",
    bike: "Honda CB 2020",
    bikeRegistration: "SYL-4401",
    drivingLicense: "DL-0093",
    nid: "NID-5593",
    about: "Sylhet division courier services.",
    status: "accepted",
  },
];

const sampleParcels = [
  {
    id: "parcel-0001",
    trackingCode: "01JWZAP000001",
    userId: "sample-user",
    parcelName: "Business Documents",
    parcelType: "document",
    parcelWeight: 0.5,
    deliveryCost: 120,
    senderName: "TechZone Ltd.",
    senderPhone: "01700-111111",
    senderAddress: "Gulshan 2, Dhaka",
    senderDistrict: "Dhaka",
    receiverName: "Md. Arif Hossain",
    receiverPhone: "01700-222222",
    receiverAddress: "Banani 11, Dhaka",
    receiverDistrict: "Dhaka",
    status: "Ready Pick Up",
    deliveryStatus: "Ready Pick Up",
    paymentStatus: "Paid",
    paid: true,
    paidAt: new Date().toISOString(),
    assignmentStatus: "pending",
    assignedRiderId: "rider-001",
    assignedRiderName: "Rahim Uddin",
    assignedRiderPhone: "01711-123001",
    assignedRiderEmail: "rahim@zapshift.dev",
    riderAssignedAt: new Date().toISOString(),
    rejectedRiderIds: [],
  },
  {
    id: "parcel-0002",
    trackingCode: "01JWZAP000002",
    userId: "sample-user",
    parcelName: "Mobile Phone",
    parcelType: "non-document",
    parcelWeight: 0.8,
    deliveryCost: 150,
    senderName: "Mobile King",
    senderPhone: "01700-333333",
    senderAddress: "Dhanmondi 15, Dhaka",
    senderDistrict: "Dhaka",
    receiverName: "Sadia Rahman",
    receiverPhone: "01700-444444",
    receiverAddress: "Mirpur 10, Dhaka",
    receiverDistrict: "Dhaka",
    status: "Pending",
    paymentStatus: "Paid",
    paid: true,
    paidAt: new Date().toISOString(),
    assignmentStatus: "",
    rejectedRiderIds: [],
  },
  {
    id: "parcel-0003",
    trackingCode: "01JWZAP000003",
    userId: "sample-user",
    parcelName: "Electronics Gadget",
    parcelType: "non-document",
    parcelWeight: 1.4,
    deliveryCost: 220,
    senderName: "BD Gadgets",
    senderPhone: "01700-555555",
    senderAddress: "Uttara Sector 7, Dhaka",
    senderDistrict: "Dhaka",
    receiverName: "Tanvir Islam",
    receiverPhone: "01700-666666",
    receiverAddress: "Agrabad, Chattogram",
    receiverDistrict: "Chattogram",
    status: "Pending",
    paymentStatus: "Paid",
    paid: true,
    paidAt: new Date().toISOString(),
    assignmentStatus: "",
    rejectedRiderIds: [],
  },
];

export const ensureStore = () => {
  if (getRiders().length === 0) {
    saveRiders(
      sampleRiders.map((r) => ({
        ...r,
        createdAt: r.createdAt || new Date().toISOString(),
      }))
    );
  }
  if (getParcels().length === 0) {
    saveParcels(
      sampleParcels.map((p) => ({
        ...p,
        createdAt: p.createdAt || new Date().toISOString(),
      }))
    );
  }
};