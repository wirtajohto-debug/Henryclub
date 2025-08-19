import express from "express"
import admin from "firebase-admin"

const router = express.Router()

router.post("/add", async (req, res) => {
  try {
    const { email, amount } = req.body

    if (!req.user || !req.user.admin) {
      return res.status(403).json({ error: "No admin rights" })
    }

    const userRecord = await admin.auth().getUserByEmail(email)
    const userRef = admin.firestore().collection("users").doc(userRecord.uid)

    await admin.firestore().runTransaction(async (t) => {
      const doc = await t.get(userRef)
      const newBalance = (doc.data()?.balance || 0) + amount
      t.set(userRef, { balance: newBalance }, { merge: true })
    })

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
