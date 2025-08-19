import React, { useEffect, useState } from 'react'
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const MIN = 1, MAX = 40

export default function LottoForm({ user }) {
  const [numbers, setNumbers] = useState([])
  const [status, setStatus] = useState('')

  function toggle(n) {
    setNumbers(prev => {
      if (prev.includes(n)) return prev.filter(x => x !== n)
      if (prev.length >= 7) return prev
      return [...prev, n].sort((a,b)=>a-b)
    })
  }

  async function payAndSave() {
    if (!user) return
    if (numbers.length !== 7) { setStatus('Valitse tasan 7 numeroa.'); return }
    setStatus('Tarkistetaan saldo...')
    const uref = doc(db, 'users', user.uid)
    const usnap = await getDoc(uref)
    const balance = usnap.data()?.balance ?? 0
    const price = 1 // 1 yksikkö per rivi
    if (balance < price) { setStatus('Saldo ei riitä.'); return }
    await updateDoc(uref, { balance: balance - price })
    await addDoc(collection(db, 'lotto_entries'), {
      uid: user.uid,
      numbers,
      price,
      createdAt: serverTimestamp(),
      status: 'submitted'
    })
    setNumbers([])
    setStatus('Rivi tallennettu ja maksettu saldosta.')
  }

  return (
    <div className="card space-y-3">
      <h3 className="text-lg font-semibold">HenryLotto – valitse 7 numeroa</h3>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({length: MAX}, (_,i)=>i+1).map(n => (
          <button key={n}
            className={
              'px-2 py-2 rounded-lg border ' +
              (numbers.includes(n) ? 'bg-sky-500 text-white' : 'bg-gray-100')
            }
            onClick={()=>toggle(n)}
          >{n}</button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button className="button" onClick={payAndSave}>Maksa saldosta</button>
        <span className="text-sm text-gray-600">Valitut: {numbers.join(', ') || '-'}</span>
      </div>
      <div className="text-sm text-emerald-600">{status}</div>
    </div>
  )
}
