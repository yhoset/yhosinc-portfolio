import jwt from "jsonwebtoken";

const EXPIRES_IN = "2h";

export function signAdminToken(adminUser) {
  return jwt.sign({ sub: adminUser.id, email: adminUser.email }, process.env.JWT_SECRET, {
    expiresIn: EXPIRES_IN,
  });
}

export function verifyAdminToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
