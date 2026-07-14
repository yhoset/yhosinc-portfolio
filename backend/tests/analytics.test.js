import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("POST /api/analytics/event", () => {
  it("rechaza un type inválido", async () => {
    const res = await request(app).post("/api/analytics/event").send({ type: "algo_random" });
    expect(res.status).toBe(400);
  });

  it("acepta un pageview", async () => {
    const res = await request(app).post("/api/analytics/event").send({ type: "pageview" });
    expect(res.status).toBe(201);
  });

  it("acepta un project_view con projectSlug", async () => {
    const res = await request(app).post("/api/analytics/event").send({ type: "project_view", projectSlug: "neon-commerce" });
    expect(res.status).toBe(201);
  });
});
