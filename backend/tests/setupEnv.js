import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import dotenv from "dotenv";

const backendRoot = dirname(dirname(fileURLToPath(import.meta.url)));
dotenv.config({ path: join(backendRoot, ".env.test") });
