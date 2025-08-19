import React, { useState } from "react";
import axios from "axios";
import { auth } from "../firebaseAuth";

export default function AdminBalance() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleAddBalance = async (e) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(`${import.meta.env.VITE_API_BASE}/admin/balance/add`, 
        { email, amount: parseFloat(amount) }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Saldo lisätty!");
    } catch (err) {
      setMessage("Virhe: " + err.message);
    }
  };

  return (
    <div className="p-4 border rounded mt-4">
      <h2 className="text-lg font-bold">Lisää saldoa käyttäjälle</h2>
      <form onSubmit={handleAddBalance} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Käyttäjän email"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Summa"
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Lisää saldo
        </button>
      </form>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
