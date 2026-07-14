import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("POST /api/auth/login", () => {
  it("rechaza credenciales incorrectas", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: process.env.SEED_ADMIN_EMAIL, password: "contraseña-incorrecta" });
    expect(res.status).toBe(401);
  });

  it("rechaza un email que no existe", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "no-existe@example.com", password: "cualquiera" });
    expect(res.status).toBe(401);
  });

  it("acepta credenciales correctas y devuelve un token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD });
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
  });
});

describe("GET /api/auth/me", () => {
  it("rechaza sin token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("rechaza un token inválido", async () => {
    const res = await request(app).get("/api/auth/me").set("Authorization", "Bearer token-falso");
    expect(res.status).toBe(401);
  });

  it("acepta un token válido", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD });
    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(process.env.SEED_ADMIN_EMAIL);
  });
});
