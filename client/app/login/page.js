"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../graphql/mutation";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error }] = useMutation(LOGIN);
  const router = useRouter();

  const handleLogin = async () => {
    const { data } = await login({ variables: { username, password } });
    localStorage.setItem("token", data.login.token);
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <input
          className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500 text-sm mt-3">{error.message}</p>}
      </div>
    </div>
  );
}
