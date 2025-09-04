import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, MessageCircle, Calendar, MapPin, Crown } from "lucide-react";
import { motion } from "framer-motion";

const CommunityGroups = () => {
  const groups = [
    {
      id: 1,
      name: "Breakfast Lovers Club",
      description: "For those who believe breakfast is the most important meal! Share your morning favorites and discoveries.",
      members: 156,
      posts: 89,
      image: "/placeholder.svg",
      isJoined: true,
      isPrivate: false,
      moderator: "Priya Sharma",
      activity: "Very Active",
      tags: ["Breakfast", "Morning", "Health"]
    },
    {
      id: 2,
      name: "Comfort Food Community",
      description: "Nothing beats comfort food on a tough day. Share your go-to comfort meals and find solace in food.",
      members: 203,
      posts: 134,
      image: "/placeholder.svg",
      isJoined: true,
      isPrivate: false,
      moderator: "Rahul Gupta",
      activity: "Active",
      tags: ["Comfort", "Traditional", "Nostalgia"]
    },
    {
      id: 3,
      name: "Coffee & Tea Enthusiasts",
      description: "Caffeine addicts unite! Discuss brewing methods, favorite blends, and perfect pairings.",
      members: 87,
      posts: 45,
      image: "/placeholder.svg",
      isJoined: false,
      isPrivate: false,
      moderator: "Fatima Khan",
      activity: "Moderate",
      tags: ["Coffee", "Tea", "Beverages"]
    },
    {
      id: 4,
      name: "Healthy Eating Hub",
      description: "Share nutritious meal ideas, discuss dietary choices, and support each other's health journeys.",
      members: 134,
      posts: 67,
      image: "/placeholder.svg",
      isJoined: false,
      isPrivate: false,
      moderator: "Dr. Ahmed Ali",
      activity: "Active",
      tags: ["Health", "Nutrition", "Wellness"]
    },
    {
      id: 5,
      name: "Weekend Specials VIP",
      description: "Exclusive group for biryani pre-order discussions and weekend special updates.",
      members: 45,
      posts: 23,
      image: "/placeholder.svg",
      isJoined: true,
      isPrivate: true,
      moderator: "Tiffin Table Admin",
      activity: "Weekly",
      tags: ["VIP", "Specials", "Biryani"]
    }
  ];

  const myGroups = groups.filter(group => group.isJoined);
  const suggestedGroups = groups.filter(group => !group.isJoined);

  const recentActivity = [
    {
      group: "Breakfast Lovers Club",
      user: "Sneha Patel",
      action: "shared a photo of avocado toast",
      time: "2 hours ago"
    },
    {
      group: "Comfort Food Community",
      user: "Karim Ahmed",
      action: "started a discussion about rainy day foods",
      time: "4 hours ago"
    },
    {
      group: "Weekend Specials VIP",
      user: "Admin",
      action: "posted weekend biryani pre-order details",
      time: "1 day ago"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Groups</h2>
          <p className="text-muted-foreground">Join groups that match your food interests</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Groups */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              My Groups ({myGroups.length})
            </h3>
            <div className="grid gap-4">
              {myGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={group.image} />
                            <AvatarFallback>{group.name[0]}</AvatarFallback>
                          </Avatar>
                          {group.isPrivate && (
                            <Crown className="absolute -top-1 -right-1 w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">{group.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{group.description}</p>
                            </div>
                            <Badge variant="secondary">{group.activity}</Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {group.members} members
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {group.posts} posts
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {group.moderator}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              {group.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                              <Button variant="ghost" size="sm">
                                Leave
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Suggested Groups */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Suggested Groups</h3>
            <div className="grid gap-4">
              {suggestedGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (myGroups.length + index) * 0.1 }}
                >
                  <Card className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={group.image} />
                          <AvatarFallback>{group.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">{group.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{group.description}</p>
                            </div>
                            <Badge variant="secondary">{group.activity}</Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {group.members} members
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {group.posts} posts
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              {group.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Button className="bg-primary hover:bg-primary/90" size="sm">
                              Join Group
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{activity.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action} in{" "}
                      <span className="font-medium">{activity.group}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Group Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Group Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Groups Joined</span>
                <Badge>{myGroups.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Posts This Week</span>
                <Badge>12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Comments Made</span>
                <Badge>34</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Likes Received</span>
                <Badge>89</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm">Breakfast Club Meetup</h4>
                <p className="text-xs text-muted-foreground">Saturday, 9:00 AM</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm">Healthy Cooking Workshop</h4>
                <p className="text-xs text-muted-foreground">Next Tuesday, 6:00 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityGroups;