import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Today's Revenue",
      value: "৳2,450",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Orders Today",
      value: "34",
      change: "+8%",
      trend: "up",
      icon: ShoppingBag,
    },
    {
      title: "Active Users",
      value: "156",
      change: "+5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Growth",
      value: "23%",
      change: "-2%",
      trend: "down",
      icon: TrendingUp,
    },
  ];

  const recentOrders = [
    { id: "#001", customer: "Ahmed Khan", total: "৳120", status: "pending", time: "2 min ago" },
    { id: "#002", customer: "Sara Ali", total: "৳85", status: "preparing", time: "5 min ago" },
    { id: "#003", customer: "Rahim Uddin", total: "৳200", status: "completed", time: "10 min ago" },
    { id: "#004", customer: "Fatima Begum", total: "৳150", status: "completed", time: "15 min ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-500";
      case "preparing": return "bg-blue-500/20 text-blue-500";
      case "completed": return "bg-green-500/20 text-green-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`flex items-center text-xs font-medium ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}>
                    {stat.change}
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 ml-0.5" />
                    )}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="bg-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {order.customer.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.id} • {order.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="font-semibold text-foreground">{order.total}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
