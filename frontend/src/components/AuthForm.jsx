import React, { useState } from "react";
import { auth } from "../firebaseAuth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage("Rekisteröinti onnistui!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Kirjautuminen onnistui!");
      }
    } catch (err) {
      setMessage("Virhe: " + err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">{mode === "login" ? "Kirjaudu" : "Rekisteröidy"}</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Sähköposti"
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Salasana"
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          {mode === "login" ? "Kirjaudu" : "Rekisteröidy"}
        </button>
      </form>
      <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-sm mt-2 underline">
        {mode === "login" ? "Luo tili" : "Onko sinulla jo tili?"}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
