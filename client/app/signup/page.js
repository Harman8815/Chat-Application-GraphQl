"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP } from "../../graphql/mutations";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, { loading, error }] = useMutation(SIGNUP);
  const router = useRouter();

  const handleSignup = async () => {
    const { data } = await signup({ variables: { username, email, password } });
    localStorage.setItem("token", data.signup.token);
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Signup</h1>
        <input
          className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
        {error && <p className="text-red-500 text-sm mt-3">{error.message}</p>}
      </div>
    </div>
  );
}
