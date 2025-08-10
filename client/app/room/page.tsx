"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ROOMS } from "../../graphql/queries";
import {
  CREATE_GROUP,
  JOIN_GROUP,
  GET_OR_CREATE_CHAT,
} from "../../graphql/mutation";
import { motion } from "framer-motion";
import { MessageCircle, Users, Plus, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_ROOMS);
  const [createGroup] = useMutation(CREATE_GROUP);
  const [joinGroup] = useMutation(JOIN_GROUP);
  const [getOrCreateChat] = useMutation(GET_OR_CREATE_CHAT);

  const [searchTerm, setSearchTerm] = useState("");
  const [groupName, setGroupName] = useState("");
  const [joinGroupName, setJoinGroupName] = useState("");
  const [chatUsername, setChatUsername] = useState("");

  if (loading)
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="w-8 h-8 border-4 border-electric-blue/30 border-t-electric-blue rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-red-500 font-medium">Error: {error.message}</p>
      </div>
    );

  const filteredRooms = data.rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    try {
      await createGroup({ variables: { name: groupName } });
      setGroupName("");
      refetch();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleJoinGroup = async () => {
    if (!joinGroupName.trim()) return;
    try {
      await joinGroup({ variables: { name: joinGroupName } });
      setJoinGroupName("");
      refetch();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGetOrCreateChat = async () => {
    if (!chatUsername.trim()) return;
    try {
      await getOrCreateChat({ variables: { username: chatUsername } });
      setChatUsername("");
      refetch();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />

      <div className="pt-24 px-6 max-w-7xl mx-auto flex gap-6">
        {/* Left Column – Create/Join */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create / Join Group / Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Group Name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Button
                className="w-full bg-gradient-to-r from-electric-blue to-neon-green text-white"
                onClick={handleCreateGroup}
              >
                Create Group
              </Button>

              <Input
                placeholder="Group Name to Join..."
                value={joinGroupName}
                onChange={(e) => setJoinGroupName(e.target.value)}
              />
              <Button
                className="w-full bg-gradient-to-r from-electric-blue to-neon-green text-white"
                onClick={handleJoinGroup}
              >
                Join Group
              </Button>

              <Input
                placeholder="Username to Chat..."
                value={chatUsername}
                onChange={(e) => setChatUsername(e.target.value)}
              />
              <Button
                className="w-full bg-gradient-to-r from-electric-blue to-neon-green text-white"
                onClick={handleGetOrCreateChat}
              >
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column – Rooms Grid */}
        <div className="w-full md:w-2/3">
          {/* Search + Create */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative flex-1 ring-2 ring-electric-blue/20 rounded-xl">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search chat rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 rounded-xl border-2 border-transparent bg-card focus:border-electric-blue transition-all duration-300"
              />
            </div>
            <Button className="px-6 py-3 bg-gradient-to-r from-electric-blue to-neon-green text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 border-0">
              <Plus className="mr-2" size={18} />
              Create Room
            </Button>
          </motion.div>

          {/* Rooms Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    href={{
                      pathname: `/room/${room.id}`,
                      query: { name: room.name, createdAt: room.createdAt },
                    }}
                  >
                    <Card className="glassmorphism border-0 card-hover cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 bg-gradient-to-br from-electric-blue to-neon-green rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <MessageCircle className="text-white text-xl" />
                          </div>
                          <div className="text-right">
                            <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle className="text-xl mb-2 group-hover:text-electric-blue transition-colors duration-300">
                          {room.name}
                        </CardTitle>
                        <p className="text-sm opacity-70 mb-3">
                          Created{" "}
                          {new Date(room.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center text-sm opacity-60">
                          <Users size={14} className="mr-1" />
                          <span>Active now</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <MessageCircle className="mx-auto text-6xl opacity-30 mb-4" />
                  <h3 className="text-2xl font-bold mb-2 opacity-70">
                    {searchTerm ? "No rooms found" : "No chat rooms yet"}
                  </h3>
                  <p className="opacity-60 mb-6">
                    {searchTerm
                      ? "Try searching with different keywords"
                      : "Create your first chat room to get started"}
                  </p>
                  {!searchTerm && (
                    <Button className="bg-gradient-to-r from-electric-blue to-neon-green text-white border-0">
                      <Plus className="mr-2" size={18} />
                      Create Your First Room
                    </Button>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
