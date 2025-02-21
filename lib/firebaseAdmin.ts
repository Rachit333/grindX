import admin from "firebase-admin";
import fs from "fs";
import path from "path";

if (!admin.apps.length) {
  const serviceAccountPath = path.join(process.cwd(), "config/firebaseAdmin.json");

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error("Firebase service account key file not found");
  }

  const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf-8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
