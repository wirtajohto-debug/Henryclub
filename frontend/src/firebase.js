import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'

// TODO: Fill these from your Firebase project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY || 'REPLACE_ME',
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN || 'REPLACE_ME.firebaseapp.com',
  projectId: import.meta.env.VITE_FB_PROJECT_ID || 'REPLACE_ME',
  storageBucket: import.meta.env.VITE_FB_STORAGE || 'REPLACE_ME.appspot.com',
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING || 'REPLACE_ME',
  appId: import.meta.env.VITE_FB_APP_ID || 'REPLACE_ME'
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export const initAuth = () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth)
      }
      resolve(auth.currentUser)
    })
  })
}

export const setupMessaging = async () => {
  try {
    const supported = await isSupported()
    if (!supported) return null
    const messaging = getMessaging(app)
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null
    const vapidKey = import.meta.env.VITE_FB_VAPID_KEY || undefined
    const token = await getToken(messaging, { vapidKey })
    onMessage(messaging, (payload) => {
      console.log('Foreground message:', payload)
    })
    return token
  } catch (e) {
    console.warn('FCM not available', e)
    return null
  }
}
