"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lock, Users, UserPlus, Search, Check, X } from "lucide-react";

interface Friend {
  id: string;
  name: string;
  email: string;
  image?: string;
  status: "accepted" | "pending" | "declined";
  isRequester: boolean;
}

export default function FriendsPage() {
  const { data: session, isPending } = useSession();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchFriends();
    }
  }, [session]);

  const fetchFriends = async () => {
    try {
      const response = await fetch("/api/friends");
      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends || []);
      }
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async () => {
    if (!searchEmail.trim()) return;
    
    setSearchLoading(true);
    try {
      const response = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: searchEmail.trim() }),
      });

      if (response.ok) {
        setSearchEmail("");
        fetchFriends(); // Refresh list
        alert("Friend request sent!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to send friend request");
      }
    } catch (error) {
      console.error("Failed to send friend request:", error);
      alert("Failed to send friend request");
    } finally {
      setSearchLoading(false);
    }
  };

  const respondToRequest = async (friendshipId: string, action: "accept" | "decline") => {
    try {
      const response = await fetch(`/api/friends/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendshipId, action }),
      });

      if (response.ok) {
        fetchFriends(); // Refresh list
      } else {
        const error = await response.json();
        alert(error.error || `Failed to ${action} request`);
      }
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
      alert(`Failed to ${action} request`);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Protected Page</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to manage your friends
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  const acceptedFriends = friends.filter(f => f.status === "accepted");
  const pendingRequests = friends.filter(f => f.status === "pending");

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Friends</h1>
            <p className="text-muted-foreground">Connect with other football fans</p>
          </div>
        </div>

        {/* Add Friend Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add Friend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter friend's email address"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendFriendRequest()}
                className="flex-1"
              />
              <Button 
                onClick={sendFriendRequest} 
                disabled={searchLoading || !searchEmail.trim()}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                {searchLoading ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Pending Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests ({pendingRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading requests...</p>
              ) : pendingRequests.length === 0 ? (
                <p className="text-muted-foreground">No pending requests</p>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{friend.name}</p>
                          <p className="text-xs text-muted-foreground">{friend.email}</p>
                        </div>
                      </div>
                      
                      {friend.isRequester ? (
                        <Badge variant="secondary">Sent</Badge>
                      ) : (
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => respondToRequest(friend.id, "accept")}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => respondToRequest(friend.id, "decline")}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Friends List */}
          <Card>
            <CardHeader>
              <CardTitle>My Friends ({acceptedFriends.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading friends...</p>
              ) : acceptedFriends.length === 0 ? (
                <div className="text-center py-4">
                  <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No friends yet</p>
                  <p className="text-xs text-muted-foreground">Add friends to see their watching experiences</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {acceptedFriends.map((friend) => (
                    <div key={friend.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{friend.name}</p>
                        <p className="text-xs text-muted-foreground">{friend.email}</p>
                      </div>
                      <Badge variant="outline">Friend</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  );
}