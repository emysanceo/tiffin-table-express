import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Bell, 
  Globe, 
  Moon, 
  LogOut,
  Edit,
  Star,
  Award,
  ShoppingBag,
  Shield,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, signOut, isAdmin } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userStats = [
    { label: "Total Orders", value: "0", icon: ShoppingBag },
    { label: "Favorite Items", value: "0", icon: Star },
    { label: "Points Earned", value: "0", icon: Award },
  ];

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return user.email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen py-6 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1 text-foreground">Profile</h1>
          <p className="text-muted-foreground text-sm">Manage your account</p>
        </div>

        {/* User Info Card */}
        <Card className="mb-6 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground text-xl font-bold">{getInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold truncate">
                  {profile?.full_name || "User"}
                </h2>
                <p className="text-muted-foreground text-sm truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
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
          <Card className="mb-6 border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Admin Panel</p>
                    <p className="text-xs text-muted-foreground">Manage menu, orders & users</p>
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
        <div className="grid grid-cols-3 gap-3 mb-6">
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

        {/* Contact Information */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base flex items-center">
              <User className="w-4 h-4 mr-2" />
              Account Info
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">Email</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
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
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Notifications</span>
              </div>
              <Button variant="ghost" size="sm">
                Configure
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Language</span>
              </div>
              <Button variant="ghost" size="sm">
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
