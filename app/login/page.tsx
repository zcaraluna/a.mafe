"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    if (!res || !res.ok) {
      setError("Usuario o contraseña incorrectos");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Ingreso de Administrador</h1>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1">Usuario o email</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            name="username"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            name="password"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Ingresar
        </button>
      </form>
    </div>
  );
} 