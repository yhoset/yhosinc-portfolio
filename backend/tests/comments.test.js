import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

let visitorToken;
let adminToken;
let commentId;

beforeAll(async () => {
  const register = await request(app)
    .post("/api/visitor/register")
    .send({ name: "Comentarista", email: "comentarista@example.com", password: "password123" });
  visitorToken = register.body.token;

  const adminLogin = await request(app)
    .post("/api/auth/login")
    .send({ email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD });
  adminToken = adminLogin.body.token;
});

describe("POST /api/projects/:slug/comments", () => {
  it("rechaza sin token de visitante", async () => {
    const res = await request(app).post("/api/projects/neon-commerce/comments").send({ content: "Buenísimo!" });
    expect(res.status).toBe(401);
  });

  it("rechaza contenido vacío", async () => {
    const res = await request(app)
      .post("/api/projects/neon-commerce/comments")
      .set("Authorization", `Bearer ${visitorToken}`)
      .send({ content: "" });
    expect(res.status).toBe(400);
  });

  it("acepta un comentario válido y queda pendiente", async () => {
    const res = await request(app)
      .post("/api/projects/neon-commerce/comments")
      .set("Authorization", `Bearer ${visitorToken}`)
      .send({ content: "Buenísimo trabajo!" });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("pending");
    commentId = res.body.id;
  });
});

describe("GET /api/projects/:slug/comments", () => {
  it("no muestra comentarios pendientes públicamente", async () => {
    const res = await request(app).get("/api/projects/neon-commerce/comments");
    expect(res.status).toBe(200);
    expect(res.body.find((c) => c.id === commentId)).toBeUndefined();
  });

  it("muestra el comentario una vez aprobado por el admin", async () => {
    const approve = await request(app)
      .patch(`/api/admin/comments/${commentId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "approved" });
    expect(approve.status).toBe(200);

    const res = await request(app).get("/api/projects/neon-commerce/comments");
    expect(res.status).toBe(200);
    const found = res.body.find((c) => c.id === commentId);
    expect(found).toBeDefined();
    expect(found.name).toBe("Comentarista");
  });
});

describe("Moderación de comentarios en admin", () => {
  it("rechaza sin token de admin", async () => {
    const res = await request(app).get("/api/admin/comments");
    expect(res.status).toBe(401);
  });

  it("un token de visitante no puede moderar comentarios", async () => {
    const res = await request(app)
      .patch(`/api/admin/comments/${commentId}`)
      .set("Authorization", `Bearer ${visitorToken}`)
      .send({ status: "rejected" });
    expect(res.status).toBe(401);
  });

  it("lista todos los comentarios (cualquier estado) para el admin", async () => {
    const res = await request(app).get("/api/admin/comments").set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((c) => c.id === commentId)).toBe(true);
  });
});
