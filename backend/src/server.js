import { app } from "./app.js";
import { captureError } from "./lib/sentry.js";

// Nunca dejar que una petición o un error inesperado tumbe el proceso
// completo — se loggea y el servidor sigue de pie. Los datos (SQLite en
// disco) no se pierden aunque el proceso se reinicie de todas formas.
process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
  captureError(err);
});
process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection:", err);
  captureError(err);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});
