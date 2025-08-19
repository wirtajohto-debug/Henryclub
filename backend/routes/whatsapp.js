import { Router } from 'express'
import { db } from '../firebase-admin.js'

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i=0;i<6;i++) s += chars[Math.floor(Math.random()*chars.length)]
  return s
}

const router = Router()

router.post('/new', async (req, res) => {
  try {
    const code = randomCode()
    await db.collection('tokens').doc(code).set({
      code,
      status: 'created',
      createdAt: new Date()
    })
    res.json({ code, sendTo: '+358442435341', hint: 'Lähetä tämä koodi WhatsAppissa yllä olevaan numeroon.' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/approve', async (req, res) => {
  try {
    const { code } = req.body
    if (!code) return res.status(400).json({ error: 'code required' })
    const ref = db.collection('tokens').doc(code)
    const snap = await ref.get()
    if (!snap.exists) return res.status(404).json({ error: 'not found' })
    await ref.update({ status: 'approved', approvedAt: new Date() })
    res.json({ ok: true, code, status: 'approved' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
