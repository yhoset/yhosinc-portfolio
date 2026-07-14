import * as Sentry from "@sentry/node";

// Sin SENTRY_DSN configurado, todas las funciones de este módulo son no-ops
// — el sitio sigue funcionando igual sin la cuenta de Sentry creada.
const enabled = Boolean(process.env.SENTRY_DSN);

if (enabled) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "production",
    tracesSampleRate: 0,
  });
}

export function captureError(err) {
  if (enabled) Sentry.captureException(err);
}

export const sentryEnabled = enabled;
