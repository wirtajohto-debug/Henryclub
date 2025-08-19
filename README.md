# HenryClub (Firebase + Render)

Täysi paketti kahdella pelillä, admin-paneelilla, push-ilmoituksilla ja WhatsApp-koodien hyväksynnällä.

## Sisältö
- `frontend/` React + Vite + Tailwind, Firebase client (Auth, Firestore, Storage, Messaging)
- `backend/` Express-API Renderiin, Firebase Admin SDK (push-lähetys, tokenien hyväksyntä)
- `firebase.rules` Firestore-säännöt

## Asennus – Firebase
1. Luo Firebase-projekti.
2. Ota käyttöön: Authentication (Anonymous), Firestore, Cloud Messaging, Storage.
3. Lataa Service Account JSON → tallenna Renderin env-muuttujaan `GOOGLE_APPLICATION_CREDENTIALS_JSON` (koko JSON sisältönä).
4. Aseta Firestore-säännöt `firebase.rules` sisällöllä (voit muokata admin-vaatimuksia myöhemmin).
5. Lisää web-sovellus ja kopioi konfiguraatiot:
   - `frontend/.env`:
     ```env
     VITE_FB_API_KEY=...
     VITE_FB_AUTH_DOMAIN=...
     VITE_FB_PROJECT_ID=...
     VITE_FB_STORAGE=...
     VITE_FB_MESSAGING=...
     VITE_FB_APP_ID=...
     VITE_FB_VAPID_KEY=...   # jos käytät omia VAPID-avaimia
     VITE_API_BASE=https://<render-app>.onrender.com
     ```
   - Muista myös päivittää `public/firebase-messaging-sw.js` vastaavilla arvoilla.

6. (Valinnainen) Merkitse admin-käyttäjät: lisää `customClaims.admin = true` valituille uid:ille Admin SDK:lla tai Firebase CLI:llä.

## Frontend
```bash
cd frontend
npm install
npm run dev        # paikallisesti
npm run build      # tuotantoon
```
Valmis `dist/` voidaan palvella missä vain (Render Static tai muu).

## Backend (Render)
```bash
cd backend
npm install
# Renderissa:
# - Build command: npm install
# - Start command: node server.js
# - Env: GOOGLE_APPLICATION_CREDENTIALS_JSON = <service account JSON>
# - CORS sallittu vakiona
```

### API-reitit
- `POST /notify` – lähettää broadcast-pushin kaikille joilla on `users.pushToken`.
- `POST /token/new` – luo 6-merkkisen WhatsApp-koodin.
- `POST /token/approve` – admin hyväksyy koodin.

## Käyttö
- **HenryLotto**: valitse 7 numeroa ja Maksa → rivi talletetaan `lotto_entries`.
- **HenryyOriginal**: Maksa → 5 numeroa arvotaan ja talletetaan `original_entries`.
- **Admin**: syötä tulokset + videon URL → näkyy etusivulla (VideoPlayer). Paina julkaisu → `POST /notify` kutsutaan.
- **WhatsApp**: generoi koodi, lähetä numeroon +358442435341, hyväksy admin-paneelista.

## Huomioita
- Tämä on opetuskäyttöön. Ei oikean rahan käsittelyyn.
- Oletussaldo käyttäjälle on 100 (kirjautuessa anonyymisti).
- Voit muuttaa hintoja/rajoja komponenttien sisällä.
