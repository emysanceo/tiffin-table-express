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
  ShoppingBag
} from "lucide-react";

const Profile = () => {
  const userStats = [
    { label: "Total Orders", value: "24", icon: ShoppingBag },
    { label: "Favorite Items", value: "8", icon: Star },
    { label: "Points Earned", value: "1,240", icon: Award },
  ];

  const savedAddresses = [
    {
      id: 1,
      type: "Home",
      address: "123 MG Road, Bangalore, Karnataka 560001",
      isDefault: true,
    },
    {
      id: 2,
      type: "Office",
      address: "Tech Park, Electronic City, Bangalore 560100",
      isDefault: false,
    },
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "UPI",
      details: "priya@paytm",
      isDefault: true,
    },
    {
      id: 2,
      type: "Card",
      details: "**** **** **** 1234",
      isDefault: false,
    },
  ];

  return (
    <div className="min-h-screen py-8 container-padding">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gradient">Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-2xl font-bold">PS</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-1">Priya Sharma</h2>
                <p className="text-muted-foreground mb-2">priya.sharma@email.com</p>
                <div className="flex items-center gap-4">
                  <Badge className="bg-accent text-accent-foreground">
                    Gold Member
                  </Badge>
                  <Badge variant="outline">
                    ⭐ 4.8 Community Rating
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {userStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6 text-center">
                <stat.icon className="w-8 h-8 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">priya.sharma@email.com</p>
                  <p className="text-sm text-muted-foreground">Email address</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">+91 9876543210</p>
                  <p className="text-sm text-muted-foreground">Phone number</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Update Contact Info
              </Button>
            </CardContent>
          </Card>

          {/* Saved Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Saved Addresses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedAddresses.map((address) => (
                <div key={address.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={address.isDefault ? "default" : "secondary"}>
                      {address.type}
                    </Badge>
                    {address.isDefault && (
                      <Badge className="bg-accent text-accent-foreground text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{address.address}</p>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                Add New Address
              </Button>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={method.isDefault ? "default" : "secondary"}>
                      {method.type}
                    </Badge>
                    {method.isDefault && (
                      <Badge className="bg-accent text-accent-foreground text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{method.details}</p>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <span>Notifications</span>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span>Language</span>
                </div>
                <Button variant="outline" size="sm">
                  English
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-muted-foreground" />
                  <span>Dark Mode</span>
                </div>
                <Button variant="outline" size="sm">
                  Toggle
                </Button>
              </div>

              <Separator />

              <Button 
                variant="outline" 
                className="w-full text-destructive hover:text-destructive-foreground hover:bg-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              Contact our support team for any questions or issues
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">
                Help Center
              </Button>
              <Button variant="outline">
                Contact Support
              </Button>
              <Button variant="outline">
                Send Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;