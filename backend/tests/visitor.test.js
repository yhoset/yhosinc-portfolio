import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

const testVisitor = { name: "Vero", email: "vero@example.com", password: "password123" };

describe("POST /api/visitor/register", () => {
  it("rechaza contraseña corta", async () => {
    const res = await request(app)
      .post("/api/visitor/register")
      .send({ name: "X", email: "x@example.com", password: "123" });
    expect(res.status).toBe(400);
  });

  it("registra un visitante nuevo y devuelve token", async () => {
    const res = await request(app).post("/api/visitor/register").send(testVisitor);
    expect(res.status).toBe(201);
    expect(typeof res.body.token).toBe("string");
    expect(res.body.name).toBe("Vero");
  });

  it("rechaza un email ya registrado", async () => {
    const res = await request(app).post("/api/visitor/register").send(testVisitor);
    expect(res.status).toBe(409);
  });
});

describe("POST /api/visitor/login", () => {
  it("rechaza credenciales incorrectas", async () => {
    const res = await request(app)
      .post("/api/visitor/login")
      .send({ email: testVisitor.email, password: "contraseña-incorrecta" });
    expect(res.status).toBe(401);
  });

  it("acepta credenciales correctas", async () => {
    const res = await request(app)
      .post("/api/visitor/login")
      .send({ email: testVisitor.email, password: testVisitor.password });
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
  });
});

describe("GET /api/visitor/me", () => {
  it("rechaza sin token", async () => {
    const res = await request(app).get("/api/visitor/me");
    expect(res.status).toBe(401);
  });

  it("acepta con token de visitante válido", async () => {
    const login = await request(app)
      .post("/api/visitor/login")
      .send({ email: testVisitor.email, password: testVisitor.password });
    const res = await request(app).get("/api/visitor/me").set("Authorization", `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testVisitor.email);
  });
});

describe("Separación de roles entre token de admin y de visitante (seguridad)", () => {
  it("un token de visitante NUNCA debe poder acceder a rutas de admin", async () => {
    const login = await request(app)
      .post("/api/visitor/login")
      .send({ email: testVisitor.email, password: testVisitor.password });
    const visitorToken = login.body.token;

    const messages = await request(app).get("/api/admin/messages").set("Authorization", `Bearer ${visitorToken}`);
    expect(messages.status).toBe(401);

    const analytics = await request(app).get("/api/admin/analytics").set("Authorization", `Bearer ${visitorToken}`);
    expect(analytics.status).toBe(401);
  });

  it("un token de admin NUNCA debe poder usarse en rutas de visitante", async () => {
    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD });
    const adminToken = adminLogin.body.token;

    const res = await request(app).get("/api/visitor/me").set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(401);
  });
});
