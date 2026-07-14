import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

let token;

beforeAll(async () => {
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD });
  token = login.body.token;
});

describe("GET /api/admin/messages", () => {
  it("rechaza sin token", async () => {
    const res = await request(app).get("/api/admin/messages");
    expect(res.status).toBe(401);
  });

  it("acepta con token válido y devuelve un array", async () => {
    const res = await request(app).get("/api/admin/messages").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /api/admin/analytics", () => {
  it("rechaza sin token", async () => {
    const res = await request(app).get("/api/admin/analytics");
    expect(res.status).toBe(401);
  });

  it("acepta con token válido y devuelve el resumen esperado", async () => {
    const res = await request(app).get("/api/admin/analytics").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalPageviews");
    expect(res.body).toHaveProperty("totalProjectViews");
    expect(Array.isArray(res.body.byProject)).toBe(true);
  });
});
