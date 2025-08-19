import React, { useEffect, useState } from 'react'
import LottoForm from './components/LottoForm.jsx'
import OriginalGame from './components/OriginalGame.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import VideoPlayer from './components/VideoPlayer.jsx'
import { initAuth, setupMessaging } from './firebase'
import { savePushToken } from './push'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export default function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('home')
  const [isAdmin, setIsAdmin] = useState(false)
  const [videoUrl, setVideoUrl] = useState(null)

  useEffect(() => {
    (async () => {
      const u = await initAuth()
      setUser(u)
      const token = await setupMessaging()
      await savePushToken(u.uid, token)
      // bootstrap user with balance if not exists
      const uRef = doc(db, 'users', u.uid)
      const snap = await getDoc(uRef)
      if (!snap.exists()) {
        await setDoc(uRef, { balance: 100, roles: [], displayName: `User_${u.uid.slice(0,6)}` })
      }
      const roles = snap.data()?.roles || []
      setIsAdmin(roles.includes('admin'))
    })()
  }, [])

  useEffect(() => {
    // Load latest draw video url from results collection (if any) is handled in VideoPlayer itself
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">HenryClub</h1>
        <div className="text-sm">{user ? `UID: ${user.uid.slice(0,6)}…` : 'Kirjaudutaan...'}</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="card hover:ring-2" onClick={() => setView('lotto')}>
          <h2 className="text-xl font-semibold">HenryLotto</h2>
          <p>Valitse 7 numeroa, yksi rivi kerrallaan, maksa saldosta.</p>
        </button>
        <button className="card hover:ring-2" onClick={() => setView('original')}>
          <h2 className="text-xl font-semibold">HenryyOriginal</h2>
          <p>Paina maksa → arpoo sinulle 5 numeroa.</p>
        </button>
        <button className="card hover:ring-2" onClick={() => setView('home')}>
          <h2 className="text-xl font-semibold">Etusivu</h2>
          <p>Näe viimeisin arvontavideo ja tiedotteet.</p>
        </button>
      </div>

      <VideoPlayer />

      {view === 'lotto' && <LottoForm user={user} />}
      {view === 'original' && <OriginalGame user={user} />}
      {isAdmin && <AdminPanel />}
      {!isAdmin && (
        <p className="text-xs text-gray-500">
          Vinkki: määritä itsellesi admin-rooli Firestoressa (users.roles = ["admin"]) nähdäksesi admin-paneelin.
        </p>
      )}
    </div>
  )
}
