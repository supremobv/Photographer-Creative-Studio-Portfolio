import assert from "node:assert/strict";
const origin = process.env.TEST_ORIGIN || "http://127.0.0.1:8794";
assert(
  ["127.0.0.1", "localhost"].includes(new URL(origin).hostname),
  "Run only against a local test preview.",
);
const good = {
  name: "Local COMMON LIGHT API QA",
  email: "qa@example.com",
  phone: "",
  company: "Demo",
  packageId: "brand",
  addons: ["extra-hour", "social-cut"],
  projectId: "objects",
  dateMode: "Flexible",
  date: "bad",
  location: "Test city",
  budget: "Let’s discuss",
  message: "Local API integration test for a product story.",
  consent: "on",
  estimate: 1,
};
const auth = {
  "oai-authenticated-user-id": "local_test_owner",
  "oai-authenticated-user-email": "owner@sites.test",
};
async function post(data, requestOrigin = origin) {
  return fetch(origin + "/api/bookings", {
    method: "POST",
    headers: { Origin: requestOrigin, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
assert.equal((await fetch(origin + "/api/bookings")).status, 401);
for (const patch of [
  { name: " " },
  { email: "bad" },
  { consent: "" },
  { packageId: "bad" },
  { addons: ["bad"] },
  { addons: ["extra-hour", "extra-hour"] },
  { packageId: "portrait", addons: ["social-cut"] },
  { packageId: "custom", addons: ["retouch"] },
  { projectId: "bad" },
  { dateMode: "bad" },
  { dateMode: "Preferred date", date: "2000-01-01" },
  { dateMode: "Preferred date", date: "2099-01-01" },
  { dateMode: "Preferred date", date: "2027-02-29" },
  { location: "" },
  { budget: "bad" },
  { message: "short" },
])
  assert.equal(
    (await post({ ...good, ...patch })).status,
    400,
    JSON.stringify(patch),
  );
assert.equal((await post(good, "https://other.example")).status, 403);
const r = await post(good);
assert.equal(r.status, 201);
const saved = await r.json();
assert.match(saved.reference, /^CL-[A-F0-9]{8}$/);
const list = await fetch(origin + "/api/bookings", { headers: auth });
assert.equal(list.status, 200);
const data = await list.json();
const row = data.inquiries.find((i) => i.reference === saved.reference);
assert(row);
assert.equal(row.estimate, 24000);
assert.equal(row.date, "");
assert.deepEqual(JSON.parse(row.addons), good.addons);
assert.equal(row.projectId, "objects");
assert.equal(row.status, "New");
const custom = await post({
  ...good,
  packageId: "custom",
  addons: [],
  projectId: "none",
});
assert.equal(custom.status, 201);
const update = await fetch(origin + "/api/bookings", {
  method: "PATCH",
  headers: { ...auth, Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({ id: row.id, status: "Proposal sent" }),
});
assert.equal(update.status, 200);
assert.equal(
  (
    await fetch(origin + "/api/bookings", {
      method: "PATCH",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify({ id: row.id, status: "Closed" }),
    })
  ).status,
  401,
);
const fresh = await (
  await fetch(origin + "/api/bookings", { headers: auth })
).json();
assert.equal(
  fresh.inquiries.find((i) => i.id === row.id).status,
  "Proposal sent",
);
assert(
  fresh.inquiries.some((i) => i.packageId === "custom" && i.estimate === null),
);
console.log(
  "Booking API checks passed: origin, contact and consent validation, package/add-on compatibility, server estimate, flexible date normalization, saved inspiration, inbox auth and status persistence. Local test records only.",
);
