import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Mail, 
  Phone, 
  Bell, 
  Globe, 
  LogOut,
  Star,
  Award,
  ShoppingBag,
  Shield,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfile {
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, signOut, isAdmin } = useAuth();
  const { favorites } = useFavorites();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrderCount();
      checkNotificationPermission();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    
    setProfile(data);
    setLoadingProfile(false);
  };

  const fetchOrderCount = async () => {
    if (!user) return;
    
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    
    setOrderCount(count || 0);
  };

  const checkNotificationPermission = () => {
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  };

  const toggleNotifications = async () => {
    if (!("Notification" in window)) {
      toast.error("Notifications not supported");
      return;
    }

    if (Notification.permission === "granted") {
      setNotificationsEnabled(false);
      toast.info("Notifications disabled");
    } else {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        toast.success("Notifications enabled!");
        
        // Show a test notification
        new Notification("Tiffin Table", {
          body: "You'll receive order updates here!",
          icon: "/favicon.ico"
        });
      } else {
        toast.error("Please enable notifications in browser settings");
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userStats = [
    { label: "Orders", value: orderCount.toString(), icon: ShoppingBag },
    { label: "Favorites", value: favorites.length.toString(), icon: Star },
    { label: "Points", value: "0", icon: Award },
  ];

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return user.email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account</p>
      </div>

      <div className="px-4 pb-24 space-y-4">
        {/* User Info Card */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground text-lg font-bold">{getInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold truncate">
                  {profile?.full_name || "User"}
                </h2>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    Member
                  </Badge>
                  {isAdmin && (
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Access */}
        {isAdmin && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Admin Panel</p>
                    <p className="text-xs text-muted-foreground">Manage menu & orders</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => navigate("/admin")}>
                  Open
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {userStats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-3 text-center">
                <stat.icon className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Account Info */}
        <Card className="border-border/50">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="w-4 h-4" />
              Account Info
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">Email</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{profile?.phone || "Not set"}</p>
                <p className="text-xs text-muted-foreground">Phone</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border-border/50">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm">Settings</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="text-sm">Notifications</span>
                  <p className="text-xs text-muted-foreground">Order updates</p>
                </div>
              </div>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={toggleNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Language</span>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                English
              </Button>
            </div>

            <Separator />

            <Button 
              variant="outline" 
              className="w-full text-destructive hover:text-destructive-foreground hover:bg-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
