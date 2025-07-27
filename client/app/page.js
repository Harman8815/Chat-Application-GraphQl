"use client";
import { useQuery } from "@apollo/client";
import { GET_ROOMS } from "../graphql/queries";
import Link from "next/link";

export default function Home() {
  const { data, loading, error } = useQuery(GET_ROOMS);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error.message}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Chat Rooms</h1>
        <ul className="space-y-3">
          {data.rooms.map((room) => (
            <li key={room.id}>
              <Link
                href={`/room/${room.id}`}
                className="block p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition"
              >
                <span className="text-gray-800 font-medium">{room.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
