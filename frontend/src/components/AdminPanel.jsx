import React, { useState } from 'react'
import { db } from '../firebase'
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'

export default function AdminPanel() {
  const [lotto, setLotto] = useState('')
  const [orig, setOrig] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [title, setTitle] = useState('Arvonta')
  const [status, setStatus] = useState('')

  async function publishResults() {
    try {
      setStatus('Tallennetaan tuloksia ja lähetetään ilmoituksia...')
      await addDoc(collection(db, 'results'), {
        title,
        lottoNumbers: lotto.trim(),
        originalNumbers: orig.trim(),
        videoUrl,
        createdAt: serverTimestamp()
      })
      // Fire-and-forget call to backend to notify users
      await fetch(import.meta.env.VITE_API_BASE + '/notify', { method: 'POST' })
      setStatus('Tulokset tallennettu. Pushit lähtevät.')
    } catch (e) {
      console.error(e)
      setStatus('Virhe tuloksissa: ' + e.message)
    }
  }

  return (
    <div className="card space-y-3">
      <h3 className="text-lg font-semibold">Admin</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col">HenryLotto numerot (esim. 1,2,3,4,5,6,7)
          <input className="border rounded p-2" value={lotto} onChange={e=>setLotto(e.target.value)} />
        </label>
        <label className="flex flex-col">HenryyOriginal numerot (esim. 1,2,3,4,5)
          <input className="border rounded p-2" value={orig} onChange={e=>setOrig(e.target.value)} />
        </label>
        <label className="flex flex-col">Videon URL (YouTube tai suoravideo)
          <input className="border rounded p-2" value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} />
        </label>
        <label className="flex flex-col">Otsikko
          <input className="border rounded p-2" value={title} onChange={e=>setTitle(e.target.value)} />
        </label>
      </div>
      <button className="button" onClick={publishResults}>Julkaise tulokset + push</button>
      <div className="text-sm text-emerald-600">{status}</div>

      <hr className="my-2" />
      <WhatsToken />
    </div>
  )
}

function WhatsToken() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('')

  async function generate() {
    const res = await fetch(import.meta.env.VITE_API_BASE + '/token/new', { method: 'POST' })
    const data = await res.json()
    setStatus('Koodi luotu: ' + data.code + ' – lähetä WhatsAppiin +358442435341')
  }
  async function approve() {
    const res = await fetch(import.meta.env.VITE_API_BASE + '/token/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    const data = await res.json()
    setStatus('Hyväksytty: ' + JSON.stringify(data))
  }

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">WhatsApp-koodit</h4>
      <div className="flex gap-2">
        <button className="button" onClick={generate}>Luo 6-merkkinen koodi</button>
        <input className="border rounded p-2" placeholder="Syötä koodi" value={code} onChange={e=>setCode(e.target.value)} />
        <button className="button" onClick={approve}>Hyväksy koodi</button>
      </div>
      <div className="text-sm">{status}</div>
    </div>
  )
}
