import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { contactRouter } from "./routes/contact.js";
import { authRouter } from "./routes/auth.js";
import { analyticsRouter } from "./routes/analytics.js";
import { adminRouter } from "./routes/admin.js";
import { visitorRouter } from "./routes/visitor.js";
import { commentsRouter } from "./routes/comments.js";
import { captureError } from "./lib/sentry.js";

export const app = express();

// Render pone la app detrás de un proxy inverso: sin esto, express-rate-limit
// no puede confiar en X-Forwarded-For para identificar la IP real del
// cliente y tira ERR_ERL_UNEXPECTED_X_FORWARDED_FOR en cada request.
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: "10kb" }));

// Límite global: capa extra por si alguien manda muchísimas peticiones a
// cualquier ruta (incluida /api/health) para saturar el servidor. Además
// de este, cada endpoint sensible tiene su propio límite más estricto.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});
app.use(globalLimiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/contact", contactRouter);
app.use("/api/auth", authRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/visitor", visitorRouter);
app.use("/api/projects", commentsRouter);

// Manejador de errores centralizado: nunca se filtra el detalle interno al cliente.
app.use((err, req, res, next) => {
  console.error(err);
  captureError(err);
  res.status(500).json({ error: "Internal server error" });
});
