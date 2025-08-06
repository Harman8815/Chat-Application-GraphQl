import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
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
  Share
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface ProfileUser {
  id: string;
  username: string;
  email?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  joinedAt: string;
  createdAt: string;
}

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  likes: number;
  createdAt: string;
}

interface Room {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  isPrivate: boolean;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Extract user ID from URL (e.g., /profile/user123 or /profile for current user)
  const userId = location.includes('/profile/') 
    ? location.split('/profile/')[1] 
    : user?.id;

  useEffect(() => {
    if (!userId) return;
    
    setIsOwnProfile(userId === user?.id);
    
    const fetchProfileData = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch(`/api/profile/${userId}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setProfileUser(userData);
        }

        // Fetch user posts
        const postsResponse = await fetch(`/api/profile/${userId}/posts`);
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData);
        }

        // Fetch user rooms
        const roomsResponse = await fetch(`/api/profile/${userId}/rooms`);
        if (roomsResponse.ok) {
          const roomsData = await roomsResponse.json();
          setRooms(roomsData);
        }

        // Fetch user activity
        const activityResponse = await fetch(`/api/profile/${userId}/activity`);
        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setActivities(activityData);
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, user?.id]);

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post': return <MessageSquare className="w-4 h-4" />;
      case 'join_room': return <Users className="w-4 h-4" />;
      case 'create_room': return <Star className="w-4 h-4" />;
      case 'join': return <User className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
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

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">User not found</h2>
            <p className="text-muted-foreground">The profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

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
            {/* Cover Photo Area */}
            <div className="h-48 bg-gradient-to-r from-electric-blue/20 to-neon-green/20 rounded-2xl glassmorphism border-0 mb-6">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-electric-blue/10 to-neon-green/10"></div>
            </div>
            
            {/* Profile Info */}
            <div className="relative -mt-20 px-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                      <AvatarImage src={profileUser.avatar} />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-electric-blue to-neon-green text-white">
                        {getInitials(profileUser.username)}
                      </AvatarFallback>
                    </Avatar>
                    {isOwnProfile && (
                      <Button
                        size="sm"
                        className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-electric-blue hover:bg-electric-blue/80"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h1 className="text-3xl font-bold">{profileUser.username}</h1>
                      <Badge variant="secondary" className="bg-neon-green/20 text-neon-green border-neon-green/30">
                        Active
                      </Badge>
                    </div>
                    
                    {profileUser.bio && (
                      <p className="text-lg text-muted-foreground max-w-md">{profileUser.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {profileUser.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{profileUser.location}</span>
                        </div>
                      )}
                      {profileUser.website && (
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <span>{profileUser.website}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {formatDate(profileUser.joinedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  {isOwnProfile ? (
                    <>
                      <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="bg-gradient-to-r from-electric-blue to-neon-green text-white border-0">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="glassmorphism border-0 text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-electric-blue">{posts.length}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </CardContent>
          </Card>
          <Card className="glassmorphism border-0 text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-neon-green">{rooms.length}</div>
              <div className="text-sm text-muted-foreground">Rooms</div>
            </CardContent>
          </Card>
          <Card className="glassmorphism border-0 text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-electric-blue">
                {posts.reduce((sum, post) => sum + post.likes, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Likes</div>
            </CardContent>
          </Card>
          <Card className="glassmorphism border-0 text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-neon-green">{activities.length}</div>
              <div className="text-sm text-muted-foreground">Activities</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-4 glassmorphism border-0">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="mt-6">
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <Card key={post.id} className="glassmorphism border-0">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={profileUser.avatar} />
                            <AvatarFallback>{getInitials(profileUser.username)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold">{profileUser.username}</span>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(post.createdAt)}
                              </span>
                            </div>
                            <p className="mb-3">{post.content}</p>
                            {post.imageUrl && (
                              <img 
                                src={post.imageUrl} 
                                alt="Post image" 
                                className="rounded-lg max-w-full h-auto mb-3"
                              />
                            )}
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                                <Heart className="w-4 h-4" />
                                <span>{post.likes}</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-electric-blue transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                <span>Reply</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-neon-green transition-colors">
                                <Bookmark className="w-4 h-4" />
                                <span>Save</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="glassmorphism border-0">
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                      <p className="text-muted-foreground">
                        {isOwnProfile ? "Start sharing your thoughts!" : "This user hasn't posted anything yet."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="rooms" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <Card key={room.id} className="glassmorphism border-0 card-hover">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 bg-gradient-to-br from-electric-blue to-neon-green rounded-xl flex items-center justify-center">
                            <Users className="text-white text-lg" />
                          </div>
                          {room.isPrivate && (
                            <Badge variant="outline" className="text-xs">Private</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle className="text-lg mb-2">{room.name}</CardTitle>
                        {room.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {room.description}
                          </p>
                        )}
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{room.memberCount} members</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full">
                    <Card className="glassmorphism border-0">
                      <CardContent className="p-12 text-center">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No rooms joined</h3>
                        <p className="text-muted-foreground">
                          {isOwnProfile ? "Join some rooms to get started!" : "This user hasn't joined any rooms yet."}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-6">
              <Card className="glassmorphism border-0">
                <CardContent className="p-6">
                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-electric-blue/20 to-neon-green/20 rounded-full flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{activity.description}</p>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(activity.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
                      <p className="text-muted-foreground">Activity will appear here as the user engages with the platform.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="photos" className="mt-6">
              <Card className="glassmorphism border-0">
                <CardContent className="p-12 text-center">
                  <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
                  <p className="text-muted-foreground">
                    Photos from posts will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}