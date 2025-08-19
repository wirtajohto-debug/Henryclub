import admin from 'firebase-admin'

// Expect service account JSON in env GOOGLE_APPLICATION_CREDENTIALS_JSON
const credsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
if (!credsJson) {
  console.warn('Missing GOOGLE_APPLICATION_CREDENTIALS_JSON env. Admin SDK will not init.')
}
if (!admin.apps.length && credsJson) {
  const credentials = JSON.parse(credsJson)
  admin.initializeApp({
    credential: admin.credential.cert(credentials)
  })
}

export const db = admin.firestore()
export const messaging = admin.messaging()
