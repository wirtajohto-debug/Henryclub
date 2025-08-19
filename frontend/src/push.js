import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export async function savePushToken(uid, token) {
  if (!token) return
  await setDoc(doc(db, 'users', uid), {
    pushToken: token,
    updatedAt: serverTimestamp()
  }, { merge: true })
}
