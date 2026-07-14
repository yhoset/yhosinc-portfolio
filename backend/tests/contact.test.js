import { describe, it, expect, vi } from "vitest";

vi.mock("../src/lib/mailer.js", () => ({
  sendContactEmail: vi.fn().mockResolvedValue(undefined),
  sendVisitorConfirmationEmail: vi.fn().mockResolvedValue(undefined),
}));

const request = (await import("supertest")).default;
const { app } = await import("../src/app.js");
const mailer = await import("../src/lib/mailer.js");

describe("POST /api/contact", () => {
  it("rechaza sin nombre", async () => {
    const res = await request(app).post("/api/contact").send({ email: "a@b.com", message: "hola" });
    expect(res.status).toBe(400);
  });

  it("rechaza email inválido", async () => {
    const res = await request(app).post("/api/contact").send({ name: "Ana", email: "no-es-email", message: "hola" });
    expect(res.status).toBe(400);
  });

  it("rechaza sin mensaje", async () => {
    const res = await request(app).post("/api/contact").send({ name: "Ana", email: "a@b.com" });
    expect(res.status).toBe(400);
  });

  it("acepta datos válidos y manda los dos emails", async () => {
    const res = await request(app)
      .post("/api/contact")
      .send({ name: "Ana", email: "ana@example.com", message: "Hola, quiero contactarte." });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ status: "ok" });
    expect(mailer.sendContactEmail).toHaveBeenCalledWith({
      name: "Ana",
      email: "ana@example.com",
      message: "Hola, quiero contactarte.",
    });
  });
});
