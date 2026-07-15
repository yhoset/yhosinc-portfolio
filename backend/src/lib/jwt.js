import jwt from "jsonwebtoken";

const ADMIN_EXPIRES_IN = "2h";
const VISITOR_EXPIRES_IN = "30d";

// Los dos tipos de token comparten el mismo JWT_SECRET, así que el claim
// "role" es lo único que los distingue — cada verify() de abajo lo chequea
// explícitamente y rechaza cualquier token del rol equivocado, aunque esté
// firmado correctamente. Sin este chequeo, un token de visitante sería
// indistinguible de uno de admin y podría usarse para entrar al panel.
export function signAdminToken(adminUser) {
  return jwt.sign({ sub: adminUser.id, email: adminUser.email, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: ADMIN_EXPIRES_IN,
  });
}

export function verifyAdminToken(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  if (payload.role !== "admin") {
    throw new Error("Token no es de administrador");
  }
  return payload;
}

export function signVisitorToken(visitorUser) {
  return jwt.sign(
    { sub: visitorUser.id, email: visitorUser.email, name: visitorUser.name, role: "visitor" },
    process.env.JWT_SECRET,
    { expiresIn: VISITOR_EXPIRES_IN }
  );
}

export function verifyVisitorToken(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  if (payload.role !== "visitor") {
    throw new Error("Token no es de visitante");
  }
  return payload;
}
