import { Router } from 'express'
import admin from 'firebase-admin'

const router = Router()

// GET testiksi selaimella
router.get('/add', (_, res) => {
  res.json({ info: "POST /admin/balance/add {email, amount} lisää saldoa" })
})

router.post('/add', async (req, res) => {
  try {
    const { email, amount } = req.body
    if (!email || !amount) {
      return res.status(400).json({ error: "email ja amount pakollisia" })
    }

    const userRecord = await admin.auth().getUserByEmail(email)
    const userRef = admin.firestore().collection("users").doc(userRecord.uid)

    await admin.firestore().runTransaction(async (t) => {
      const doc = await t.get(userRef)
      const newBalance = (doc.data()?.balance || 0) + amount
      t.set(userRef, { balance: newBalance }, { merge: true })
    })

    res.json({ success: true, email, added: amount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
