import React, { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export default function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState(null)
  const [title, setTitle] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'results'), orderBy('createdAt', 'desc'), limit(1))
    const unsub = onSnapshot(q, (snap) => {
      const doc = snap.docs[0]
      if (doc) {
        const data = doc.data()
        setVideoUrl(data.videoUrl || null)
        setTitle(data.title || 'Viimeisin arvonta')
      }
    })
    return () => unsub()
  }, [])

  if (!videoUrl) return <div className="card">Ei ladattua arvontavideota vielä.</div>

  const isYt = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')

  return (
    <div className="card space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      {isYt ? (
        <div className="aspect-video">
          <iframe className="w-full h-full rounded-xl" src={videoUrl} allowFullScreen />
        </div>
      ) : (
        <video className="w-full rounded-xl" src={videoUrl} controls />
      )}
    </div>
  )
}
