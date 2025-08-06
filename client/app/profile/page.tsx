"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { ME } from "@/graphql/queries"; // Your me query here
import {
  User,
  MapPin,
  Globe,
  Calendar,
  Edit3,
  Camera,
  Heart,
  MessageSquare,
  Users,
  Activity,
  Clock,
  Star,
  Bookmark,
  Settings,
  Share,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  const { user } = useAuth();

  // Query current user details
  const { data, loading, error } = useQuery(ME, {
    fetchPolicy: "cache-and-network",
  });

  const profileUser = data?.me || null;

  const getInitials = (username: string) =>
    username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "post":
        return <MessageSquare className="w-4 h-4" />;
      case "join_room":
        return <Users className="w-4 h-4" />;
      case "create_room":
        return <Star className="w-4 h-4" />;
      case "join":
        return <User className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
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
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">User not found</h2>
            <p className="text-muted-foreground">
              Couldn’t fetch your profile data. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const posts = profileUser.posts || [];
  const rooms = profileUser.rooms || [];
  const activities = profileUser.activities || [];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-electric-blue/20 to-neon-green/20 rounded-2xl glassmorphism border-0 mb-6" />
            <div className="relative -mt-20 px-6 flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                  <AvatarImage src={profileUser.avatar} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-electric-blue to-neon-green text-white">
                    {getInitials(profileUser.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold">{profileUser.username}</h1>
                  <p className="text-muted-foreground">{profileUser.email}</p>
                  {profileUser.bio && (
                    <p className="mt-1">{profileUser.bio}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    {profileUser.location && (
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profileUser.location}
                      </span>
                    )}
                    {profileUser.website && (
                      <span className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        {profileUser.website}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {formatDate(profileUser.joinedAt)}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="mt-4 md:mt-0">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{posts.length}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{rooms.length}</div>
              <div className="text-sm text-muted-foreground">Rooms</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {posts.reduce((sum, p) => sum + p.likes, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Likes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{activities.length}</div>
              <div className="text-sm text-muted-foreground">Activities</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span>{post.content}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No posts yet</p>
            )}
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="mt-6">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <Card key={room.id} className="mb-4">
                  <CardContent>
                    <h3>{room.name}</h3>
                    <p>{room.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No rooms joined</p>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-6">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} className="flex items-center space-x-2">
                  {getActivityIcon(act.type)}
                  <span>{act.description}</span>
                </div>
              ))
            ) : (
              <p>No recent activity</p>
            )}
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="mt-6">
            <p>Photos will appear here</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
