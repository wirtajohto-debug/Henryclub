import React, { useState } from 'react'
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

function randomFive(min=1, max=40) {
  const set = new Set()
  while (set.size < 5) {
    set.add(Math.floor(Math.random()*(max-min+1))+min)
  }
  return [...set].sort((a,b)=>a-b)
}

export default function OriginalGame({ user }) {
  const [nums, setNums] = useState([])
  const [status, setStatus] = useState('')

  async function payAndDraw() {
    if (!user) return
    setStatus('Tarkistetaan saldo...')
    const uref = doc(db, 'users', user.uid)
    const usnap = await getDoc(uref)
    const balance = usnap.data()?.balance ?? 0
    const price = 1
    if (balance < price) { setStatus('Saldo ei riitä.'); return }
    await updateDoc(uref, { balance: balance - price })
    const drawn = randomFive()
    setNums(drawn)
    await addDoc(collection(db, 'original_entries'), {
      uid: user.uid,
      numbers: drawn,
      price,
      createdAt: serverTimestamp(),
      status: 'submitted'
    })
    setStatus('Maksettu ja numerot arvottu.')
  }

  return (
    <div className="card space-y-3">
      <h3 className="text-lg font-semibold">HenryyOriginal</h3>
      <button className="button" onClick={payAndDraw}>Maksa</button>
      <div>Numerosi: <strong>{nums.length ? nums.join(', ') : '-'}</strong></div>
      <div className="text-sm text-emerald-600">{status}</div>
    </div>
  )
}
