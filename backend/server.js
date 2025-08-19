import express from 'express'
import cors from 'cors'
import { db, messaging } from './firebase-admin.js'
import tokenRoutes from './routes/whatsapp.js'
import balanceRoutes from './routes/balance.js'  // ✅ require -> import + .js-pääte

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (_, res) => res.json({ ok: true, service: 'HenryClub API' }))

// Simple notify endpoint: sends a broadcast notification to all users with pushToken
app.post('/notify', async (req, res) => {
  try {
    const usersSnap = await db.collection('users').where('pushToken', '!=', null).get()
    const tokens = usersSnap.docs.map(d => d.data().pushToken).filter(Boolean)
    if (tokens.length === 0) return res.json({ sent: 0 })

    const chunks = []
    const size = 450 // FCM limit is 500
    for (let i = 0; i < tokens.length; i += size) {
      chunks.push(tokens.slice(i, i + size))
    }

    let sent = 0
    for (const group of chunks) {
      const resp = await messaging.sendEachForMulticast({
        tokens: group,
        notification: {
          title: 'HenryClub – arvonnan tulokset',
          body: 'Tulokset on julkaistu. Avaa sovellus!'
        }
      })
      sent += resp.successCount
    }
    res.json({ sent })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

app.use('/token', tokenRoutes)
app.use('/admin/balance', balanceRoutes) // ✅ nyt importattu oikein

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

