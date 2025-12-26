import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  Users, 
  MessageSquare,
  Star
} from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminMenu from "@/components/admin/AdminMenu";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminCommunity from "@/components/admin/AdminCommunity";
import AdminReviews from "@/components/admin/AdminReviews";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "menu", label: "Menu", icon: UtensilsCrossed },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "users", label: "Users", icon: Users },
    { id: "community", label: "Community", icon: MessageSquare },
    { id: "reviews", label: "Reviews", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container-padding py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">Manage your Tiffin Table</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile: Horizontal scrollable tabs */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 mb-4">
            <TabsList className="inline-flex h-auto p-1 bg-card/50 rounded-xl gap-1 min-w-max">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="mt-0">
            <AdminDashboard />
          </TabsContent>
          <TabsContent value="menu" className="mt-0">
            <AdminMenu />
          </TabsContent>
          <TabsContent value="orders" className="mt-0">
            <AdminOrders />
          </TabsContent>
          <TabsContent value="users" className="mt-0">
            <AdminUsers />
          </TabsContent>
          <TabsContent value="community" className="mt-0">
            <AdminCommunity />
          </TabsContent>
          <TabsContent value="reviews" className="mt-0">
            <AdminReviews />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
