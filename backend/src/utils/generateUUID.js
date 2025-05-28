import crypto from "crypto";

export function generateUniqueId(email, groupName) {
  const hash = crypto.createHash("md5").update(email + groupName).digest("hex");
  return `${email.split("@")[0]}-${hash.slice(0, 6)}`;
}
