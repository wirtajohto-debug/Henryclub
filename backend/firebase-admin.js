import admin from "firebase-admin"

// Expect service account JSON in env GOOGLE_APPLICATION_CREDENTIALS_JSON
const credsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON

if (!credsJson) {
  console.warn(
    "⚠️ Missing GOOGLE_APPLICATION_CREDENTIALS_JSON env. Firebase Admin SDK not initialized."
  )
} else {
  try {
    if (!admin.apps.length) {
      const credentials = JSON.parse(credsJson)
      admin.initializeApp({
        credential: admin.credential.cert(credentials),
      })
      console.log("✅ Firebase Admin SDK initialized")
    }
  } catch (err) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", err)
  }
}

// Export initialized services safely
export const db = admin.apps.length ? admin.firestore() : null
export const messaging = admin.apps.length ? admin.messaging() : null
export default admin
